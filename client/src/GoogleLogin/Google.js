import React from "react";
import { GoogleLogin } from "react-google-login";
import * as actionTypes from "../store/creators/authCreators";
import { connect } from "react-redux";
import classes from "./Google.module.css";
const client =
  "822679158214-b1j8dn9b5k18g1pvuo8sctstod8bi6qa.apps.googleusercontent.com";
const Google = (props) => {
  const onSuccess = (res) => {
    props.auth(
      "",
      res.profileObj.email,
      res.accessToken,
      res.profileObj.name,
      res.profileObj.imageUrl,
      "",
      "",
      "",
      "",
      "",
      "",
      "Google"
    );
  };

  const onFailure = (res) => {
    console.log(res);
  };

  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onFailure={onFailure}
      clientId={client}
      buttonText="Login"
      render={(renderProps) => (
        <>
          <link
            rel="stylesheet"
            type="text/css"
            href="//fonts.googleapis.com/css?family=Open+Sans"
          />

          <div className={classes.googlebtn}>
            <div className={classes.googleiconwrapper}>
              <img
                style={{ marginLeft: props.margin }}
                className={classes.googleicon}
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google"
              />
            </div>
            <p onClick={renderProps.onClick} className={classes.btntext}>
              <b>Sign in with google</b>
            </p>
          </div>
        </>
      )}
    />
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(Google);
