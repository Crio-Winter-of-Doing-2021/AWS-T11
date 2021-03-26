import { useState, useEffect } from "react";
import Task from "./Task";
import "../css/App.css";
import React from "react";
import Table from "react-bootstrap/Table";


function AllTask() {
  useEffect(() => {
    // window.location.reload();
    fetchAllTask();
  }, []);

  var [tasks, setTasks] = useState([]);
  var [status, setStatus] = useState("ALL");
  var [modifyATask, setModifyTask] = useState(false);
  var [modifyTaskID, setModifyTaskID] = useState(0);

  const fetchAllTask = async () => {
    var data = await fetch("http://localhost:3000/getAllTask")
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        var t = response;
        setTasks((tasks = t));
        // console.log(tasks);
        // var testDate = tasks[0]["time_created"].split("T")[0];
        var test = new Date(tasks[0]["time_created"]);
        console.log("test : ",typeof test);
      })
      .catch((err) => console.log(err));
  };

  const handleEvent = (e) => {
    setStatus((status = e.target.value));
    fetchAllTask();
  };



  const RetriveWhenCancel = () =>{
    fetchAllTask();
  }

  return (
    <div className="AllTaskDiv">
      <label name="status">Select Status:</label>
      <select name="status" id="status" onChange={handleEvent}>
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
            <th>Delay</th>
            <th>Response</th>
          </tr>
        </thead>
        <tbody> 
          {tasks.map((task) => {
            if (status === "ALL")
              return (
                <Task
                  data={task}
                  functionChange={RetriveWhenCancel}
                  key={task.taskid}
                />
              );
            if (status === task["status"])
              return (
                <Task
                  data={task}
                  functionChange={RetriveWhenCancel}
                  key={task.taskid}
                />
              );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default AllTask;
