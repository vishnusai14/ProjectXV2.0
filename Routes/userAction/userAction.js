require("dotenv").config();
const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const userModel = require("../../database/Schema/schema").userModel;

Router.post("updateprofile", (req, res) => {
  let token = req.body.token;

  if (token) {
    let update = {
      user: req.body.newUserName,
      img: req.body.newimage,
      location: req.body.newlocation,
      generalinfo: req.body.newinfo,
      advancedSkills: req.body.newskills,
      specializedIn: req.body.newSpecializedIn,
      companyName: req.body.newCompanyName,
      headline: req.body.newHeadline.toLowerCase(),
    };
    try {
      let user = jwt.verify(token, secret);

      if (user) {
        userModel.findOneAndUpdate(
          { email: user.email },
          update,
          (err, result) => {
            if (err) {
              //////console.log(err)
            } else {
              if (result) {
                res.status(200).send({ data: result });
              } else {
                res.status(401).send({ data: "Error" });
              }
            }
          }
        );
      }
    } catch (err) {
      res.status(500).send({ data: "Error" });
    }
  }
});

Router.post("/addFavourite", (Req, res) => {
  let token = req.body.token;
  let favouriteUser = req.body.email;

  try {
    let user = jwt.verify(token, secret);
    if (user) {
      userModel.findOneAndUpdate(
        { email: user.email },
        { $push: { favouriteUser: favouriteUser } },
        (Err, re) => {
          if (Err) {
            //console.log(Err)
          } else {
            res.status(200).send({ data: "added" });
          }
        }
      );
    } else {
      res.status(400).send({ data: "unAuthorized" });
    }
  } catch (err) {
    //console.log(err)
    res.status(400).send({ data: "unAuthorized" });
  }
});

Router.post("/removeFavourite", (req, res) => {
  let token = req.body.token;
  let favouriteUser = req.body.email;

  try {
    let user = jwt.verify(token, secret);
    if (user) {
      userModel.findOneAndUpdate(
        { email: user.email },
        { $pull: { favouriteUser: favouriteUser } },
        (Err, re) => {
          if (Err) {
            //console.log(Err)
          } else {
            res.status(200).send({ data: "Removed" });
            //console.log(re)
          }
        }
      );
    } else {
      res.status(400).send({ data: "unAuthorized" });
    }
  } catch (err) {
    res.status(400).send({ data: "unAuthorized" });
  }
});

Router.post("/changepref", (req, res) => {
  let email = req.body.email;
  let check = req.body.check;
  userModel.findOneAndUpdate(
    { email: email },
    { check: check },
    (err, result) => {
      if (err) {
        ////console.log(err)
      } else {
        res.status(200).send({ response: "ok" });
      }
    }
  );
});
module.exports = Router;