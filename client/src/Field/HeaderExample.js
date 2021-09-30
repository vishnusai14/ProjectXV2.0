import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import logo from "../assests/images/logo.png";
import Nav from "../nav/Nav";
import classes from "../Header/Header.module.css";
import instance from "../axios/axios";
import Spinner from "../Spinner/Spinner";
import { socket } from "../services/socket";
import { connect } from "react-redux";
import * as actionTypes from "../store/creators/authCreators";
import Field from "./Field";
import { AdvancedFields } from "./data";
class Header extends Component {
  state = {
    type: [],
    select: [],
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
        ////console.log(response)
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
        ////console.log(response)
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

    ////console.log(this.state)
  };

  skillSearch = (e) => {
    e.preventDefault();

    console.log("Something Happeninig");

    let selected = [];
    for (var i = 0; i < localStorage.length; i++) {
      if (
        localStorage.key(i) !== "SSUID" &&
        localStorage.key(i) !== "SOCKET_ID" &&
        localStorage.key(i) !== "valid" &&
        localStorage.key(i) !== "CLIENT_EMAIL"
      ) {
        selected.push(localStorage.getItem(localStorage.key(i)));
      }
    }

    let accordSelected = [];

    selected.forEach((e) => {
      AdvancedFields.forEach((field) => {
        if (e.includes(field.title)) {
          let newe = e.replace(field.title, "");
          accordSelected.push(newe);
        }
      });
    });
    console.log(selected);

    let userDataandLoading = {
      loading: false,
      isAdmin: this.state.isAdmin,
      check: this.state.check,
      email: this.state.email,
      authenticatedWith: this.state.authenticatedWith,
      img: this.state.img,
      username: this.state.username,
      selected: selected,
      location: this.state.location,
      type: this.state.type,
      accordSelected: accordSelected,
    };

    this.props.history.push({
      pathname: "/details",
      state: userDataandLoading,
    });
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
    ////console.log(e)
    this.setState((prevState) => ({
      ...prevState,
      position: e.target.value,
    }));
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
          ////console.log(e)
        })
        .catch((E) => {
          ////console.log(E)
        });
    }
  };

  submit = () => {
    this.props.history.push("/coworkers");
  };
  checkHandler = (e) => {
    let value = e.target.value;
    let clist = this.state.type;
    if (clist.includes(value)) {
      clist = clist.filter((item) => {
        return item !== value;
      });
    } else {
      clist.push(value);
    }

    this.setState((prevState) => ({
      ...prevState,
      type: clist,
    }));
  };

  render() {
    ////console.log(this.state.img)
    let class1 = ["accordian", classes.acc];
    let class2 = ["btn", "btn-primary", classes.typeButton];

    let element = (
      <>
        <div
          style={{ position: "relative", marginTop: "30px" }}
          className={classes.s006}
        >
          <form className={classes.searchform} id="searchform">
            <fieldset>
              <legend>
                {this.props.img ? (
                  <div>
                    <img className={classes.logoimg} src={logo} alt="img" />
                    CoFounders
                  </div>
                ) : null}
              </legend>
              <div className={classes.innerform}>
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
                    <option>Any Location</option>
                    {this.state.locations.map((item) => {
                      let tag = "";
                      if (item.position !== undefined && item.position !== "") {
                        tag = <option key={Math.random()}>{item.title}</option>;
                      }

                      return tag;
                    })}
                  </datalist>
                  <span className={classes.suggestionspan}>
                    <div
                      style={{ display: "inline" }}
                      className={class1.join(" ")}
                      id="accordionExample"
                    >
                      <button
                        className={class2.join(" ")}
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapseExample"
                        aria-expanded="false"
                        aria-controls="collapseExample"
                      >
                        Choose Type
                      </button>
                      <div
                        style={{ width: "250px", margin: "auto" }}
                        class="collapse"
                        id="collapseExample"
                      >
                        <div className="card card-body">
                          <ul className="ks-cboxtags p-0 m-0">
                            <li>
                              <input
                                className="form-check-input"
                                checked={
                                  this.state.type.includes("Person")
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  this.checkHandler(e);
                                }}
                                type="checkbox"
                                id="Person"
                                name="Person"
                                value="Person"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Person"
                              >
                                Person
                              </label>
                            </li>

                            <li>
                              <input
                                className="form-check-input"
                                checked={
                                  this.state.type.includes("Company")
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  this.checkHandler(e);
                                }}
                                type="checkbox"
                                id="Company"
                                name="Company"
                                value="Company"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Company"
                              >
                                Company
                              </label>
                            </li>

                            <li>
                              <input
                                className="form-check-input"
                                checked={
                                  this.state.type.includes("Freelancer")
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  this.checkHandler(e);
                                }}
                                type="checkbox"
                                id="Freelancer"
                                name="Freelancer"
                                value="Freelancer"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="Freelancer"
                              >
                                Freelancer
                              </label>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
                <>
                  <Field />
                </>
                <span className={classes.suggestionspan}>
                  <button
                    onClick={(e) => {
                      this.skillSearch(e);
                    }}
                  >
                    Search
                  </button>
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
