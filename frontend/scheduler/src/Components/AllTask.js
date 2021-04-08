import React, { Component } from "react";
import Task from "./Task";
import "../css/App.css";
import Table from "react-bootstrap/Table";
import auth from "../user/auth";
import "../css/login.css";

class AllTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      status: "ALL",
      modifyATask: false,
      modifyTaskID: 0,
      token_valid: false,
      userSpecific: "YES",
      userName: "",
      userId: "",
    };
  }

  componentDidMount() {
    try {
      let local_storage = JSON.parse(localStorage.getItem("login"));
      if (local_storage["login"]) {
        var _name = local_storage["userName"];
        var _id = local_storage["userId"];
        auth.login(_name, _id);
        this.setState({ userName: _name, userId: _id });
      } else console.log("failed test");
    } catch (err) {
      console.log("No able to retrieve values from LocalStorage in AllTask.js");
    }

    this.fetchAllTask();
  }

  fetchAllTask = async () => {
    try {
      const local_token = JSON.parse(localStorage.getItem("login"));

      var myHeader = new Headers();
      myHeader.append("Authorization", "Bearer " + local_token["token"]);
      myHeader.append("Content-Type", "application/json");

      await fetch("http://localhost:3000/getAllTask", {
        method: "GET",
        mode: "cors",
        credentials: "same-origin",
        headers: myHeader,
      })
        .then((response) => response.json())
        .then((response) => {
          var t = response;
          t = this.convertAllDate(t);
          console.log(t);
          this.setState({ tasks: t });
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  // 7/4/21-(16:08:20)

  convertAllDate(t) {
    t.map((task) => {
      let ret_time = task["last_modified"];
      let convert_date = new Date(ret_time["$date"]);

      console.log(convert_date.getDate() , convert_date.getMonth());

      let dateString = convert_date.getDate()+"/"+convert_date.getMonth()+"/"+convert_date.getFullYear() ;

      let testDateString =
      dateString + "-"+
      "(" +
        convert_date.getHours() +
        ":" +
        convert_date.getMinutes() +
        ":" +
        convert_date.getSeconds() +")";

      task["last_modified"] = testDateString;
      return "";
    });
    return t;
  }

  handleEvent = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.fetchAllTask();
  };

  RetriveWhenCancel = () => {
    this.fetchAllTask();
  };

  render() {
    return (
      <div className="AllTaskDiv">
        <div className="allTaskOptions">
          <div>
            <label name="status">Select Status:</label>
            <select name="status" id="status" onChange={this.handleEvent}>
              <option value="ALL">ALL</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="RUNNING">RUNNING</option>
              <option value="FAILED">FAILED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
          <div>
            <label name="userSpecific">User Specific:</label>
            <select
              name="userSpecific"
              id="userSpecific"
              onChange={this.handleEvent}
            >
              <option value="YES">YES &nbsp;&nbsp;&nbsp;&nbsp;</option>
              <option value="NO">NO &nbsp;&nbsp;&nbsp;&nbsp;</option>
            </select>
          </div>
        </div>
        
        <Table borderless hover variant="" className="taskTable">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Status</th>
              <th>Delay (Seconds)</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {this.state.tasks.map((task) => {
              if (this.state.status === "ALL") {
                if (
                  this.state.userSpecific === "YES" &&
                  this.state.userId === task["user_id"]
                ) {
                  return (
                    <Task
                      data={task}
                      functionChange={this.RetriveWhenCancel}
                      key={task.taskid}
                    />
                  );
                } else if (this.state.userSpecific === "NO")
                  return (
                    <Task
                      data={task}
                      functionChange={this.RetriveWhenCancel}
                      key={task.taskid}
                    />
                  );
              }

              if (this.state.status === task["status"]) {
                if (
                  this.state.userSpecific === "YES" &&
                  this.state.userId === task["user_id"]
                ) {
                  return (
                    <Task
                      data={task}
                      functionChange={this.RetriveWhenCancel}
                      key={task.taskid}
                    />
                  );
                } else if (this.state.userSpecific === "NO")
                  return (
                    <Task
                      data={task}
                      functionChange={this.RetriveWhenCancel}
                      key={task.taskid}
                    />
                  );
              }
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default AllTask;
