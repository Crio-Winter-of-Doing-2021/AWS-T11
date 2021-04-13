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
    backgroundColor: "#ff7e7e",
    color: "white",
  };

  const taskInformation = {
    taskName: data.taskName,
    taskId: data.taskId,
    taskDelay: data.time_delay,
    taskStatus: data.status,
    taskOwner: data.user_id,
    taskResponse: data.ret_message,
    taskLastModified: data.last_modified,
    taskRetryCount: data.retry_count,
    taskRetryDuration: data.retry_duration
  };

  const local_storage = JSON.parse(localStorage.getItem("login"));
  const _userId = local_storage["userId"];
  const _isAdmin = local_storage["Admin"];

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
      <button className="taskModifyButton">Modify</button>
    </Link>
  ) : (
    <button className="taskModifyButton" style={modifyButton}>
      Modify
    </button>
  );

  const renderCancelAs = isAuthenticatedUserTask ? (
    <button className="taskCancelButton" onClick={cancelHandler}>
      Cancel
    </button>
  ) : (
    <button className="taskCancelButton" style={modifyButton}>
      Cancel
    </button>
  );

  return (
    <tr id="taskTR">
      <td>{data.taskid}</td>
      <td>{data.taskName}</td>
      <td>{data.status}</td>

      {/* <td></td> */}
      <td>{data.last_modified}</td>
      <td>{renderModifyAs}</td>
      <td>{renderCancelAs}</td>
      <td id="InfoTD">
        {
          <Link
            to={{
              pathname: "/Dashboard/taskdata",
              state: {
                data: taskInformation,
              },
            }}
            style={navStyle}
          >
            <button id="InfoButton"> &nbsp;i &nbsp;</button>
          </Link>
        }
      </td>
    </tr>
  );
}

export default Task;

/*
<td id="InfoTD">
        { <Link
          to={{
            pathname: "/Dashboard/taskdata",
            state: {
              data: taskInformation,
            },
          }}
          style={navStyle}
        >
          <button id="InfoButton">i</button>
        </Link> }
        <button id="InfoButton">i</button>
      </td>
*/
