import React, { Component } from "react";
import Nav from "../nav/Nav";
import classes from "./Feedback.module.css";
import instance from "../axios/axios";
class FeedBack extends Component {
  state = {
    isLoading: true,
    username: "",
    img: null,
    isAdmin: false,
    check: "",
    email: "",
  };
  componentDidMount = () => {
    //////console.log("Mount")

    let token = localStorage.getItem("SSUID");
    //////console.log(token)

    let data = {
      token: token,
    };

    //////console.log(data)
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
            check: response.data.user.check,
            isLoading: false,
          }));
        }
        //////console.log(response)
      })
      .catch((err) => {
        this.setState((prevState) => ({
          ...prevState,
          isAdmin: false,
          isLoading: false,
        }));
      });

    //////console.log(this.state)
  };
  render() {
    let class3 = ["form-control", classes.formcontrol];
    let element = (
      <>
        {" "}
        <section className={classes.feedback}>
          <div className={classes.verticalspace100}></div>
          <div className="container">
            <div className={classes.verticalspace60}></div>
            <div className={classes.userpostbox}>
              <form>
                <div style={{ marginBottom: "50px" }} className="form-group">
                  <label htmlFor="exampleInputName">Full Name</label>
                  <input
                    type="text"
                    className={class3.join(" ")}
                    id="exampleInputName"
                    placeholder="Enter your Full Name"
                    required
                  />
                </div>
                <div style={{ marginBottom: "50px" }} className="form-group">
                  <label htmlFor="exampleInputFeedback">FeedBack</label>
                  <textarea
                    type="text"
                    className={class3.join(" ")}
                    id="exampleInputFeedback"
                    placeholder="Enter your Feedback"
                    required
                  />
                </div>
              </form>
               {/* eslint-disable-next-line  */}
              <a href="#" className={classes.Save}>
                Send
              </a>
            </div>
          </div>
        </section>
      </>
    );
    return this.state.isLoading ? (
      <h1>Loading</h1>
    ) : this.state.isAdmin ? (
      <>
        {" "}
        <Nav
          check={this.state.check}
          email={this.state.email}
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
          image={this.state.img}
          isAdmin={this.state.isAdmin}
          username=""
        />{" "}
        {element}{" "}
      </>
    );
  }
}

export default FeedBack;
