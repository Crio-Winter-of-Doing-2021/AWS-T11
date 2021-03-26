import React, { Component } from "react";
import "./component-css/functions.css";

import { Link } from "react-router-dom";

class ModifyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskid: this.props.location.state.taskid,
      new_delay: 0,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    var send_data = {
      task_id: this.state.taskid,
      delay_val: Number(this.state.new_delay),
    };
    var data = [];
    fetch("http://localhost:3000/modify_task", {
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      body: JSON.stringify(send_data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        data = res;
      })
      .catch((err) => console.log(err));
      this.setState({new_delay:0});
    console.log("This data is received : " + data["message"]);
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    console.log(this.state.taskid, "GOT BY CALL");
  }

  render() {
    var { taskid, new_delay } = this.state;
    const navStyle = {
      color: "rgb(71, 92, 99)",
      textDecoration: "none",
    };
    return (
      <form id="createTaskForm" className="forms" onSubmit={this.handleSubmit}>
        <label>
          Task ID:
          <input
            disabled
            type="text"
            className="u-full-width"
            name="taskid"
            value={taskid}
            onChange={this.handleChange}
          />
        </label>

        <label>
          New Delay:
          <input
            type="text"
            value={new_delay}
            className="u-full-width"
            name="new_delay"
            id="name"
            onChange={this.handleChange}
          />
        </label>

          <button
            className="button-primary"
            id="createTaskButton"
            name="submit"
          > 
            Apply Changes
          </button>
        {/* <button className="button-primary" id="createTaskButton">
          <Link style={navStyle} to="/alltask">
            Cancel
          </Link>
        </button> */}
      </form>
    );
  }
}

export default ModifyComponent;
