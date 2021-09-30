import React, { Component } from "react";
import logo from "../assests/images/logo.png";
import Nav from "../nav/Nav";
import classes from "./Details.module.css";
import instance from "../axios/axios";
import Spinner from "../Spinner/Spinner";
import { socket } from "../services/socket";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
class Detail extends Component {
  state = {
    msgTitle: "",
    msgDesc: "",
    authenticatedWith: "",
    isLoading: true,
    username: "",
    img: null,
    isAdmin: false,
    email: "",
    openModal: false,
    check: "",
    favouriteUser: [],
  };

  sendMsg = (e) => {
    e.preventDefault();
    let data = {
      receiverEmail: this.props.location.state[0].email,
      msg: "Hello",
      sender: localStorage.getItem("SOCKET_ID"),
      receiverImg: this.props.location.state[0].img,
      receiverName: this.props.location.state[0].user,
      time: new Date().toLocaleString(),
    };
    socket.emit("msg", data);
    this.setState((prevState) => ({
      ...prevState,
      openModal: true,
      msgTitle: "Message Sent",
      msgDesc: "The Invite Message Has Been Succefully Sent To The Client",
    }));
  };

  componentDidMount = () => {
    ////console.log("Mount")

    let token = localStorage.getItem("SSUID");
    ////console.log(token)

    let data = {
      token: token,
    };

    ////console.log(data)
    instance
      .post("/user/check", data)
      .then((response) => {
        if (response.data) {
          this.setState((prevState) => ({
            ...prevState,
            isAdmin: true,
            username: response.data.user.user,
            email: response.data.user.email,
            img: response.data.user.img,
            isLoading: false,
            authenticatedWith: response.data.user.authenticatedWith,
            check: response.data.user.check,
            favouriteUser: response.data.user.favouriteUser,
          }));
        }
        ////console.log(response)
      })
      .catch((err) => {
        this.setState((prevState) => ({
          ...prevState,
          isAdmin: false,
          isLoading: false,
        }));
      });

    ////console.log(this.state)
  };
  closeModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      openModal: false,
    }));
  };
  addFavourite = () => {
    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    let data = {
      email: this.props.location.state[0].email,
      token: localStorage.getItem("SSUID"),
    };

    instance
      .post("/userAction/addFavourite", data)
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          isLoading: false,
          openModal: true,
          msgTitle: "Add To Favourite",
          msgDesc: "This User Has Been Now added To Your Favourite List",
          favouriteUser: [
            ...prevState.favouriteUser,
            this.props.location.state[0].email,
          ],
        }));
      })
      .catch((err) => {
        this.setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      });
  };

  removeFavourite = () => {
    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    let data = {
      email: this.props.location.state[0].email,
      token: localStorage.getItem("SSUID"),
    };

    instance
      .post("/userAction/removeFavourite", data)
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          isLoading: false,
          openModal: true,
          msgTitle: "Remove From Favourite",
          msgDesc: "This User Has Been Now Removed From Your Favourite List",
          favouriteUser: prevState.favouriteUser.filter((e) => {
            return e !== this.props.location.state[0].email;
          }),
        }));
      })
      .catch((err) => {
        this.setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      });
  };

  render() {
    // //console.log(this.state.isAdmin && this.state.favouriteUser.includes(this.props.location.state[0].email))

    ////console.log(this.props.location.state)
    let class1 = ["row", classes.profile];
    let class2 = [classes.margintop20, classes.profiledesclink];
    let element = (
      <>
        <div className={classes.container1}>
          <div className={class1.join(" ")}>
            <div className="col-md-3">
              <div className={classes.profilesidebar}>
                <div className={classes.profileuserpic}>
                  <img
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                    }}
                    src={
                      this.props.location.state[0].img === ""
                        ? logo
                        : this.props.location.state[0].img
                    }
                    className={classes.imgresponsive}
                    alt=""
                  />
                </div>
                <div className={classes.profileusertitle}>
                  <div className={classes.profileusertitlename}>
                    {this.props.location.state[0].user}
                  </div>
                  <div
                    style={{ textTransform: "capitalize" }}
                    className={classes.profileusertitlejob}
                  >
                    {this.props.location.state[0].headline}
                  </div>
                </div>
                <div className={classes.profileuserbuttons}>
                  <button
                    disabled={!this.state.isAdmin}
                    onClick={(e) => {
                      this.sendMsg(e);
                    }}
                    style={{ marginRight: "10px" }}
                    type="button"
                    className="btn btn-success btn-sm"
                  >
                    {this.state.isAdmin ? "Message" : "Login To Message"}
                  </button>
                  <button type="button" className="btn btn-danger btn-sm">
                    Report
                  </button>
                </div>

                <div className={classes.profileuserbuttons}>
                  {this.state.isAdmin ? (
                    this.state.favouriteUser.includes(
                      this.props.location.state[0].email
                    ) ? (
                      <button
                        onClick={() => {
                          this.removeFavourite();
                        }}
                        type="button"
                        className="btn btn-danger btn-sm"
                      >
                        Remove From Favourite
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          this.addFavourite();
                        }}
                        type="button"
                        className="btn btn-success btn-sm"
                      >
                        Add To Favoutite
                      </button>
                    )
                  ) : null}
                </div>

                <div>
                  <div className={class2.join(" ")}>
                    <i className="fas fa-thumbtack"></i>
                    <a
                      href={`https://google.com/maps/${this.props.location.state[0].location}`}
                    >
                      {this.props.location.state[0].location}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className={classes.profilecontent}>
                <h3 style={{ textAlign: "left" }}>About Me :</h3>
                <p>{this.props.location.state[0].generalInfo}</p>

                <h3 style={{ textAlign: "left" }}>My Skills :</h3>

                {this.props.location.state[0].advancedSkills.length > 0 &&
                  this.props.location.state[0].advancedSkills.map((e) => {
                    return (
                      <div key={Math.random()}>
                        <div
                          key={Math.random()}
                          className="d-flex flex-row mt-3 exp-container"
                        >
                          <i
                            key={Math.random()}
                            style={{ marginTop: "auto", marginBottom: "auto" }}
                            className="fas fa-lightbulb"
                          ></i>
                          <div
                            key={Math.random()}
                            className="work-experience ml-1"
                          >
                            <span
                              key={Math.random()}
                              className="font-weight-bold d-block"
                            >
                              {e}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </>
    );

    return (
      <>
        <Dialog
          open={this.state.openModal}
          onClose={() => {
            this.closeModal();
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {this.state.msgTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.msgDesc}
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

        {this.state.isLoading ? (
          <Spinner />
        ) : this.state.isAdmin ? (
          <>
            {" "}
            <Nav
              check={this.state.check}
              email={this.state.email}
              auth={this.state.authenticatedWith}
              image={this.state.img}
              isAdmin={this.state.isAdmin}
              username={this.state.username}
            />{" "}
            {element}{" "}
          </>
        ) : (
          <>
            <Nav
              check={this.state.check}
              email={this.state.email}
              auth={this.state.authenticatedWith}
              image={this.state.img}
              isAdmin={this.state.isAdmin}
              username=""
            />{" "}
            {element}{" "}
          </>
        )}
      </>
    );
  }
}

export default Detail;
