import "../css/App.css";
import { Link } from "react-router-dom";
import React from "react";
import Logout from "../user/Logout";
import { useState } from "react";

function Nav(props) {

  let [onHome, changeTabHome] = useState({ textDecoration: "underline" });
  let [onAllTask, changeTabTask] = useState({ textDecoration: "none" });
  let [onCreateTask, changeTabCreate] = useState({ textDecoration: "none" });

  let changeTab = (tab) => {

    switch (tab) {
      case "home":
        changeTabHome((onHome = { textDecoration: "underline" }));
        changeTabTask((onAllTask = { textDecoration: "none" }));
        changeTabCreate((onCreateTask = { textDecoration: "none" }));
        break;

      case "createTask":
        changeTabHome((onHome = { textDecoration: "none" }));
        changeTabTask((onAllTask = { textDecoration: "none" }));
        changeTabCreate((onCreateTask = { textDecoration: "underline" }));
        break;

      case "allTask":
        changeTabHome((onHome = { textDecoration: "none" }));
        changeTabTask((onAllTask = { textDecoration: "underline" }));
        changeTabCreate((onCreateTask = { textDecoration: "none" }));
        break;

      default:
        changeTabHome((onHome = { textDecoration: "none" }));
        changeTabTask((onAllTask = { textDecoration: "none" }));
        changeTabCreate((onCreateTask = { textDecoration: "none" }));
        break;
    }
  };

  return (
    <nav id="CustomTaskNav">
      <Link style={onHome} to="/Dashboard" onClick={() => changeTab("home")}>
        <span>Task Scheduler</span>
      </Link>
      <Link
        style={onCreateTask}
        to="/Dashboard/createtask"
        onClick={() => changeTab("createTask")}
      >
        <span>Create Task</span>
      </Link>
      <Link
        style={onAllTask}
        to="/Dashboard/alltask"
        onClick={() => changeTab("allTask")}
      >
        <span>All Task</span>
      </Link>
      <Logout {...props} />
    </nav>
  );
}

export default Nav;
