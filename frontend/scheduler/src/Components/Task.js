import React from "react";
import "../css/App.css";

import { Link } from "react-router-dom";

function Task({ data, functionChange }) {
  const navStyle = {
    color: "rgb(71, 92, 99)",
    textDecoration: "none",
  };


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

  return (
    <tr>
      <td>{data.taskid}</td>
      <td>{data.status}</td>
      <td>{data.time_delay}</td>
      {/* <td></td> */}
      <td>{data.last_modified}</td>
      <td>
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
      </td>
      <td>
        <button onClick={cancelHandler}>Cancel</button>
      </td>
    </tr>
  );
}

export default Task;
