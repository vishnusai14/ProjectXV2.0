require("dotenv").config();
const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const userModel = require("../../database/Schema/schema").userModel;
Router.post("/getworkersupdate", (req, res) => {
  let query;
  let type = req.body.type;
  console.log(type);
  if (req.body.location === "Any Location") {
    query = {};
  } else {
    query = { location: req.body.location };
  }
  console.log(req.body);
  console.log(query);
  userModel.find(query, (err, found) => {
    //console.log("Go")
    let authenticatedUser;
    if (err) {
      //console.log(err)
    } else {
      if (found) {
        // console.log(found)
        //console.log(req.body.skills)
        let result = [];
        found.forEach((user) => {
          //console.log("user")
          req.body.skills.forEach((sk) => {
            //console.log("user")
            // console.log(sk)
            //console.log(user.skills)
            if (user.skills.includes(sk)) {
              result.push({
                id: user._id,
                email: user.email,
                advancedSkills: user.advancedSkills,
                user: user.user,
                img: user.img,
                location: user.location,
                specializedIn: user.specializedIn,
                comapnyName: user.companyName,
                generalInfo: user.generalinfo,
                headline: user.headline,
                position: user.position,
                verify: user.verify,
              });
            }
          });
        });

        // console.log(result)

        let token = req.body.token;
        let filterdResult;
        if (token !== null) {
          try {
            authenticatedUser = jwt.verify(token, secret);
            //console.log(authenticatedUser)
            if (authenticatedUser) {
              filterdResult = result.filter((e) => {
                return e.verify === true && e.email !== authenticatedUser.email;
              });
            }
          } catch (error) {
            //console.log(error)
            res.status(404).send({ data: "Unauthorized" });
            res.end();
          }
        } else {
          filterdResult = result.filter((e) => {
            return e.verify === true;
          });
        }

        let finalResult = [];

        filterdResult.forEach((e) => {
          if (type.includes(e.position)) {
            finalResult.push(e);
          }
        });

        res.status(200).send({ data: finalResult });
        res.end();
      } else {
        res.status(200).send({ data: "No Users Found" });
        res.end();
      }
    }
  });
});

Router.post("/getUserData", (req, res) => {
  let email = req.body.email;
  let users = [];
  userModel.findOne({ email: email }, async (err, result) => {
    if (err) {
      //console.log(err)
    } else {
      if (result) {
        userModel.find({}, (err, found) => {
          if (err) {
            //console.log(Err)
          } else {
            if (found) {
              found.forEach((user) => {
                //console.log(user)
                if (result.favouriteUser.includes(user.email)) {
                  //console.log("Yes")
                  users.push({
                    id: user._id,
                    email: user.email,
                    advancedSkills: user.advancedSkills,
                    user: user.user,
                    img: user.img,
                    location: user.location,
                    specializedIn: user.specializedIn,
                    comapnyName: user.companyName,
                    generalInfo: user.generalinfo,
                    headline: user.headline,
                    position: user.position,
                    verify: user.verify,
                  });
                }
              });
              res.status(200).send({ data: users });
            }
          }
        });
      } else {
        res.status(200).send({ data: "No User" });
      }
    }
  });
});

Router.post("/getusersimage", (req, res) => {
  userModel.find({}, (err, result) => {
    if (result) {
      const data = result.map((e) => {
        return {
          useremail: e.email,
          userimage: e.img,
        };
      });
      res.status(200).send({ data: data });
    } else {
      res.status(400).send({ error: "No User Found" });
    }
  });
});

module.exports = Router;