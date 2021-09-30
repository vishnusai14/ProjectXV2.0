import React, { Component } from "react";
import classes from "./Check.module.css";
import { connect } from "react-redux";
import * as actionTypes from "../store/creators/authCreators";
import instance from "../axios/axios";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
class CheckEmail extends Component {
  state = {
    value: "",
    openModal: false,
    disable: true,
  };

  componentDidMount = () => {
    this.props.clear();
    setTimeout(() => this.setState({ disable: false }), 30000);
  };
  componentWillUnmount = () => {
    ////console.log("UnMount")
    this.props.otpClear();
  };

  onChangefiled = (event) => {
    this.setState((prevState) => ({
      value: event.target.value,
    }));
  };

  click = (event) => {
    this.props.otpVerify(event, this.state.value);
  };
  resend = (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      disable: true,
    }));
    let data = {
      email: localStorage.getItem("CLIENT_EMAIL"),
    };
    instance
      .post("/otp/resend", data)
      .then((response) => {
        ////console.log(response)
        this.setState((prevState) => ({
          ...prevState,
          openModal: true,
        }));
      })
      .catch((err) => {
        ////console.log(err)
      });
    setTimeout(() => this.setState({ disable: false }), 30000);
  };
  closeModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      openModal: false,
    }));
  };

  render() {
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
          <DialogTitle id="alert-dialog-title">{"OTP Sent"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              OTP Has Been Sent SuccessFully To The Client
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
        <div className={classes.authForm}>
          <p>An OTP Has Been Sent To Your {this.props.email}</p>
          <input
            className={classes.inputField}
            onChange={(event) => {
              this.onChangefiled(event);
            }}
            value={this.state.value}
            type="number"
            placeholder="Enter Your OTP"
            autoComplete="false"
          />
          <button
            onClick={(event) => {
              this.click(event);
            }}
          >
            Submit
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>Wait For 30 Seconds....</p>
          <button
            disabled={this.state.disable}
            onClick={(e) => {
              this.resend(e);
            }}
            style={{ margin: "10px" }}
            className="btn btn-primary"
          >
            Re Send
          </button>
        </div>
        {this.props.error}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    otpVerify: (event, otp) => {
      dispatch(actionTypes.otpverify(event, otp));
    },
    clear: () => {
      dispatch(actionTypes.clear());
    },
    otpClear: () => {
      dispatch(actionTypes.otpClear());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckEmail);
