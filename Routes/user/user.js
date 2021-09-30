require("dotenv").config();
const express = require("express");
const Router = express.Router();
const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../../transporter/transporter").transporter;
const userModel = require("../../database/Schema/schema").userModel;

Router.post("/checkuser", (req, res) => {
  userModel.findOne({ email: req.body.email }, (err, found) => {
    if (err) {
      res.status(500).send({ error: "SomeError" });
      res.end();
    }
    if (!found) {
      res.status(401).send({ error: "No User Exists" });
    } else {
      if (found.verify) {
        if (req.body.email === found.email) {
          bcrypt.compare(req.body.password, found.password, (err, result) => {
            if (result) {
              let data = {
                email: req.body.email,
                user: req.body.user,
              };
              let token = jwt.sign(data, secret);
              let responseData = {
                msg: "Success",
                tokenId: token,
              };

              res.status(200);

              res.send(responseData);

              res.end();
            } else {
              res.status(401).send({ error: "Password Error" });
              res.end();
            }
          });
        } else {
          res.status(401).send({ error: "Check Username Or Password" });
          res.end();
        }
      } else {
        res.status(401).send({ error: "No User Exists" });
      }
    }
  });
});

Router.post("/newuser", (req, res) => {
  userModel.findOne({ email: req.body.email }, (err, found) => {
    if (err) {
      res.status(500).send({ error: "Some Internal Error" });
      res.end();
    }

    if (found) {
      if (
        found.authenticatedWith === "Google" &&
        req.body.authenticatedWith === "Google"
      ) {
        let data = {
          email: req.body.email,
          user: req.body.user,
        };
        let token = jwt.sign(data, secret);

        let responseData = {
          msg: "Success",
          tokenId: token,
        };

        res.status(200);

        res.send(responseData);

        res.end();
      } else if (found.verify === false) {
        userModel.deleteOne({ email: found.email }, (err, result) => {
          if (err) {
            //////console.log(err)
          } else {
            //////console.log(result)
          }
        });
        let hashedPassword = null;
        bcrypt.hash(req.body.password, 2, (err, hash) => {
          hashedPassword = hash;

          let user = new userModel({
            user: req.body.user,
            email: req.body.email,
            password: hashedPassword,
            img: req.body.img,
            location: req.body.location,
            specializedIn: req.body.specializedIn,
            companyName: req.body.companyName,
            generalInfo: req.body.generalInfo,
            headline: req.body.headline.toLowerCase(),
            position: req.body.position,
            skills: req.body.skills,
            authenticatedWith: req.body.authenticatedWith,
            verify: false,
            check: false,
          });

          user.save();
        });

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
          }
        });
        let data = {
          email: req.body.email,
          user: req.body.user,
        };
        let token = jwt.sign(data, secret);

        let responseData = {
          msg: "Success",
          tokenId: token,
          otp: otp_string,
        };

        res.status(200);

        res.send(responseData);

        res.end();
      } else {
        res.status(401).send({ error: "User Already Exist" });
      }
    } else if (req.body.authenticatedWith !== "Google") {
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
        }
      });
      let hashedPassword = null;
      bcrypt.hash(req.body.password, 2, (err, hash) => {
        hashedPassword = hash;

        let user = new userModel({
          user: req.body.user,
          email: req.body.email,
          password: hashedPassword,
          img: req.body.img,
          location: req.body.location,
          specializedIn: req.body.specializedIn,
          companyName: req.body.companyName,
          generalinfo: req.body.generalInfo,
          headline: req.body.headline.toLowerCase(),
          position: req.body.position,
          skills: req.body.skills,
          authenticatedWith: req.body.authenticatedWith,
          verify: false,
          check: false,
        });

        user.save();
      });

      let data = {
        email: req.body.email,
        user: req.body.user,
      };
      let token = jwt.sign(data, secret);

      let responseData = {
        msg: "Success",
        tokenId: token,
        otp: otp_string,
      };

      res.status(200);

      res.send(responseData);

      res.end();
    } else {
      let user = new userModel({
        user: req.body.user,
        email: req.body.email,
        password: req.body.password,
        img: req.body.img,
        location: req.body.location,
        specializedIn: req.body.specializedIn,
        companyName: req.body.companyName,
        generalinfo: req.body.generalInfo,
        headline: req.body.headline.toLowerCase(),
        position: "Person",
        authenticatedWith: req.body.authenticatedWith,
        verify: true,
        check: false,
      });

      user.save();
      let data = {
        email: req.body.email,
        user: req.body.user,
      };
      let token = jwt.sign(data, secret);

      let responseData = {
        msg: "Success",
        tokenId: token,
      };

      res.status(200);

      res.send(responseData);

      res.end();
    }
  });
});

Router.post("/check", (req, res) => {
  let token = req.body.token;

  if (token) {
    let user2 = jwt.verify(token, secret);

    try {
      let user = jwt.verify(token, secret);

      if (user) {
        userModel.findOne({ email: user.email }, (err, found) => {
          if (err) {
            //////console.log(err)
          } else {
            if (found) {
              let result = {
                user: found.user,
                email: found.email,
                img: found.img,
                skills: found.advancedSkills,
                companyName: found.companyName,
                specializedIn: found.specializedIn,
                headline: found.headline,
                info: found.generalinfo,
                location: found.location,
                position: found.position,
                authenticatedWith: found.authenticatedWith,
                check: found.check,
                favouriteUser: found.favouriteUser,
              };

              res.status(200).send({ user: result });
            }
          }
        });
      }
    } catch (err) {
      res.status(401).send({ error: "No User " });
      res.end();
    }
  } else {
    res.status(401).send({ error: "Unauthorized" });
    res.end();
  }
});

Router.post("/newclient", (req, res) => {
  let authData = JSON.parse(req.body.auth);
  let auth = authData["keys"]["auth"];
  // //console.log(auth)
  let endPoint = authData["endpoint"];
  let pdKey = authData["keys"]["p256dh"];
  // //console.log(pdKey)
  let email = req.body.email;

  userModel.findOneAndUpdate(
    { email: email },
    { clientEndPoint: endPoint, clientAuth: auth, clientPdKey: pdKey },
    (err, result) => {
      if (err) {
        //console.log(err)
      } else {
        //console.log(result)
      }
    }
  );
});
module.exports = Router;
