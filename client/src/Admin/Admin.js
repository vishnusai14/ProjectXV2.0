import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "../Field/HeaderExample";
class Admin extends Component {
  componentDidMount = () => {
    //console.log("Component Mounted");
    /* eslint-disable-next-line no-undef */
    $(function () {
      //console.log("Component");
      $(".selectpicker").selectpicker(); /* eslint-disable-line no-undef */
    });
  };
  render() {
    return (
      <>
        <Header img = {true} />
      </>
    );
  }
}

export default withRouter(Admin);
