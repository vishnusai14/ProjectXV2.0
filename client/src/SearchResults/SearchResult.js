import React, { Component } from "react";
import classes from "./SearchResult.module.css";
import HeaderAccord from "../HeaderAccord/HeaderAccord";
import logo from "../assests/images/logo.png";
import Spinner from "../Spinner/Spinner";
import instance from "../axios/axios";
import { Redirect } from "react-router";
import { socket } from "../services/socket";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Nav from "../nav/Nav";
class CoWorkers extends Component {
  state = {
    isLoading: true,
    isAdmin: false,
    selctedMember: [],
    msg: "",
    openModal: false,
    userdata: [],
    check: "",
    authenticatedWith: "",
    email: "",
    username: "",
    img: null,
  };

  componentDidMount = () => {
    if (this.props.location.state === undefined) {
      return;
    }
    for (var i = 0; i < localStorage.length; i++) {
      if (
        localStorage.key(i) !== "SSUID" &&
        localStorage.key(i) !== "SOCKET_ID" &&
        localStorage.key(i) !== "valid"
      ) {
        localStorage.removeItem(localStorage.key(i));
      }
    }
    console.log("Mount");
    let data = {
      location: this.props.location.state.location,
      skills: this.props.location.state.selected,
      type: this.props.location.state.type,
      token: localStorage.getItem("SSUID"),
    };
    instance
      .post("/search/getworkersupdate", data)
      .then((res) => {
        console.log(res);
        this.setState((prevState) => ({
          ...prevState,
          userdata: res.data,
          isLoading: false,
          isAdmin: this.props.location.state.isAdmin,
          check: this.props.location.state.check,
          authenticatedWith: this.props.location.state.authenticatedWith,
          email: this.props.location.state.email,
          username: this.props.location.state.username,
          img: this.props.location.state.img,
        }));
      })
      .catch((err) => {
        this.setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      });
  };

  selectHandler = (e, user) => {
    let selectedPeople = this.state.selctedMember;
    if (e.target.checked) {
      let data = {
        email: e.target.value,
        user: user,
      };
      selectedPeople.push(data);
    } else {
      selectedPeople = selectedPeople.filter((people) => {
        return people.email !== e.target.value;
      });
    }

    this.setState((prevState) => ({
      ...prevState,
      selctedMember: selectedPeople,
    }));
    ////console.log(this.state.selctedMember)
  };

