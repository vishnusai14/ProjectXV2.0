import React, { Component } from "react";
import classes from "./Signu.module.css";
import Nav from "../nav/Nav";
import { connect } from "react-redux";
import * as actionTypes from "../store/creators/authCreators";
import { withRouter } from "react-router";
import Check from "../CheckOtp/Check";
import { FilePond,  registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import Spinner from "../Spinner/Spinner";
import Field from "../Field/Field";
registerPlugin(FilePondPluginImagePreview);
class SignUp extends Component {
  componentDidMount = () => {
    this.props.clear();
  };
  state = {
    locations: [],
    stateError: "",
    isAdmin: false,
    isCompany: false,
    fullname: "",
    email: "",
    password: "",
    image: "",
    info: "",
    position: "Person",
    location: "",
    companyName: "",
    headline: "",
    specializedIn: "",
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

          //console.log(this.state)
        })
        .catch((e) => {
          //console.log(e)
        })
        .catch((E) => {
          //console.log(E)
        });
    }
  };

  nameHandler = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      fullname: e.target.value,
    }));
  };
  emailHandler = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      email: e.target.value,
    }));
  };
  passwordHandler = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      password: e.target.value,
    }));
  };
  imageHanlder = (e) => {
    if (e === undefined) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(e.file);
    reader.onloadend = () => {
      // //console.log(reader.result)
      this.setState((prevState) => ({
        ...prevState,
        image: reader.result,
      }));
    };
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

  infoHandler = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      info: e.target.value,
    }));
  };

  headlineHandler = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      headline: e.target.value,
    }));
  };

  submitHandler = (e) => {
    e.preventDefault();
   
    let selected = [];
    for (var i = 0; i < localStorage.length; i++) {
      if(localStorage.key(i) !== "SSUID" && localStorage.key(i) !== "SOCKET_ID" && localStorage.key(i) !== "valid" && localStorage.key(i) !== "CLIENT_EMAIL"){
        selected.push(localStorage.getItem(localStorage.key(i)))
      }
     
    }

    if (
      this.state.email === "" ||
      this.state.fullname === "" ||
      this.state.password === "" ||
      this.state.headline === "" ||
      (this.state.position === "Company" && this.state.companyName === "") ||
      (this.state.position === "Company" && this.state.specializedIn === "") ||
      selected.length <= 0
    ) {
      this.setState((prevState) => ({
        ...prevState,
        stateError: "Please Enter ALL The Specified Details",
      }));
      //console.log(this.state)
    } else {
      //console.log("From SubmitHandler")
      this.props.auth(
        e,
        this.state.email,
        this.state.password,
        this.state.fullname,
        this.state.image,
        this.state.companyName,
        this.state.location,
        this.state.headline,
        this.state.info,
        this.state.specializedIn,
        this.state.position,
        selected,
        "Email"
      );
    }

    localStorage.setItem("CLIENT_EMAIL", this.state.email);
  };
  changeHandler = (e) => {
    if (e.target.value === "Company") {
      this.setState((prevState) => ({
        ...prevState,
        isCompany: true,
        position: e.target.value,
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        isCompany: false,
        position: e.target.value,
        companyName: "",
        specializedIn: "",
      }));
    }
  };
  render() {
    let class3 = ["form-control", classes.formcontrol];
    let ele = (
      <>
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div style={{ marginBottom: "50px" }} className="form-group">
              <label htmlFor="exampleInputCompanyName">Company</label>
              <input
                onChange={(e) => {
                  this.companyName(e);
                }}
                type="text"
                className={class3.join(" ")}
                id="exampleInputCompanyName"
                placeholder="Enter Your Company Name"
                required
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div style={{ marginBottom: "50px" }} className="form-group">
              <label htmlFor="exampleCompanySpecial">
                Specilazation In ?
              </label>
              <input
                onChange={(e) => {
                  this.specialized(e);
                }}
                type="text"
                className={class3.join(" ")}
                id="exampleCompanySpecial"
                placeholder="Specilazation in ?"
                required
              />
            </div>
          </div>
        </div>
      </>
    );

    let ele2 = (
      <>
        <Nav userimg={null} username="" />

        <section className={classes.postuser}>
          <div className={classes.verticalspace101}></div>
          <div className="container">
            <div className={classes.verticalspace60}></div>
            <div className={classes.userpostbox}>
              <div>
                <FilePond
                  onupdatefiles={(e) => {
                    this.imageHanlder(e[0]);
                  }}
                  imagePreviewHeight={170}
                  imageCropAspectRatio="1:1"
                  imageResizeTargetWidth={200}
                  imageResizeTargetHeight={200}
                  stylePanelLayout="compact circle"
                  allowMultiple={false}
                  name="files"
                  labelIdle="<img class = 'filepondimage' width = '100%' src = 'https://image.flaticon.com/icons/png/512/17/17004.png' />"
                />
              </div>
              <div
                style={{ marginBottom: "50px", textAlign: "left" }}
                className="form-group"
              >
                <label htmlFor="exampleInputName">Full Name</label>
                <input
                  onChange={(e) => {
                    this.nameHandler(e);
                  }}
                  type="text"
                  className={class3.join(" ")}
                  id="exampleInputName"
                  placeholder="Enter your Full Name"
                  required
                />
              </div>
              <div
                style={{ marginBottom: "50px", textAlign: "left" }}
                className="form-group"
              >
                <label htmlFor="exampleInputemail">Email</label>
                <input
                  onChange={(e) => {
                    this.emailHandler(e);
                  }}
                  type="email"
                  className={class3.join(" ")}
                  id="exampleInputemail"
                  placeholder="Enter your Email"
                  required
                />
              </div>{" "}
              <div
                style={{ marginBottom: "50px", textAlign: "left" }}
                className="form-group"
              >
                <label htmlFor="exampleInputPassword">Password</label>
                <input
                  onChange={(e) => {
                    this.passwordHandler(e);
                  }}
                  type="password"
                  className={class3.join(" ")}
                  id="exampleInputPassword"
                  placeholder="Enter your Password"
                  required
                />
              </div>
              <div style={{ marginBottom: "50px" }} className="form-group">
                <label htmlFor="exampleInputemail">Skills</label>
                <Field />
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div
                    style={{ marginBottom: "50px", textAlign: "left" }}
                    className="form-group"
                  >
                    <label htmlFor="exampleInputCompany">Company</label>
                    <select
                      type="text"
                      className={class3.join(" ")}
                      id="exampleInputCompany"
                      required
                      onChange={(e) => {
                        this.changeHandler(e);
                      }}
                    >
                      <option>Person</option>
                      <option>FreeLancer</option>
                      <option>Company</option>
                    </select>
                  </div>
                </div>
                {this.state.isCompany ? ele : null}

                <div className="col-lg-6 col-md-6">
                  <div style={{ marginBottom: "50px" }} className="form-group">
                    <label htmlFor="exampleInputLoction">Location</label>
                    <input
                      autoComplete="off"
                      onChange={(e) => {
                        this.autosuggest(e);
                      }}
                      list="locations"
                      className={class3.join(" ")}
                      id="search"
                      type="text"
                      placeholder="Location"
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

                <div style={{ marginBottom: "50px" }} className="form-group">
                  <label htmlFor="exampleInputHeadline">Job Postion</label>
                  <input
                    onChange={(e) => {
                      this.headlineHandler(e);
                    }}
                    type="text"
                    className={class3.join(" ")}
                    id="exampleInputHeadline"
                    placeholder="Enter The Job Postion"
                    required
                  />
                </div>
              </div>
              <div style={{ marginBottom: "50px" }} className="form-group">
                <label htmlFor="exampleInputLongDescription">
                  Write full description
                </label>
                <textarea
                  onChange={(e) => {
                    this.infoHandler(e);
                  }}
                  className={class3.join(" ")}
                  id="exampleInputLongDescription"
                  placeholder="Write Full description"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div style={{ marginBottom: "50px" }} className="form-group">
                <label>Agree with term and conditions</label>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input "
                    id="exampleCheck1"
                    required
                  />
                  <label
                    className="form-check-label text-left"
                    htmlFor="exampleCheck1"
                  >
                    Lorem ipsum tempus amet conubia adipiscing fermentum viverra
                    gravida, mollis suspendisse pretium dictumst inceptos mattis
                    euismod lorem nulla magna duis nostra sodales luctus nulla
                  </label>
                </div>
              </div>
              {this.props.error}
              {this.state.stateError}
              <button
                onClick={(e) => {
                  this.submitHandler(e);
                }}
                type="submit"
                className="btn Post-Job-Offer"
              >
                Sign Up
              </button>
            </div>
          </div>
        </section>
      </>
    );
    //console.log(this.props.token)
    //console.log(this.props.token !== null)
    return this.props.loading ? (
      <Spinner />
    ) : this.props.otpCheck ? (
      <Check email={this.state.email} />
    ) : (
      ele2
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
    auth: (
      event,
      email,
      password,
      userName,
      img,
      companyName,
      location,
      headline,
      info,
      specializedIn,
      position,
      authenticatedWith
    ) => {
      dispatch(
        actionTypes.auth(
          event,
          email,
          password,
          userName,
          img,
          companyName,
          location,
          headline,
          info,
          specializedIn,
          position,
          authenticatedWith
        )
      );
    },
    clear: () => {
      dispatch(actionTypes.clear());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignUp));

// this.state.companyName, this.state.location, this.state.headline, this.state.info, this.state.specializedIn?
