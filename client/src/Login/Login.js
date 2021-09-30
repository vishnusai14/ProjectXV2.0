import React, { Component } from "react";
import Nav from "../nav/Nav";
import classes from "./Login.module.css";
import * as actionTypes from "../store/creators/authCreators";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
class Login extends Component {
  state = {
    email: "",
    password: "",
  };

  componentDidMount = () => {
    this.props.clear();
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

  submitHandler = (e) => {
    e.preventDefault();
    this.props.login(e, this.state.email, this.state.password);
  };

  render() {
    //console.log(this.props);
    let class1 = ["form-control", classes.formcontrol];
    let class2 = ["text-right", classes.forgotpassword];
    return this.props.loading ? (
      <Spinner />
    ) : (
      <>
        <Nav username="" />
        <div className={classes.verticalspace100}></div>
        <div className={classes.authwrapper}>
          <div className={classes.authinner}>
            <form>
              <h3>Log In</h3>

              <div className="form-group">
                <label>Email address</label>
                <input
                  onChange={(e) => {
                    this.emailHandler(e);
                  }}
                  type="email"
                  className={class1.join(" ")}
                  placeholder="Enter email"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  onChange={(e) => {
                    this.passwordHandler(e);
                  }}
                  type="password"
                  className={class1.join(" ")}
                  placeholder="Enter password"
                />
              </div>

              <button
                onClick={(e) => {
                  this.submitHandler(e);
                }}
                className="btn btn-primary btn-block"
              >
                Log In
              </button>
              <p>{this.props.error}</p>
              <p className={class2.join(" ")}>
                New Member{" "}
                <Link to="/signup" href="#">
                  Sign Up?
                </Link>
              </p>
            </form>
          </div>
        </div>
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
    login: (event, email, password, userName) => {
      dispatch(actionTypes.login(event, email, password));
    },
    clear: () => {
      dispatch(actionTypes.clear());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
