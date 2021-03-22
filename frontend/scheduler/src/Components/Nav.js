import "../css/App.css";
import { Link } from "react-router-dom";
import React from "react";

function Nav() {
  const navStyle = {
    color: "rgb(71, 92, 99)",
    textDecoration: "none",
  };

  return (
    <nav>
      <Link style={navStyle} to="/">
        <h1>Task Scheduler</h1>
      </Link>
      <Link style={navStyle} to="/createtask">
        <h3>Create Task</h3>
      </Link>
      <Link style={navStyle} to="/alltask">
        <h3>All Task</h3>
      </Link>
    </nav>
  );
}

export default Nav;
