const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const http = require("http");
const { setupWebSocket } = require("./websockets");

const app = express();

const server = http.Server(app);
setupWebSocket(server);

mongoose.connect(
  "mongodb+srv://omnistack10:omnistack@cluster0-9p9po.mongodb.net/omnistack10?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

app.use(cors());

/** TO UNDERSTAND JSON BODY */
app.use(express.json());

/** ROUTES */
app.use(routes);

server.listen(3333);
console.log("Server running on 3333");
