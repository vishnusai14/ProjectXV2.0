//Node-Modules

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

//Our-Modules
const connect = require("./database/dbConnect");
const schema = require("./database/Schema/schema");
const socketConnection = require("./socket/socketStuff");

//Database Connection

const url = "mongodb://localhost:27017/projectx";
connect.connect(url);

//Initialize Our App
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log("Server Started on The Specified PORT");
});
socketConnection.connect(server);

app.get("/", (req, res) => {
  res.status(200).send({ data: "Ok" });
  res.end();
});

app.use("/api/v1/otp", require("./Routes/OTP/otp"));

app.use("/api/v1/message", require("./Routes/message/message"));

app.use("/api/v1/user", require("./Routes/user/user"));

app.use("/api/v1/search", require("./Routes/search/search"));

app.use("/api/v1/userAction", require("./Routes/userAction/userAction"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
