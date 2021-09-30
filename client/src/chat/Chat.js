import React, { Component } from "react";
import Nav from "../nav/Nav";
import { connect } from "react-redux";
import SideBar from "./SideBar/SideBar";
import instance from "../axios/axios";
class Chat extends Component {
  state = {
    authenticatedWith: "",
    isLoading: true,
    username: "",
    img: null,
    isAdmin: false,
    email: "",
    check: "",
    userimg: [],
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
          instance
            .post("/search/getusersimage", data)
            .then((res) => {
              ////console.log(res);
              this.setState((prevState) => ({
                ...prevState,
                isAdmin: true,
                username: response.data.user.user,
                email: response.data.user.email,
                img: response.data.user.img,
                isLoading: false,
                authenticatedWith: response.data.user.authenticatedWith,
                check: response.data.user.check,
                userimg: res.data.data,
              }));
            })
            .catch((err) => {
              this.setState((prevState) => ({
                ...prevState,
                isLoading: false,
              }));
            });
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
    //////console.log(this.props.msg)

    return (
      <>
        {this.state.isAdmin ? (
          <>
            {" "}
            <Nav
              check={this.state.check}
              email={this.state.email}
              auth={this.state.authenticatedWith}
              image={this.state.img}
              isAdmin={this.state.isAdmin}
              username={this.state.username}
            />
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
            />
          </>
        )}
        <SideBar
          userimg={this.state.userimg}
          email={this.state.email}
          msg={this.props.msg}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    msg: state.msg,
  };
};

export default connect(mapStateToProps)(Chat);
