import React, { Component } from "react";
import classes from "./Field.module.css";
import { AdvancedFields } from "../Field/data";
class ScrollData extends Component {
  state = {
    checkedList: [],
  };

  componentDidMount = () => {
    console.log("Componenet Mount");
    let clist = [];
    console.log(clist);
    for (var i = 0; i < localStorage.length; i++) {
      if (
        localStorage.key(i) !== "SSUID" &&
        localStorage.key(i) !== "valid" &&
        localStorage.key(i) !== "SOCKET_ID" &&
        localStorage.key(i) !== "CLIENT_EMAIL"
      ) {
        // eslint-disable-next-line
        let item = localStorage.getItem(localStorage.key(i));
        AdvancedFields.forEach((field) => {
          if (item.includes(field.title)) {
            let newe = item.replace(field.title + " ", "");
            clist.push(newe);
            console.log(clist);
          }
        });
      }
    }

    this.setState((prevState) => ({
      ...prevState,
      checkedList: clist,
    }));
  };

  componentDidUpdate = () => {
    console.log("Scroll Data Component Uodata");
  };

  storeHandler = (title, e) => {
    if (localStorage.getItem(title + " " + e.target.value) === null) {
      localStorage.setItem(
        title + " " + e.target.value,
        title + " " + e.target.value
      );
    } else {
      localStorage.removeItem(title + " " + e.target.value);
    }

    let clist = this.state.checkedList;
    if (clist.includes(e.target.value)) {
      clist = clist.filter((c) => {
        return c !== e.target.value;
      });
      this.setState((prevState) => ({
        ...prevState,
        checkedList: clist,
      }));
    } else {
      clist.push(e.target.value);
      this.setState((prevState) => ({
        ...prevState,
        checkedList: clist,
      }));
    }
  };
  render() {
    console.log(this.state);

    let class1 = ["card-body"];
    let class2 = ["card", classes.customCard, "CustomCard"];
    return (
      <div className={this.props.title} key={Math.random()}>
        <div className={class2.join(" ")} style={{ width: "18rem" }}>
          <div className="card-header">
            <h2 className="mb-0">{this.props.title.slice(0, 7) + "..."}</h2>
          </div>
          <div className={class1.join(" ")}>
            <ul class="ks-cboxtags p-0 m-0">
              {this.props.item.map((val) => {
                return (
                  <li key={val}>
                    <input
                      style={{ marginLeft: "40px" }}
                      checked={
                        this.state.checkedList.includes(val) ? true : false
                      }
                      onChange={(e) => {
                        this.storeHandler(this.props.title, e);
                      }}
                      type="checkbox"
                      id={val}
                      name={val}
                      value={val}
                    />
                    <label htmlFor={val}>
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
  }
}

export default ScrollData;