  textAreaHandler = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      msg: e.target.value,
    }));
  };

  sendMsg = (e, user) => {
    e.preventDefault();
    let emitData = {
      receiverName: user,
      receiverEmail: e.target.value,
      msg: this.state.msg,
      sender: localStorage.getItem("SOCKET_ID"),
      time: new Date().toLocaleString(),
    };
    socket.emit("msg", emitData);
    this.setState((prevState) => ({
      ...prevState,
      openModal: true,
    }));
    ////console.log(this.state)
  };

  msgSubmitHanlder = (e) => {
    e.preventDefault();
    if (this.state.selctedMember.length <= 0) {
      return;
    }
    let emitData = {
      receiverEmails: this.state.selctedMember,
      msg: this.state.msg,
      sender: localStorage.getItem("SOCKET_ID"),
      time: new Date().toLocaleString(),
    };

    socket.emit("groupmsg", emitData);
    this.setState((prevState) => ({
      ...prevState,
      openModal: true,
    }));
    ////console.log(this.state)
  };

  viewProfile = (e, id) => {
    e.preventDefault();
    let array = this.state.userdata.data;
    let newArray = array.filter((i) => {
      return i.id === id;
    });
    this.props.history.push({
      pathname: "/worker-details",
      state: newArray,
    });
  };
  closeModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      openModal: false,
    }));
  };
  msgSubmitHanlderAll = (e, userArray) => {
    e.preventDefault();
    let selectedMember = [];
    userArray.forEach((user) => {
      selectedMember.push({
        email: user.email,
        user: user.user,
      });
    });
    let emitData = {
      receiverEmails: selectedMember,
      msg: this.state.msg,
      sender: localStorage.getItem("SOCKET_ID"),
      time: new Date().toLocaleString(),
    };
    // //console.log(emitData)

    socket.emit("groupmsg", emitData);
    this.setState((prevState) => ({
      ...prevState,
      openModal: true,
    }));
  };

  render() {
    console.log(this.state);

    let filteredArr = [];
    if (this.state.userdata.data !== undefined) {
      filteredArr = this.state.userdata.data.reduce((acc, current) => {
        //consol.log(acc)
        //consol.log(current)
        let x;
        x = acc.find((item) => item.email === current.email);

        //consol.log(x)
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
    }

    let noUser = (
      <div className={classes.selectionwrapper}>
        <strong style={{ position: "relative", top: "-70px" }}>
          No User Found
        </strong>
      </div>
    );
    ////console.log(this.props)
    return this.props.location.state === undefined ? (
      <Redirect to="/"></Redirect>
    ) : this.state.isLoading ? (
      <Spinner />
    ) : (
      <>
        <Dialog
          open={this.state.openModal}
          onClose={() => {
            this.closeModal();
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Message Sent"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Message Has Been Sent SuccessFully To The Client
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.closeModal();
              }}
              color="primary"
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>

        {this.state.isAdmin ? (
          <Nav
            check={this.state.check}
            email={this.state.email}
            auth={this.state.authenticatedWith}
            image={this.state.img}
            isAdmin={this.state.isAdmin}
            username={this.state.username}
          />
        ) : (
          <Nav
            check={this.state.check}
            email={this.state.email}
            auth={this.state.authenticatedWith}
            image={this.state.img}
            isAdmin={this.state.isAdmin}
            username=""
          />
        )}

        {this.state.userdata.data === "No User Found" ? (
          noUser
        ) : (
          <div className={classes.main}>
            <div className={classes.header}>
              <HeaderAccord
                type={this.props.location.state.type}
                items={this.props.location.state.accordSelected}
                location={this.props.location.state.location}
              />
            </div>
            <strong>{filteredArr.length} Number Of Users Found</strong>
            <div className={classes.container2}>
              <form className="position-relative w-100">
                <textarea
                  style={{ width: "300px", height: "100px" }}
                  value={this.state.newmsgvalue}
                  onChange={(e) => {
                    this.textAreaHandler(e);
                  }}
                  placeholder={
                    this.state.id !== ""
                      ? "Start Typing"
                      : "Please Select The User"
                  }
                  rows="1"
                ></textarea>
              </form>
              <button
                onClick={(e) => {
                  this.msgSubmitHanlder(e);
                }}
                style={{ width: "300px" }}
                disabled={
                  this.state.isAdmin
                    ? false
                    : this.state.selctedMember.length > 0
                    ? false
                    : true
                }
                className={classes.anchorsendall}
              >
                <span style={{ top: "-10px" }}>
                  {this.state.isAdmin
                    ? "Send Message To Selected"
                    : "Login To Send Message"}
                </span>
              </button>
              <button
                onClick={(e) => {
                  this.msgSubmitHanlderAll(e, filteredArr);
                }}
                style={{ width: "300px" }}
                disabled={
                  this.state.isAdmin
                    ? false
                    : this.state.selctedMember.length > 0
                    ? false
                    : true
                }
                className={classes.anchorsendall}
              >
                <span style={{ top: "-10px" }}>
                  {this.state.isAdmin
                    ? "Send Message To All"
                    : "Login To Send Message"}
                </span>
              </button>

              <div className="container">
                <div></div>
                {filteredArr.map((e) => {
                  ////console.log(e)
                  return (
                    <div
                      style={{ marginTop: "20px", marginBottom: "20px" }}
                      className={classes.selectionwrapper}
                      key={e.id}
                    >
                      <label htmlFor={e.id} className={classes.selectedlabel}>
                        <input
                          className="user"
                          value={e.email}
                          onChange={(event) => {
                            this.selectHandler(event, e.user);
                          }}
                          type="checkbox"
                          name="selected-item"
                          id={e.id}
                        />

                        <span className={classes.icon}></span>

                        <div
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                          className="card"
                        >
                          <div className="card-wrapper">
                            <div
                              style={{ display: "flex", alignItems: "left" }}
                              className="row align-items-center"
                            >
                              <div className="col-12 col-md-4">
                                <div
                                  style={{
                                    width: "fit-content",
                                    backgroundColor: "white",
                                    borderRadius: "50%",
                                  }}
                                  className="image-wrapper"
                                >
                                  <img
                                    style={{
                                      width: "200px",
                                      height: "200px",
                                      borderRadius: "50%",
                                    }}
                                    src={e.img === "" ? logo : e.img}
                                    alt="Mobirise"
                                  />
                                </div>
                              </div>
                              <div className="col-12 col-md">
                                <div
                                  style={{ width: "100%" }}
                                  className="card-box"
                                >
                                  <ul className={classes.details}>
                                    <li className={classes.detail}>
                                      <i
                                        style={{ marginRight: "5px" }}
                                        className="fas fa-user"
                                      ></i>
                                      {e.user}
                                    </li>
                                    <li className={classes.detail}>
                                      <i
                                        style={{ marginRight: "5px" }}
                                        className="fas fa-thumbtack"
                                      ></i>
                                      {e.location}
                                    </li>
                                    <li className={classes.detail}>
                                      <i
                                        style={{ marginRight: "5px" }}
                                        className="far fa-star"
                                      ></i>{" "}
                                      5
                                    </li>
                                    <li className={classes.detail}>
                                      <i
                                        style={{ marginRight: "5px" }}
                                        className="fas fa-drafting-compass"
                                      ></i>
                                      {e.advancedSkills
                                        ? e.advancedSkills.join(",")
                                        : null}
                                    </li>
                                  </ul>

                                  <div
                                    style={{
                                      lineHeight: "1",
                                      wordBreak: "break-word",
                                      wordWrap: "break-word",
                                      fontWeight: "400",
                                    }}
                                    className="social-row display-7"
                                  >
                                    <div className={classes.btn}>
                                      <button
                                        onClick={(event) => {
                                          this.viewProfile(event, e.id);
                                        }}
                                        className={classes.anchor}
                                      >
                                        View Profile
                                      </button>
                                      <button
                                        onClick={(event) => {
                                          this.sendMsg(event, e.user);
                                        }}
                                        value={e.email}
                                        disabled={
                                          this.state.isAdmin ? false : true
                                        }
                                        className={
                                          this.state.isAdmin
                                            ? classes.anchor
                                            : null
                                        }
                                      >
                                        {this.state.isAdmin
                                          ? "Send Message"
                                          : "Login To Message"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default CoWorkers;
