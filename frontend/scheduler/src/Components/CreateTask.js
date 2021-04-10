import React, { Component } from "react";
import "../css/App.css";

class CreateTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskurl: "",
      delay: "",
      taskName: "",
      para_count: 0,
      submitted: false,
      time_system: "",
      secondBtnC: "",
      dateBtnC: "",
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
    for (let i = 0; i < this.state.para_count; i++) {
      send_para.push(this.state.parameters[i]);
    }

    if (this.state.time_system == "date_time") {
      console.log("SEE :", this.state.delay);
      return;
    }

    console.log(send_para);

    var send_data = {
      taskurl: this.state.taskurl,
      delay: this.state.delay,
      userId: local_token["userId"],
      taskName: this.state.taskName,
      taskParameters: send_para,
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
    const { taskurl, delay, taskName, para_count, time_system } = this.state;
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

    let render_time_input;
    if (time_system == "") render_time_input = "";
    else if (time_system == "seconds")
      render_time_input = (
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
      );
    else if (time_system == "date_time")
      render_time_input = (
        <label>
          Date:
          <input
            name="delay"
            className="u-full-width"
            type="date"
            onChange={this.handleChange}
          ></input>
        </label>
      );

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
                style={{
                  marginLeft: "10px",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
                name="TEST02"
                onClick={this.decrementParameters}
              >
                Remove
              </button>
            </div>
          </label>

          {render_time_input}

          <div>
            <button
              style={{ color: this.state.dateBtnC }}
              onClick={() =>
                this.setState({
                  time_system: "date_time",
                  secondBtnC: "",
                  dateBtnC: "#95c7f3",
                })
              }
            >
              Date
            </button>
            <button
              style={{
                marginLeft: "10px",
                marginBottom: "10px",
                color: this.state.secondBtnC,
              }}
              onClick={() =>
                this.setState({
                  time_system: "seconds",
                  secondBtnC: "#95c7f3",
                  dateBtnC: "",
                })
              }
            >
              Seconds
            </button>
          </div>

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
