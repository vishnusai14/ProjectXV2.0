require("dotenv").config();
const express = require("express");
const Router = express.Router();
const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../../transporter/transporter").transporter;
const userModel = require("../../database/Schema/schema").userModel;
Router.post("/checkotp", (req, res) => {
  let token = req.body.token;
  let otp = req.body.otp;
  let otp_crypt = req.body.otp_crypt;

  if (token) {
    try {
      let user = jwt.verify(token, secret);
      if (user) {
        bcrypt.compare(otp.toString(), otp_crypt, (err, result) => {
          if (result) {
            userModel.updateOne(
              { email: user.email },
              { verify: true },
              (err, result) => {
                if (err) {
                  //////console.log(err)
                } else {
                  res.status(200).send(token);
                }
              }
            );
          } else {
            res.status(401).send({ error: "Check The Otp " });
            res.end();
          }
        });
      }
    } catch (err) {
      res.status(401).send({ error: "No User " });
      res.end();
    }
  } else {
    res.status(401).send({ error: "Unauthorized" });
  }
});

Router.post("/resend", (req, res) => {
  const otp = Math.ceil(Math.random() * 10000);
  const otp_string = otp.toString();
  let mailOptions = {
    from: process.env.GMAIL,
    to: req.body.email,
    subject: "OTP",
    html: `<h3>Your OTP is : </h3><br />${otp}`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      //////console.log(error);
    } else {
      //////console.log('Email sent: ' + info.response);

      res.status(200).send({ data: "Ok" });
    }
  });
});
module.exports = Router;