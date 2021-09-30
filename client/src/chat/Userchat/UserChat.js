import React, { Component } from "react";
import ReactDOM from "react-dom";

class UserChat extends Component {
  myRef = React.createRef();
  componentWillUpdate = () => {
    const node = ReactDOM.findDOMNode(this);
    this.shouldScrollToBottom =
      node.scrollTop + node.clientHeight + 100 >= node.scrollHeight;
  };
  componentDidUpdate = () => {
    if (this.shouldScrollToBottom) {
      const node = this.myRef.current;
      node.scrollTop = node.scrollHeight;
    }
  };

  componentDidMount = () => {
    const node = this.myRef.current;
    node.scrollTop = node.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);
  };

  render() {
    ////console.log(this.props.msg)
    return (
      <div ref={this.myRef} className="content" id="content">
        <div className="container">
          <div className="col-md-12">
            {this.props.msg.map((e) => {
              return (
                <div key={Math.random()}>
                  <div
                    key={Math.random()}
                    className={e.isReceived ? "message" : "message me"}
                  >
                    <div
                      key={Math.random()}
                      className={e.isReceived ? "text-main" : "text-main me"}
                    >
                      <div key={Math.random()} className="text-group">
                        <div
                          key={Math.random()}
                          className={e.isReceived ? "text" : "text me"}
                        >
                          <p key={Math.random()}>{e.msg}.</p>
                        </div>
                        <p key={Math.random()} style={{ textAlign: "initial" }}>
                          {e.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default UserChat;
