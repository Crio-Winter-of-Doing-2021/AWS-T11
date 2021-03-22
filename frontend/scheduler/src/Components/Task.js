import React from "react";
import "../css/App.css";
import Table from "react-bootstrap/Table";

function Task({ data }) {
  return (
    // <div className="taskClass">
    //     <p>{data.taskid}</p>
    //     <p>{data.status}</p>
    //     <p>{data.time_delay}</p>
    //     <p>{data.ret_message}</p>
    //     <button className="taskCancelButton">Cancel</button>
    //     <button className="taskModifyButton">Modify</button>
    // </div>
    <tr>
      <td>1</td>
      <td>{data.taskid}</td>
      <td>{data.status}</td>
      <td>{data.time_delay}</td>
      <td>{data.ret_message}</td>
      <td>
        <button>Modify</button>
      </td>
      <td>
        <button>Cancel</button>
      </td>
    </tr>
  );
}

export default Task;
