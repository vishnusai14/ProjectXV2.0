import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import logo from "../assests/images/logo.png";
import Nav from "../nav/Nav";
import classes from "./Header.module.css";
import instance from "../axios/axios";
import Spinner from "../Spinner/Spinner";
import { socket } from "../services/socket";
import { connect } from "react-redux";
import * as actionTypes from "../store/creators/authCreators";
class Header extends Component {
  state = {
    locations: [],
    isLoading: true,
    username: "",
    img: null,
    isAdmin: false,
    email: "",
    authenticatedWith: "",
    headline: "",
    position: "Person",
    location: "",
    check: "",
    name: "",
  };

  nameHanlder = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      name: e.target.value,
    }));
  };

  headlineHandler = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      headline: e.target.value,
    }));
  };

  positionHandler = (e) => {
    //console.log(e)
    this.setState((prevState) => ({
      ...prevState,
      position: e.target.value,
    }));
  };

  componentDidMount = () => {
    //console.log("Mount")

    let token = localStorage.getItem("SSUID");
    //console.log(token)

    let data = {
      token: token,
    };

    //console.log(data)
    instance
      .post("/user/check", data)
      .then((response) => {
        //console.log(response)
        if (response.data) {
          this.setState((prevState) => ({
            ...prevState,
            isAdmin: true,
            username: response.data.user.user,
            email: response.data.user.email,
            isLoading: false,
            img: response.data.user.img,
            authenticatedWith: response.data.user.authenticatedWith,
            check: response.data.user.check,
          }));

          let msgdata = {
            email: response.data.user.email,
            name: response.data.user.user,
          };

          socket.emit("name", msgdata);
        }
        //console.log(response)
      })
      .catch((err) => {
        this.setState((prevState) => ({
          ...prevState,
          isAdmin: false,
          isLoading: false,
        }));
      });

    socket.on("id", (data) => {
      this.setState((prevState) => ({
        ...prevState,
        socketid: data,
      }));

      socket.on("oldmessages", (data) => {
        this.props.msg(data);
      });

      localStorage.setItem("SOCKET_ID", this.state.socketid);
      localStorage.setItem("valid", true);
    });

    //console.log(this.state)
  };

  search = (event) => {
    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    if (
      this.state.headline === "" ||
      this.state.location === "" ||
      this.state.position === ""
    ) {
      return;
    }
    //console.log("Yeah")
    let data = {
      name: this.state.name,
      headline: this.state.headline,
      location: this.state.location,
      position: this.state.position,
      token: localStorage.getItem("SSUID"),
    };
    instance
      .post("/search/getworkers", data)
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        let userDataandLoading = {
          data: response.data,
          loading: this.state.isLoading,
        };
        this.props.history.push({
          pathname: "/details",
          state: userDataandLoading,
        });
      })
      .catch((err) => {
        this.setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      });
  };

  API = "rV_wg1YKgvxe0Lz5O0B48-2CaTTM_PrCuBXjhjBmQ2E";
  autosuggest = (event) => {
    if (event.metaKey) {
      return;
    }
    let searchString = event.target.value;
    if (searchString !== "") {
      fetch(
        `https://autosuggest.search.hereapi.com/v1/autosuggest?apiKey=${this.API}&at=33.738045,73.084488&limit=5&resultType=city&q=${searchString}&lang=en-US`
      )
        .then((res) => res.json())
        .then((json) => {
          if (json.length !== 0) {
            document.getElementById("search").innerHTML = ``;
          }

          this.setState((prevState) => ({
            ...prevState,
            locations: json.items,
            location: event.target.value,
          }));
        })
        .catch((e) => {
          //console.log(e)
        })
        .catch((E) => {
          //console.log(E)
        });
    }
  };

  submit = () => {
    this.props.history.push("/coworkers");
  };
  handleCallback = (loading) => {
    this.setState((prevState) => ({
      ...prevState,
      isLoading: loading,
    }));
  };
  render() {
    //console.log(this.state.img)

    let element = (
      <>
        <div style={{ position: "relative" }} className={classes.s006}>
          <form className={classes.searchform} id="searchform">
            <fieldset>
              <legend>
                <div>
                  <img className={classes.logoimg} src={logo} alt="img" />
                  CoFounders
                </div>
              </legend>
              <div className={classes.innerform}>
                <div className={classes.inputfield}>
                  <button
                    className={classes.btnsearch}
                    type="button"
                    onClick={(e) => {
                      this.search(e);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                    </svg>
                  </button>

                  <input
                    onChange={(e) => {
                      this.headlineHandler(e);
                    }}
                    autoComplete="off"
                    id="search"
                    type="text"
                    placeholder="Who are You Looking For ? Type The Skills Or Their Name... "
                  />
                </div>
              </div>
              <div className={classes.suggestionwrap}>
                {/* <span  className = {classes.suggestionspan}><input autoComplete = "off"  className = {classes.skills} id = "search" type = "text" placeholder = "Skills" /></span>  */}
                <span className={classes.suggestionspan}>
                  <input
                    autoComplete="off"
                    onChange={(e) => {
                      this.autosuggest(e);
                    }}
                    list="locations"
                    className={classes.skills}
                    id="search"
                    type="text"
                    placeholder="Location"
                  />
                </span>

                <datalist id="locations">
                  {" "}
                  {this.state.locations.map((item) => {
                    let tag = "";
                    if (item.position !== undefined && item.position !== "") {
                      tag = <option key={Math.random()}>{item.title}</option>;
                    }

                    return tag;
                  })}
                </datalist>
                <span className={classes.suggestionspan}>
                  <select
                    onChange={(e) => {
                      this.positionHandler(e);
                    }}
                    name="type"
                    id="type"
                    className={classes.skills}
                  >
                    <option value="Person">Person</option>
                    <option value="FreeLancer">FreeLancer</option>
                    <option value="Company">Company</option>
                  </select>
                </span>
              </div>
            </fieldset>
          </form>
        </div>
      </>
    );

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
              isAdmin={this.state.isAdmin}
              image={this.state.img}
              username=""
            />{" "}
            {element}{" "}
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token,
    error: state.error,
    loading: state.isLoading,
    otpCheck: state.otpCheck,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    msg: (msg) => {
      dispatch(actionTypes.msg(msg));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
