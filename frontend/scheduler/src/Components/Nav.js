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
    <nav id="CustomTaskNav">
      <Link style={navStyle} to="/Dashboard">
        <span>Task Scheduler</span>
      </Link>
      <Link style={navStyle} to="/Dashboard/createtask">
        <span>Create Task</span>
      </Link>
      <Link style={navStyle} to="/Dashboard/alltask">
        <span>All Task</span>
      </Link>
      <Logout {...props} />
    </nav>
  );
}

export default Nav;
