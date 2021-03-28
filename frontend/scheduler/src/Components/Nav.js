import "../css/App.css";
import { Link } from "react-router-dom";
import React from "react";
import Logout from '../user/Logout';

function Nav(props) {
  const navStyle = {
    color: "rgb(71, 92, 99)",
    textDecoration: "none",
  };

  return (
    <nav>
      <Link style={navStyle} to="/Dashboard">
        <h1>Task Scheduler</h1>
      </Link>
      <Link style={navStyle} to="/Dashboard/createtask">
        <h3>Create Task</h3>
      </Link>
      <Link style={navStyle} to="/Dashboard/alltask">
        <h3>All Task</h3>
      </Link>
      <Logout {...props} />
    </nav>
  );
}

export default Nav;
