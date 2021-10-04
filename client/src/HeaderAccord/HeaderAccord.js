import React, { Component } from "react";
import classes from "./HeaderAccord.module.css";
import HeaderAccordData from "./HeaderAccordData/HeaderAccordData";
class HeaderAccord extends Component {
  render() {
    let btnClass = ["btn", "btn-primary", classes.button];

    return (
      <div>
        <div className={classes.HeaderAccord}>
          <div className={classes.HeaderAccordInnerDiv}>
            {this.props.items.map((item) => {
              return (
                <button
                  key={Math.random()}
                  className={btnClass.join(" ")}
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseExample"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  {item.length > 15 ? item.slice(0, 15) + "..." : item}
                </button>
              );
            })}
          </div>
          <div className={classes.HeaderAccordInnerDiv}>
            <button
              key={Math.random()}
              className={btnClass.join(" ")}
              type="button"
              data-toggle="collapse"
              data-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              {this.props.location.length > 15
                ? this.props.location.slice(0, 15) + "..."
                : this.props.location}
            </button>
          </div>

          <div className={classes.HeaderAccordInnerDiv}>
            {this.props.type.map((e) => {
              return (
                <button
                  key={Math.random()}
                  className={btnClass.join(" ")}
                  type="button"
                  data-toggle="collapse"
                  data-target="#collapseExample"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  {e}
                </button>
              );
            })}
          </div>
        </div>
        <div
          style={{ minWidth: "100vw !important", maxWidth: "100vw" }}
          className="collapse"
          id="collapseExample"
        >
          <div className="card card-body">
            <HeaderAccordData />
          </div>
        </div>
      </div>
    );
  }
}

export default HeaderAccord;
