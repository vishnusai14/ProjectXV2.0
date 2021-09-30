const mongoose = require("mongoose");

const connect = (url) => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then((response) => {
      //////console.log("response")
    })
    .catch((err) => {
      //////console.log(err)
    });
};
module.exports = {
  connect: connect,
};
