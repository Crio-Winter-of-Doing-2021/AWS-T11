import React, { Component } from "react";
import "../css/App.css";
import "../css/login.css"

class TaskData extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.location.state.data);
    this.state = {
      taskName: this.props.location.state.data.taskName,
      taskId: this.props.location.state.data.taskId,
      taskDelay: this.props.location.state.data.taskDelay,
      taskStatus: this.props.location.state.data.taskStatus,
      taskOwner: this.props.location.state.data.taskOwner,
      taskResponse: this.props.location.state.data.taskResponse["body"],
      taskLastModified: this.props.location.state.data.taskLastModified,
    };
  }
  render() {
    return (    
      <div className="DetailsContainer">
        <div id="TaskDetailsBlock">
          <h5>Name: {this.state.taskName}</h5>
          <h5>Status: {this.state.taskStatus}</h5>
          <h5>Owner: {this.state.taskOwner} </h5>
          <h5>Response: { this.state.taskResponse } </h5>
          <h5>Last Modified: {this.state.taskLastModified} </h5>
          <h5>Delay(Seconds): {this.state.taskDelay}</h5>
          {/* <button id="InfoButton">i</button> */}
        </div>
      </div>
    );
  }
}

export default TaskData;
