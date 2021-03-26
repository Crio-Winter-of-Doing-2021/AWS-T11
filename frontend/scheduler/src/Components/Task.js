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
    fetch("http://localhost:3000/cancel_task", {
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      body: JSON.stringify(send_data),
      headers: {
        "Content-Type": "application/json",
      },
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
      <td>{data.ret_message}</td>
      <td>
        <Link
          style={navStyle}
          to={{
            pathname: "/modify_task",
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
