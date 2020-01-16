const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");

const app = express();

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

app.listen(3333);
console.log("Server running on 3333");
