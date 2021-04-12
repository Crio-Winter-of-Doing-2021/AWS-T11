import React, { Component } from "react";
import "../css/App.css";
import "../css/login.css";

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
        <h5>
          <span> Name: </span>
          {this.state.taskName}
        </h5>

        <div id="TaskDetailsBlock">
          <h5>
            <span> Status: </span> {this.state.taskStatus}
          </h5>
          <h5>
            <span> Owner: </span> {this.state.taskOwner}
          </h5>
          <h5>
            <span> Response: </span> {this.state.taskResponse}
          </h5>
          <h5>
            <span>Last Modified:</span> {this.state.taskLastModified}
          </h5>
          <h5>
            <span> Delay(Seconds): </span>
            {this.state.taskDelay}
          </h5>
         
          {/* <button id="InfoButton">i</button> */}
        </div>
      </div>
    );
  }
}

export default TaskData;
