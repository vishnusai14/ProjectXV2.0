const express = require("express");
const Router = express.Router();
const userModel = require("../../database/Schema/schema").userModel;

Router.post("/oldmessage", (req, res) => {
  let email = req.body.email;
  userModel.findOne({ email: email }, (err, result) => {
    if (err) {
      //////console.log(err)
    } else {
      if (result) {
        res.status(200).send({ data: result.msg });
      } else {
        res.status(401).send({ err: "Some Error" });
      }
    }
  });
});

module.exports = Router;
