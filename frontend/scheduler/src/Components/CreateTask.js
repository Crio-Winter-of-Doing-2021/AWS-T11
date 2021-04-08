import React, { Component } from "react";
import "../css/App.css";

// #C7E5FF

class CreateTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskurl: "",
      delay: "",
      taskName: "",
      para_count: 0,
      submitted: false,
      parameters: [
        { key: "", value: "" },
        { key: "", value: "" },
        { key: "", value: "" },
        { key: "", value: "" },
      ],
    };
  }

  handleSubmit = (evt) => {
    evt.preventDefault();

    if (!this.state.submitted) return;

    // console.log(this.state);
    var data = [];

    const local_token = JSON.parse(localStorage.getItem("login"));
    var myHeader = new Headers();
    myHeader.append("Authorization", "Bearer " + local_token["token"]);
    myHeader.append("Content-Type", "application/json");  

    var send_para = [];
    for(let i = 0; i < this.state.para_count; i++) {
      send_para.push(this.state.parameters[i]);
    }

    console.log(send_para);

    var send_data = {
      taskurl: this.state.taskurl,
      delay: this.state.delay,
      userId: local_token["userId"],
      taskName: this.state.taskName,
      taskParameters: send_para
    };

    fetch("http://localhost:3000/create_task", {
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      body: JSON.stringify(send_data),
      headers: myHeader,
    })
      .then((res) => res.json())
      .then((res) => {
        data = res;
        console.log(data, " - when creating new task");
      })
      .catch((err) => console.log(err));

    this.setState({ taskurl: "", delay: "", taskName: "", submitted: false });
    // console.log("This data is received : " + data["message"]);
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  incrementParameters = () => {
    if (this.state.para_count === 4) return;
    this.setState({ para_count: this.state.para_count + 1 });
    // console.log("Pressed : " + this.state.para_count);
  };

  decrementParameters = () => {
    if (this.state.para_count === 0) return;
    this.setState({ para_count: this.state.para_count - 1 });
    // console.log("Pressed : " + this.state.para_count);
  };

  onAddParametersChange = (e) => {
    let test = this.state.parameters;
    test[e.target.id][e.target.name] = e.target.value;
    this.setState({ parameters: test });
    // console.log(this.state.parameters);
  };

  createNewTask = async () => {};

  render() {
    const { taskurl, delay, taskName, para_count } = this.state;
    let render_paramters = [];
    if (para_count === 0) render_paramters = "";
    else
      for (let i = 0; i < para_count; i++) {
        render_paramters.push(
          <div className="parameters" key={i}>
            <label>Key:</label>
            <input
              type="text"
              name={"key"}
              id={i}
              onChange={this.onAddParametersChange}
            />
            <label>Value: </label>
            <input
              type="text"
              name={"value"}
              id={i}
              onChange={this.onAddParametersChange}
            />
          </div>
        );
      }
    return (
      <div className="container">
        <form
          action=""
          id="createTaskForm"
          className="forms"
          onSubmit={this.handleSubmit}
        >
          <label>
            Task Name:
            <div className="row"></div>
            <input
              type="text"
              className="u-full-width"
              name="taskName"
              value={taskName}
              onChange={this.handleChange}
            />
          </label>

          <label>
            Task URL:
            <div className="row"></div>
            <input
              type="text"
              className="u-full-width"
              name="taskurl"
              value={taskurl}
              onChange={this.handleChange}
            />
            {render_paramters}
            <div>
              <button name="TEST" onClick={this.incrementParameters}>
                Add Parameters
              </button>
              <button
                style={{ marginLeft: "10px", fontWeight: "bold" }}
                name="TEST02"
                onClick={this.decrementParameters}
              >
                Remove
              </button>
            </div>
          </label>

          <label>
            Delay(Seconds):
            <input
              type="text"
              value={delay}
              className="u-full-width"
              name="delay"
              id="name"
              onChange={this.handleChange}
            />
          </label>

          <div className="">
            <button
              type="submit"
              className="button-primary"
              id="createTaskButton"
              name="submit_button"
              onClick={() => {
                this.setState({ submitted: true });
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateTask;
