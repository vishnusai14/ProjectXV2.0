import React, { Component } from "react";
import { withRouter } from "react-router";
import UserChat from "../Userchat/UserChat";
import logo from "../../assests/images/logo.png";
import { socket } from "../../services/socket";
import instance from "../../axios/axios";

class SideBar extends Component {
  nameRef = React.createRef();

  state = {
    msg: [],
    newmsgvalue: "",
    id: "",
    msgLoading: false,
  };
  chatContainer = React.createRef();

  componentDidMount = () => {
    if (this.props.msg.length === 0) {
      window.location.href = "/";
    }
    let isValid = localStorage.getItem("valid");

    if (!isValid) {
      window.location.href = "/";
    }

    socket.on("message", (data) => {
      let senddata = {
        msg: data.msg,
        isReceived: true,
        time: data.time,
      };
      this.setState((prevState) => ({
        ...prevState,
        msg: [...prevState.msg, senddata],
      }));
    });
  };

  textAreaHandler = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      newmsgvalue: e.target.value,
    }));
  };

  submitHandler = (e) => {
    let time = new Date().toLocaleString();
    e.preventDefault();
    let data = {
      isReceived: false,
      msg: this.state.newmsgvalue,
      time: time,
    };
    this.setState((prevState) => ({
      ...prevState,
      msg: [...this.state.msg, data],
    }));

    let emitData = {
      receiverEmail: this.state.id,
      msg: this.state.newmsgvalue,
      sender: localStorage.getItem("SOCKET_ID"),
      receiverName: this.nameRef.current.innerText,
      time: time,
    };

    if (emitData === null) {
      return;
    } else {
      socket.emit("msg", emitData);
    }
    this.setState((prevState) => ({
      ...prevState,
      newmsgvalue: "",
    }));
  };

  viewMsg = (e) => {
    //////console.log(e)
    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    let data = {
      email: this.props.email,
    };
    instance
      .post("/message/oldmessage", data)
      .then((response) => {
        if (response.data) {
          let dups = response.data.data.filter((val) => {
            return (val.receiver || val.sender) === e.target.id;
          });
          this.setState((prevState) => ({
            ...prevState,
            msg: dups,
            id: e.target.id,
            isLoading: false,
          }));
        }
      })
      .catch((err) => {
        //////console.log(err)
        this.setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      });
  };

  render() {
    let msg = this.props.msg;
    const filteredArr = msg.reduce((acc, current) => {
      let x;
      x = acc.find(
        (item) =>
          (item.receiver || item.sender) ===
          (current.sender || current.receiver)
      );

      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    const arr = [];
    //console.log(this.props.userimg);
    filteredArr.forEach((e) => {
      this.props.userimg.forEach((user) => {
        if ((e.receiver || e.sender) === user.useremail) {
          arr.push({
            ...e,
            img: user.userimage,
          });
        }
      });
    });

    //console.log(msg);

    //console.log(filteredArr);

    return (
      <>
        <div className="layout">
          <div className="sidebar" id="sidebar">
            <div className="container">
              <div className="col-md-12">
                <div className="tab-content">
                  <div id="discussions" className="tab-pane fade active show">
                    <div className="discussions">
                      <h1>Discussions</h1>
                      <div className="list-group" id="chats" role="tablist">
                        {arr.map((e) => {
                          //consol.log(e)
                          let ele = (
                            <div key={Math.random()}>
                              <a
                                key={Math.random()}
                                href="#list-chat"
                                className="filterDiscussions all unread single "
                                id="list-chat-list"
                                data-toggle="list"
                                role="tab"
                              >
                                <img
                                  key={Math.random()}
                                  className="avatar-md"
                                  src={e.img === "" ? logo : e.img}
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title="Janette"
                                  alt="avatar"
                                />

                                <div
                                  aria-readonly={true}
                                  value={
                                    e.isReceived
                                      ? e.senderEmail
                                      : e.receiverEmail
                                  }
                                  key={Math.random()}
                                  className="data"
                                >
                                  <h5
                                    ref={this.nameRef}
                                    onClick={(e) => {
                                      this.viewMsg(e);
                                    }}
                                    key={Math.random()}
                                    id={e.isReceived ? e.sender : e.receiver}
                                  >
                                    {e.isReceived
                                      ? e.senderName
                                      : e.receiverName}
                                  </h5>
                                </div>
                              </a>
                            </div>
                          );
                          return <>{ele}</>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <>
            <div className="main">
              <div className="tab-content" id="nav-tabContent">
                <div
                  className="babble tab-pane fade active show"
                  id="list-chat"
                  role="tabpanel"
                  aria-labelledby="list-chat-list"
                >
                  <div ref={this.chatContainer} className="chat" id="chat1">
                    <div className="top" style={{ marginTop: "100px" }}>
                      <div className="container">
                        <div className="col-md-12">
                          <div className="inside">
                            <div className="data">
                              <h5>
                              {/* eslint-disable-next-line  */}
                                <a href="#">{this.state.id}</a>
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {this.state.msgLoading ? (
                      <h1>Loading</h1>
                    ) : (
                      <UserChat msg={this.state.msg} />
                    )}

                    <div className="container">
                      <div className="col-md-12">
                        <div
                          className="bottom"
                          style={{ padding: "0px", marginTop: "-40px" }}
                        >
                          <form className="position-relative w-100">
                            <textarea
                              value={this.state.newmsgvalue}
                              onChange={(e) => {
                                this.textAreaHandler(e);
                              }}
                              className="form-control"
                              placeholder={
                                this.state.id !== ""
                                  ? "Start Typing"
                                  : "Please Select The User"
                              }
                              rows="1"
                            ></textarea>
                            <button
                              disabled={this.state.id !== "" ? false : true}
                              onClick={(e) => {
                                this.submitHandler(e);
                              }}
                              className="btn send"
                            >
                              <i className="far fa-paper-plane"></i>
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      </>
    );
  }
}

export default withRouter(SideBar);
