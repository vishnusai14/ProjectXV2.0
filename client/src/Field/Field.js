import React, { Component } from "react";
import { Fields, AdvancedFields } from "./data";
import classes from "./Field.module.css";
import ScrollData from "./ScrollData";
class Field extends Component {
  state = {
    checkedList: [],
    id: "",
    add: false,
    dupId: "",
  };

  componentDidMount = () => {
    for (var i = 0; i < localStorage.length; i++) {
      if (
        localStorage.key(i) !== "SSUID" &&
        localStorage.key(i) !== "valid" &&
        localStorage.key(i) !== "SOCKET_ID" &&
        localStorage.key(i) !== "CLIENT_EMAIL"
      ) {
        ////console.log(localStorage.key(i));
        localStorage.removeItem(localStorage.key(i));
      }
    }
  };

  componentDidUpdate = () => {
    console.log("Component Updated");
    if (document.getElementById(this.state.id) !== null) {
      if (this.state.add) {
        document.getElementById(this.state.id).classList.add("show");
      } else {
        document.getElementById(this.state.id).classList.remove("show");
      }
    }
  };

  checkHandler = (e) => {
    let clist = this.state.checkedList;
    if (clist.includes(e.target.value)) {
      if (localStorage.getItem(e.target.value) !== null) {
        localStorage.removeItem(e.target.value);
      }

      clist = clist.filter((c) => {
        return c !== e.target.value;
      });
      this.setState((prevState) => ({
        ...prevState,
        checkedList: clist,
      }));
    } else {
      let isField = false;

      for (var i = 0; i < AdvancedFields.length; i++) {
        if (AdvancedFields[i].title === e.target.value) {
          isField = true;
          break;
        }
      }
      console.log(isField);
      if (!isField) {
        localStorage.setItem(e.target.value, e.target.value);
      }
      clist.push(e.target.value);
      this.setState((prevState) => ({
        ...prevState,
        checkedList: clist,
      }));
    }
  };

  showHandler = (e, id) => {
    e.preventDefault();

    let value = this.state.dupId;
    if (value === id) {
      this.setState((prevState) => ({
        ...prevState,
        id: id,
        dupId: "",
        add: false,
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        id: id,
        dupId: id,
        add: true,
      }));
    }
  };

  render() {
    let html = [];
    let class1 = ["accordian", classes.acc];
    let scrollClass = ["row", "flex-row", "flex-nowrap", classes.scroll];
    console.log(this.state);
    return (
      <div className={classes.field}>
        <div className={class1.join(" ")} id="accordionExample">
          {Fields.map((field) => {
            return (
              <div key={Math.random()} className="card">
                <div className="card-header" id={field.header}>
                  <h2 className="mb-0">
                    <button
                      onClick={(e) => {
                        this.showHandler(e, field.id);
                      }}
                      className="btn btn-link"
                      type="button"
                    >
                      {field.title}
                    </button>
                  </h2>
                </div>

                <div
                  id={field.id}
                  className="collapse"
                  aria-labelledby={field.header}
                  data-parent="#accordionExample"
                >
                  <div className="card-body">
                    <ul className="ks-cboxtags p-0 m-0">
                      {field.value.map((val) => {
                        return (
                          <li key={val}>
                            <input
                              className="form-check-input"
                              checked={
                                this.state.checkedList.includes(val)
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                this.checkHandler(e);
                              }}
                              type="checkbox"
                              id={val}
                              name={val}
                              value={val}
                            />
                            <label className="form-check-label" htmlFor={val}>
                              {val.length > 15 ? val.slice(0, 15) + "..." : val}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="container-fluid"
          style={{ overflowX: "auto", margin: "30px" }}
        >
          <div id="scrollalecard" className={scrollClass.join(" ")}>
            {this.state.checkedList.forEach((item) => {
              AdvancedFields.forEach((field) => {
                if (item === field.title) {
                  html.push(
                    <ScrollData
                      key={Math.random()}
                      title={field.title}
                      item={field.skills}
                    />
                  );
                } else {
                  html.push(" ");
                }
              });
            })}

            {html.map((e) => {
              return e;
            })}
          </div>
        </div>
      </div>
    );
  }
}
export default Field;
