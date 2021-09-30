import React, { Component } from "react";
import classes from "./Nav.module.css";
import { Link } from "react-router-dom";
import logo from "../assests/images/logo.png";
import { connect } from "react-redux";
import Googlelogout from "../GoogleLogout/GoogleLogout";
import instance from "../axios/axios";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
class Nav extends Component {
  state = {
    isAdmin: this.props.isAdmin,
    img: this.props.image,
    auth: this.props.auth,
    email: this.props.email,
    check: this.props.check,
    openModal: false,
    dialogMsg: "",
  };

  subscribe = async (e) => {
    //console.log("Push");
    //console.log(await navigator.serviceWorker.ready);
    navigator.serviceWorker.ready
      .then((sw) => {
        //console.log(sw);
        sw.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              "BDyQ7FPK43dZcvKl2LlhpNR3ksC2b2NHofmfyoa-6CG7h4vAXSzVT8rDSgsGgFOkC8MnKoB3ejhnSvZRC5tcxA0",
          })
          .then((push) => {
            this.setState((prevState) => ({
              ...prevState,
              openModal: true,
              dialogMsg:
                "You Will Receive A Notification When Someone Message You",
            }));

            let authData = JSON.stringify(push);
            let data = {
              email: this.props.email,
              auth: authData,
            };

            instance
              .post("/user/newclient", data)
              .then((res) => {
                //console.log(res);
              })
              .catch((err) => {
                //console.log(err);
              });

            //console.log(push);
          })
          .catch((err) => {
            this.setState((prevState) => ({
              ...prevState,
              openModal: true,
              dialogMsg: "Push Notification Doesn't Support",
            }));
            //console.log(err);
          });
      })
      .catch((err) => {
        this.setState((prevState) => ({
          ...prevState,
          openModal: true,
          dialogMsg: "Push Notification Doesn't Support",
        }));
        //console.log(err);
      });
  };

  closeModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      openModal: false,
      dialogMsg: "",
    }));
  };

  checkHandler = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      check: !this.state.check,
    }));

    let data = {
      email: this.state.email,
      check: !this.state.check,
    };
    ////console.log(data)

    instance
      .post("/userAction/changepref", data)
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        ////console.log(err)
      });
  };

  render() {
    ////console.log(this.props)
    let image = logo;
    if (this.state.img !== "") {
      image = this.state.img;
    } else {
      image = logo;
    }
    let register = (
      <li className="nav-item dropdown">
      {/* eslint-disable-next-line  */}
        <a
          className="nav-link dropdown-toggle text-uppercase font-weight-bold"
          href="#"
          id="navbarDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Register
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <Link
            to="/login"
            className="dropdown-item text-uppercase font-weight-bold"
          >
            Login
          </Link>
          <div className="dropdown-divider"></div>
          <Link
            to="/signup"
            className="dropdown-item text-uppercase font-weight-bold"
          >
            Sign Up
          </Link>
        </div>
      </li>
    );

    let user = (
      <>
        <li className="nav-item">
        {/* eslint-disable-next-line  */}
          <a href="#" className="nav-link text-uppercase font-weight-bold">
            <p>{this.props.username}</p>
          </a>
        </li>
        <li className="nav-item dropdown">
        {/* eslint-disable-next-line  */}
          <a
            href="#"
            className="nav-link dropdown-toggle"
            id="navDropDownLink"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img className={classes.userimg} src={image} alt="userProfile" />
          </a>
          <div className="dropdown-menu" aria-labelledby="navDropDownLink">
            <Link to="/editprofile" className="dropdown-item">
              Edit Profile{" "}
            </Link>
            <Link to="/myFavourite" className="dropdown-item">
              My Favourite
            </Link>
            <div className="dropdown-divider"></div>
            {this.state.auth === "Google" ? (
              <Googlelogout />
            ) : (
              <Link to="/logout" className="dropdown-item" href="#">
                Logout{" "}
              </Link>
            )}
          </div>
        </li>
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
          <DialogTitle id="alert-dialog-title">{"Notification"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.dialogMsg}
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
        <header className="header">
          <nav
            style={{ zIndex: "10000" }}
            className="navbar navbar-expand-lg fixed-top py-3"
          >
            <div className="container">
              <Link
                to="/feedback"
                className="navbar-brand text-uppercase font-weight-bold"
              >
                <i className="fas fa-comment-alt"></i>
              </Link>
              <button
                style={{ backgroundColor: "#666" }}
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                className="navbar-toggler navbar-toggler-right"
              >
                <i className="fas fa-sliders-h"></i>
              </button>

              <div
                id="navbarSupportedContent"
                className="collapse navbar-collapse"
              >
                <ul className="nav navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link
                      to="/"
                      className="nav-link text-uppercase font-weight-bold"
                    >
                      Home <span className="sr-only">(current)</span>
                    </Link>
                  </li>

                  {this.props.isAdmin ? (
                    <li className="nav-item">
                      <Link
                        style={{ color: this.state.check ? "darkgray" : "" }}
                        to="/chat"
                        className="nav-link text-uppercase font-weight-bold"
                      >
                        Message
                      </Link>
                    </li>
                  ) : null}
                  {this.props.isAdmin ? (
                    <>
                      <li className="nav-item">
                      {/* eslint-disable-next-line  */}
                        <a
                          onClick={(e) => {
                            this.subscribe(e);
                          }}
                          className="nav-link text-uppercase font-weight-bold"
                        >
                          {" "}
                          Receive Notification{" "}
                        </a>
                      </li>
                    </>
                  ) : null}
                  {this.props.isAdmin ? (
                    <>
                      <li className="nav-item">
                      {/* eslint-disable-next-line  */}
                        <a
                          href="#"
                          className="nav-link text-uppercase font-weight-bold"
                        >
                          <div className={classes.tooltip}>
                            <span className={classes.tooltiptext}>
                              Mute The Email Notification
                            </span>
                            <label className={classes.label}>
                              <div className={classes.toggle}>
                                <input
                                  onChange={(e) => {
                                    this.checkHandler(e);
                                  }}
                                  checked={this.state.check}
                                  className={classes.togglestate}
                                  type="checkbox"
                                  name="check"
                                  value="check"
                                />
                                <div className={classes.indicator}></div>
                              </div>
                            </label>
                          </div>
                          <div className={classes.labeltext}>
                            no more emails plz
                          </div>
                        </a>
                      </li>
                    </>
                  ) : null}

                  {this.state.isAdmin ? user : register}
                </ul>
              </div>
            </div>
          </nav>
        </header>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    error: state.error,
    loading: state.isLoading,
  };
};

export default connect(mapStateToProps)(Nav);
