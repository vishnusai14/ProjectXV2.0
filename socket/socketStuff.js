const socket = require("socket.io");

const schema = require("../database/Schema/schema");
const socketModel = schema.socketModel;
const userModel = schema.userModel;
const transporter = require("../transporter/transporter").transporter;
const push = require("../notification/notification").push;

const socketConnection = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  //IO Connection Stuffs

  io.on("connection", async (socket) => {
    socket.on("name", (data) => {
      socketModel.findOne({ clientEmail: data.email }, (err, res) => {
        if (err) {
          //////console.log(err)
        } else {
          if (res) {
            socketModel.findOneAndUpdate(
              { clientEmail: data.email },
              { clientId: socket.id },
              (err, result) => {
                if (err) {
                  //////console.log(err)
                } else {
                  //////console.log("result")
                }
              }
            );
          } else {
            let newData = new socketModel({
              clientEmail: data.email,
              clientId: socket.id,
              clientName: data.name,
            });

            newData.save();
          }
        }
      });
      userModel.findOne({ email: data.email }, (err, result) => {
        if (err) {
          //////console.log(err)
        } else {
          if (result) {
            socket.emit("oldmessages", result.msg);
          } else {
            //////console.log("No User")
          }
        }
      });
      let user_data = {
        id: socket.id,
      };
      socket.emit("id", user_data.id);
    });

    socket.on("groupmsg", (data) => {
      let { receiverEmails, msg, sender, time } = data;

      //console.log(receiverEmails)

      socketModel.find({}, (err, result) => {
        if (err) {
          //////console.log(err)
        } else {
          if (result) {
            let senderArray = result.filter((e) => {
              return e.clientId === sender;
            });
            let senderEmail = senderArray[0].clientEmail;
            let senderName = senderArray[0].clientName;
            // //////console.log(senderEmail)
            userModel.findOne({ email: senderEmail }, (err, found) => {
              if (err) {
                //////console.log(err)
              } else {
                if (found) {
                  receiverEmails.forEach((receiverData) => {
                    let newmsg = {
                      receiverName: receiverData.user,
                      msg: msg,
                      isReceived: false,
                      receiver: receiverData.email,
                      time: time,
                    };
                    userModel.findOneAndUpdate(
                      { email: senderEmail },
                      { $push: { msg: newmsg } },
                      (err, res) => {
                        if (err) {
                          //////console.log(err)
                        } else {
                          // //////console.log(res)
                        }
                      }
                    );
                  });

                  let newmsg2 = {
                    msg: msg,
                    isReceived: true,
                    sender: senderEmail,
                    senderName: senderName,
                    time: time,
                  };

                  receiverEmails.forEach((receiverData) => {
                    userModel.findOneAndUpdate(
                      { email: receiverData.email },
                      { $push: { msg: newmsg2 } },
                      (err, res) => {
                        if (err) {
                          //////console.log(err)
                        } else {
                          let mailOptions = {
                            from: process.env.GMAIL,
                            to: receiverData.email,
                            subject: "New Message",
                            html: `A New Message Is Received Please Check That..<hr /> Use Mute Notification In Your Page To Not to receive The Email Message`,
                          };

                          userModel.findOne(
                            { email: receiverData.email },
                            (err, result) => {
                              if (err) {
                                ////console.log(err)
                              } else {
                                if (!result.check) {
                                  transporter.sendMail(
                                    mailOptions,
                                    function (error, info) {
                                      if (error) {
                                        //////console.log(error);
                                      } else {
                                        ////console.log('Email sent: ' + info.response);
                                      }
                                    }
                                  );
                                }
                              }
                            }
                          );
                        }
                      }
                    );
                  });
                } else {
                  //////console.log("No User Found")
                }
              }
            });
            result.forEach((e) => {
              ////console.log(e)
              receiverEmails.forEach((Rdata) => {
                if (Rdata.email === e.clientEmail) {
                  let data = {
                    user: e.clientEmail,
                    msg: msg,
                    sender: senderEmail,
                    time: time,
                  };
                  //////console.log(data)
                  io.to(e.clientId).emit("message", data);
                }
              });
              //////console.log("Yes")
            });
          }
        }
      });
    });

    socket.on("msg", (data) => {
      //////console.log(data)

      let { receiverEmail, msg, sender, receiverName, time } = data;
      //////console.log(receiverName)
      socketModel.find({}, (err, result) => {
        if (err) {
          //////console.log(err)
        } else {
          if (result) {
            let senderArray = result.filter((e) => {
              return e.clientId === sender;
            });
            let senderEmail = senderArray[0].clientEmail;
            let senderName = senderArray[0].clientName;
            // //////console.log(senderEmail)
            userModel.findOne({ email: senderEmail }, (err, found) => {
              if (err) {
                //////console.log(err)
              } else {
                if (found) {
                  let newmsg = {
                    msg: msg,
                    isReceived: false,
                    receiver: receiverEmail,
                    receiverName: receiverName,
                    time: time,
                  };
                  userModel.findOneAndUpdate(
                    { email: senderEmail },
                    { $push: { msg: newmsg } },
                    (err, res) => {
                      if (err) {
                        //////console.log(err)
                      } else {
                        // //////console.log(res)
                      }
                    }
                  );

                  let newmsg2 = {
                    msg: msg,
                    isReceived: true,
                    sender: senderEmail,
                    senderName: senderName,
                    time: time,
                  };

                  userModel.findOneAndUpdate(
                    { email: receiverEmail },
                    { $push: { msg: newmsg2 } },
                    (err, res) => {
                      if (err) {
                        //////console.log(err)
                      } else {
                        let mailOptions = {
                          from: process.env.GMAIL,
                          to: receiverEmail,
                          subject: "New Message",
                          html: `A New Message Is Received Please Check That..<hr /> Use Mute Notification In Your Page To Not to receive The Email Message`,
                        };
                        userModel.findOne(
                          { email: receiverEmail },
                          (err, result) => {
                            if (err) {
                              ////console.log(err)
                            } else {
                              if (!result.check) {
                                let sub = {
                                  endpoint: result.clientEndPoint,
                                  expirationTime: null,
                                  keys: {
                                    p256dh: result.clientPdKey,
                                    auth: result.clientAuth,
                                  },
                                };
                                push
                                  .sendNotification(sub, "text message")
                                  .then((res) => {
                                    //console.log(res)
                                  })
                                  .catch((err) => {
                                    //console.log(err)
                                  });

                                transporter.sendMail(
                                  mailOptions,
                                  function (error, info) {
                                    if (error) {
                                      //////console.log(error);
                                    } else {
                                      ////console.log('Email sent: ' + info.response);
                                    }
                                  }
                                );
                              }
                            }
                          }
                        );
                      }
                    }
                  );
                } else {
                  //////console.log("No User Found")
                }
              }
            });
            result.forEach((e) => {
              if (e.clientEmail === receiverEmail) {
                let data = {
                  user: receiverEmail,
                  msg: msg,
                  sender: senderEmail,
                  time: time,
                };
                //////console.log(data)
                io.to(e.clientId).emit("message", data);
              }
            });
          }
        }
      });
    });

    socket.on("disconnect", () => {
      socketModel.deleteOne({ clientId: socket.id }, (err, res) => {
        if (err) {
          //////console.log(err)
        } else {
          //////console.log("Deleted")
        }
      });
    });
  });
};

module.exports = {
  connect: socketConnection,
};
