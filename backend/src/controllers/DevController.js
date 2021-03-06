const Dev = require("../models/Dev");
const axios = require("axios");
const parseStringAsArray = require("../utils/parseStringAsArray");

const { findConnections, sendMessage } = require("../websockets");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const response = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const techsArray = parseStringAsArray(techs);

      const { name = login, avatar_url, bio } = response.data;

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      console.log(location);

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      const sendToSocketMessage = findConnections(
        { latitude, longitude },
        techsArray
      );

      sendMessage(sendToSocketMessage, "new-dev", dev);

      return res.json(dev);
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  }
};
