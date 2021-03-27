import React, { Component } from "react";
import Task from "./Task";
import "../css/App.css";
import Table from "react-bootstrap/Table";

class AllTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      status: "ALL",
      modifyATask: false,
      modifyTaskID: 0,
      token_valid : false
    };
  }

  componentDidMount(){
    // console.log("AllTask.js : ",this.props)
    this.fetchAllTask();
  }

  fetchAllTask = async () => {
    try{
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
        this.setState({tasks : t});
      })
      .catch((err) => console.log(err));
    }
    catch(err){
      console.log(err);
    }
  };

  convertAllDate(t){
    t.map(task => {
      let ret_time = task["last_modified"];
      let convert_date = new Date(ret_time["$date"]);
      let testDateString = convert_date.getHours()+" : "+convert_date.getMinutes()+" : "+convert_date.getSeconds();
      console.log("DATE : ",testDateString);
      task["last_modified"] = testDateString;
      return "";
    })
    return t;
  }

  handleEvent = (e) => {
    this.setState({status:e.target.value})
    this.fetchAllTask();
  };

  RetriveWhenCancel = () => {
    this.fetchAllTask();
  };

  render() {

    return (
      <div className="AllTaskDiv">
        <label name="status">Select Status:</label>
        <select name="status" id="status" onChange={this.handleEvent}>
          <option value="ALL">ALL</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="RUNNING">RUNNING</option>
          <option value="FAILED">FAILED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <Table borderless hover variant="" className="taskTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Delay(Seconds)</th>
              <th>Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {this.state.tasks.map((task) => {
              if (this.state.status === "ALL")
                return (
                  <Task
                    data={task}
                    functionChange={this.RetriveWhenCancel}
                    key={task.taskid}
                  />
                );
              if (this.state.status === task["status"])
                return (
                  <Task
                    data={task}
                    functionChange={this.RetriveWhenCancel}
                    key={task.taskid}
                  />
                );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default AllTask;
