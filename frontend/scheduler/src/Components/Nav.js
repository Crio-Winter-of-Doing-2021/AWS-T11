import "../css/App.css";
import { Link } from "react-router-dom";
import React from "react";
import Logout from "../user/Logout";
import { useState } from "react";

function Nav(props) {
  const navStyle = {
    color: "rgb(71, 92, 99)",
    textDecoration: "none",
  };

  let [currentTab, changeTab] = useState("/Dashborad");
  

  changeTab = (tab) => {
    // console.log("Nav: ", tab);

    switch(tab){


      case "home":
        console.log("In home")
        break;

      default:
        break;

    }
    
  };

  return (
    <nav id="CustomTaskNav">
      <Link style={navStyle} to="/Dashboard" onClick={() => changeTab("home")}>
        <span>Task Scheduler</span>
      </Link>
      <Link
        style={navStyle}
        to="/Dashboard/createtask"
        onClick={() => changeTab("createTask")}
      >
        <span>Create Task</span>
      </Link>
      <Link
        style={navStyle}
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
