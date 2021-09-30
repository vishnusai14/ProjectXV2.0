import React, { Component } from "react";
import logo from "../assests/images/logo.png";
import Nav from "../nav/Nav";
import classes from "./EditProfile.module.css";
import instance from "../axios/axios";
import Spinner from "../Spinner/Spinner";

class EditProfile extends Component {
  state = {
    locations: [],
    authenticatedWith: "",
    newskills: [],
    isAdmin: false,
    email: "",
    info: "",
    position: "",
    location: "",
    companyName: "",
    headline: "",
    specializedIn: "",
    submitLoading: false,
    newSkill: "",
    isLoading: true,
    username: "",
    img: null,
    check: "",
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

          ////console.log(this.state)
        })
        .catch((e) => {
          ////console.log(e)
        })
        .catch((E) => {
          ////console.log(E)
        });
    }
  };

  saveProfile = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    e.preventDefault();
    ////console.log(this.state)
    let token = localStorage.getItem("SSUID");
    let data = {
      token: token,
      newskills: this.state.newskills,
      newimage: this.state.img,
      newlocation: this.state.location,
      newCompanyName: this.state.companyName,
      newHeadline: this.state.headline,
      newSpecializedIn: this.state.specializedIn,
      newUserName: this.state.username,
      newinfo: this.state.info,
    };

    instance
      .post("/userAction/updateprofile", data)
      .then((response) => {
        this.setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        window.location.reload();
      })
      .catch((err) => {
        this.setState((prevState) => ({
          ...prevState,
          isLoading: true,
        }));

        ////console.log(err)
      });
  };

  companyName = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      companyName: e.target.value,
    }));
  };

  specialized = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      specializedIn: e.target.value,
    }));
  };

  userName = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      username: e.target.value,
    }));
  };
  headline = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      headline: e.target.value,
    }));
  };
  location = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      location: e.target.value,
    }));
  };
  info = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      info: e.target.value,
    }));
  };
  image = (e) => {
    ////console.log(e.target.files[0])
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      // ////console.log(reader.result)
      this.setState((prevState) => ({
        ...prevState,
        img: reader.result,
      }));
    };
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
          ////console.log(response)
          this.setState((prevState) => ({
            ...prevState,
            isAdmin: true,
            username: response.data.user.user,
            email: response.data.user.email,
            img: response.data.user.img,
            newskills: response.data.user.skills,
            companyName: response.data.user.companyName,
            specializedIn: response.data.user.specializedIn,
            headline: response.data.user.headline,
            location: response.data.user.location,
            info: response.data.user.info,
            position: response.data.user.position,
            isLoading: false,
            authenticatedWith: response.data.user.authenticatedWith,
            check: response.data.user.check,
          }));
        }
        ////console.log(response)
      })
      .catch((err) => {
        this.setState((prevState) => ({
          ...prevState,
          isAdmin: false,
          isLoading: true,
        }));
        window.location.href = "/";
      });

    ////console.log(this.state)
  };

  changeHandler = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      newSkill: e.target.value,
    }));
  };
  addSkill = (e) => {
    e.preventDefault();
    ////console.log(e)
    let skill = this.state.newSkill;
    this.setState((prevState) => ({
      ...prevState,
      newskills: [...prevState.newskills, skill],
    }));
    ////console.log(this.state)
  };

  deleteSkills = (event, e) => {
    event.preventDefault();
    let skill = e;
    let newskills = this.state.newskills;
    let newSkills = newskills.filter((e) => {
      return e !== skill;
    });
    this.setState((prevState) => ({
      ...prevState,
      newskills: newSkills,
    }));
  };
  render() {

    let btnClass = ["btn", "btn-primary", classes.profilebutton];

    let companyDetail = (
      <div className="row mt-2">
        <div className="col-md-6">
          <label className={classes.lables}>Company Name</label>
          <input
            onChange={(e) => {
              this.companyName(e);
            }}
            type="text"
            className="form-control"
            placeholder="first name"
            value={this.state.companyName}
          />
        </div>
        <div className="col-md-6">
          <label className={classes.lables}>specializedIn</label>
          <input
            onChange={(e) => {
              this.specialized(e);
            }}
            type="text"
            className="form-control"
            value={this.state.specializedIn}
            placeholder="SpecializedIn"
          />
        </div>
      </div>
    );

    let positionDetail = (
      <div className="row mt-2">
        <div className="col-md-6">
          <label className={classes.lables}>Position</label>
          <input
            type="text"
            className="form-control"
            defaultValue={this.state.position}
            placeholder="Position"
          />
        </div>
      </div>
    );

    let element = (
      <>
        <div className={classes.verticalspace100}></div>
        <div className="container rounded bg-white mt-5 mb-5 ">
          <div className="row">
            <div className="col-md-3 border-right">
              <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                <img
                  style={{ width: "50%", height: "100px" }}
                  alt="UserImage"
                  className="rounded-circle mt-5"
                  src={this.state.img === "" ? logo : this.state.img}
                  width="90"
                />
                <span className="font-weight-bold">{this.state.username}</span>
                <span className="text-black-50">{this.state.email}</span>
                <span>{this.state.location}</span>
              </div>
              {this.state.authenticatedWith !== "Google" ? (
                <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                  <input
                    style={{ marginLeft: "auto" }}
                    onChange={(e) => {
                      this.image(e);
                    }}
                    type="file"
                    accept="image/x-png,image/gif,image/jpeg"
                  />
                </div>
              ) : null}
            </div>
            <div className="col-md-5 border-right">
              <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-right">Edit your profile</h6>
                </div>
                <div className="row mt-2">
                  <div className="col-md-12">
                    <label className={classes.lables}>Name</label>
                    <input
                      onChange={(e) => {
                        this.userName(e);
                      }}
                      type="text"
                      className="form-control"
                      placeholder="first name"
                      value={this.state.username}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div aria-readonly={true} className="col-md-12">
                    <label className={classes.lables}>Email</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="email"
                      defaultValue={this.state.email}
                    />
                  </div>
                  <div className="col-md-12">
                    <label className={classes.lables}>Headline</label>
                    <input
                      onChange={(e) => {
                        this.headline(e);
                      }}
                      type="text"
                      className="form-control"
                      placeholder="headline"
                      value={this.state.headline}
                    />
                  </div>
                  <div className="col-md-12">
                    <label className={classes.lables}>Current Location</label>
                    <input
                      autoComplete="off"
                      onChange={(e) => {
                        this.autosuggest(e);
                      }}
                      list="locations"
                      className="form-control"
                      id="search"
                      type="text"
                      placeholder="Location"
                      value={this.state.location}
                    />

                    <datalist id="locations">
                      {" "}
                      {this.state.locations.map((item) => {
                        let tag = "";
                        if (
                          item.position !== undefined &&
                          item.position !== ""
                        ) {
                          tag = (
                            <option key={Math.random()}>{item.title}</option>
                          );
                        }

                        return tag;
                      })}
                    </datalist>
                  </div>
                </div>

                {this.state.companyName ? companyDetail : positionDetail}

                <div className="row mt-2">
                  <div className="col-md-12">
                    <label className={classes.lables}>General Info</label>
                    <textarea
                      onChange={(e) => {
                        this.info(e);
                      }}
                      className="form-control"
                      placeholder="Write About You"
                      value={this.state.info}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center experience">
                  <span>Edit Skills</span>
                  <span className="border px-3 p-1 add-experience">
                    <i className="fa fa-plus"></i>&nbsp;Skills
                  </span>
                </div>
                {this.state.newskills.length > 0 &&
                  this.state.newskills.map((e) => {
                    return (
                      <>
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
                          <i
                            key={Math.random()}
                            onClick={(event) => {
                              this.deleteSkills(event, e);
                            }}
                            style={{
                              marginLeft: "auto",
                              cursor: "pointer",
                              marginTop: "auto",
                              marginBottom: "auto",
                            }}
                            className="fas fa-trash"
                          ></i>
                        </div>
                        <hr key={Math.random()}></hr>
                      </>
                    );
                  })}

                <div className="col-md-12">
                  <label className={classes.lables}>Skills</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Skills"
                    onChange={(e) => {
                      this.changeHandler(e);
                    }}
                  />
                </div>
                <div className="mt-5 text-center">
                  <button
                    onClick={(e) => {
                      this.addSkill(e);
                    }}
                    className={btnClass.join(" ")}
                    type="button"
                  >
                    Add Skills
                  </button>
                </div>
              </div>
              <div className="mt-5 text-center">
                <button
                  onClick={(e) => {
                    this.saveProfile(e);
                  }}
                  className={btnClass.join(" ")}
                  type="button"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );

    return this.state.isLoading ? (
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
    );
  }
}

export default EditProfile;
