import React, { Component } from "react";
import classes from "./favourite.module.css";
import instance from "../axios/axios";
import logo from "../assests/images/logo.png";
import Nav from "../nav/Nav";
import Spinner from "../Spinner/Spinner";
import { socket } from "../services/socket";

class Favourite extends Component {
  state = {
    msg: "Hello",
    isLoading: true,
    isAdmin: false,
    favouriteUser: [],
    username: "",
    img: null,
    email: "",
    authenticatedWith: "",
    headline: "",
    position: "Person",
    location: "",
    check: "",
  };

  componentDidMount = () => {
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
          let user = {
            email: response.data.user.email,
          };
          instance
            .post("/search/getUserData", user)
            .then((res) => {
              this.setState((prevState) => ({
                ...prevState,
                isAdmin: true,
                isLoading: false,
                favouriteUser: res.data.data,
                username: response.data.user.user,
                email: response.data.user.email,
                img: response.data.user.img,
                authenticatedWith: response.data.user.authenticatedWith,
                check: response.data.user.check,
              }));
            })
            .catch((err) => {
              this.setState((prevState) => ({
                ...prevState,
                isAdmin: true,
                isLoading: false,
                favouriteUser: [],
              }));
            });
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

  viewProfile = (e, id) => {
    e.preventDefault();
    let array = this.state.favouriteUser;
    let newArray = array.filter((i) => {
      return i.id === id;
    });
    this.props.history.push({
      pathname: "/worker-details",
      state: newArray,
    });
  };
  render() {
    let element = this.state.favouriteUser.map((e) => {
      return (
        <div
          style={{ marginTop: "100px", marginBottom: "20px" }}
          className={classes.selectionwrapper}
          key={e.id}
        >
          <label htmlFor={e.id} className={classes.selectedlabel}>
            <input
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
              style={{ backgroundColor: "transparent", border: "none" }}
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
                    <div style={{ width: "100%" }} className="card-box">
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
                          {e.advancedSkills ? e.advancedSkills.join(",") : null}
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
                            disabled={this.state.isAdmin ? false : true}
                            className={
                              this.state.isAdmin ? classes.anchor : null
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
    });

    return (
      <>
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

export default Favourite;
