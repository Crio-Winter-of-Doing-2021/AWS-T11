import React from "react";
import "../css/App.css";
import "../css/login.css";

import { Link } from "react-router-dom";

function Task({ data, functionChange }) {
  const navStyle = {
    color: "rgb(71, 92, 99)",
    textDecoration: "none",
  };

  const modifyButton = {
    backgroundColor: "rgba(242, 7, 7,0.5)",
    color: "white",
  };

  const local_storage = JSON.parse(localStorage.getItem("login"));
  const _userId = local_storage["userId"];
  const _isAdmin = local_storage["Admin"];

  // if (_isAdmin) console.log("Check from TASK.js user is Admin");
  // else console.log("Check from TASK.js user is not Admin");

  var isAuthenticatedUserTask =
    _userId === data.user_id || _isAdmin ? true : false;

  const cancelHandler = () => {
    const send_data = {
      taskid: data.taskid,
    };

    const local_token = JSON.parse(localStorage.getItem("login"));

    var myHeader = new Headers();
    myHeader.append("Authorization", "Bearer " + local_token["token"]);
    myHeader.append("Content-Type", "application/json");

    fetch("http://localhost:3000/cancel_task", {
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      body: JSON.stringify(send_data),
      headers: myHeader,
    })
      .then((res) => res.json())
      .then((res) => {
        data = res;
      })
      .catch((err) => console.log(err));
    console.log(data["message"]);
    setTimeout(() => {
      functionChange();
    }, 2000);
  };

  const renderModifyAs = isAuthenticatedUserTask ? (
    <Link
      style={navStyle}
      to={{
        pathname: "/Dashboard/modify_task",
        state: {
          taskid: data.taskid,
          new_delay: 0,
        },
      }}
    >
      <button>Modify</button>
    </Link>
  ) : (
    <button style={modifyButton}>Modify</button>
  );

  const renderCancelAs = isAuthenticatedUserTask ? (
    <button onClick={cancelHandler}>Cancel</button>
  ) : (
    <button style={modifyButton}>Cancel</button>
  );

  return (
    <tr>
      <td>{data.taskid}</td>
      <td>{data.status}</td>
      <td>{data.time_delay}</td>
      {/* <td></td> */}
      <td>{data.last_modified}</td>
      <td>{renderModifyAs}</td>
      <td>{renderCancelAs}</td>
      {/* <td><button id="InfoButton">i</button></td> */}
    </tr>
  );
}

export default Task;
