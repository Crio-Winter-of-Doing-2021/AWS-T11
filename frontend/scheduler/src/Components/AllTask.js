import { useState, useEffect } from "react";
import Task from "./Task";
import "../css/App.css";
import React from "react";
import Table from "react-bootstrap/Table";

function AllTask() {
  useEffect(() => {
    fetchAllTask();
  }, []);

  var [tasks, setTasks] = useState([]);

  const fetchAllTask = async () => {
    var data = await fetch("http://localhost:3000/getAllTask")
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        var t = response;
        setTasks((tasks = t));
        console.log(tasks);
      })
      .catch((err) => console.log(err));
    // console.log(tasks);
  };

  return (
    // <div className="AllTask">
    //     {tasks.map(task => (
    //         <Task data={task} key={task.taskid}/>
    //     ))}
    // </div>
    <Table borderless hover variant="dark" className="taskTable">
      <thead>
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>Status</th>
          <th>Scehdule</th>
          <th>Response</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <Task data={task} key={task.taskid} />
        ))}
      </tbody>
    </Table>
  );
}

export default AllTask;
