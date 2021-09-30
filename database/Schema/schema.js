const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  authenticatedWith: {
    type: String,
  },
  verify: {
    type: Boolean,
  },
  img: {
    type: String,
  },
  location: {
    type: String,
  },
  generalinfo: {
    type: String,
  },
  advancedSkills: {
    type: Array,
  },
  headline: {
    type: String,
  },
  position: {
    type: String,
  },
  specializedIn: {
    type: String,
  },
  companyName: {
    type: String,
  },
  msg: {
    type: Array,
  },
  check: {
    type: Boolean,
  },
  clientEndPoint: {
    type: String,
  },
  clientAuth: {
    type: String,
  },
  clientPdKey: {
    type: String,
  },
  skills: {
    type: Array,
  },
  favouriteUser: {
    type: Array,
  },
});

const socketSchema = new mongoose.Schema({
  clientId: {
    type: String,
  },
  clientEmail: {
    type: String,
  },
  clientName: {
    type: String,
  },
});

const userModel = mongoose.model("user", userSchema);
const socketModel = mongoose.model("socketstuff", socketSchema);

module.exports = {
  userModel: userModel,
  socketModel: socketModel,
};
