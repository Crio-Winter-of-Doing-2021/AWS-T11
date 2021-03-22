import React, { Component } from "react";

class CreateTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskurl: "",
      delay: "",
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    var data = [];
    fetch("http://localhost:3000/create_task", {
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        data = res;
      })
      .catch((err) => console.log(err));

      this.setState({ taskurl:"" , delay:"" });
    console.log("This data is received : " + data["message"]);
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createNewTask = async () => {};

  render() {
    const { taskurl, delay } = this.state;
    return (
      <div className="CreateTask">
        <form
          action=""
          id="createTaskForm"
          className="forms"
          onSubmit={this.handleSubmit}
        >
            <label >
              Task URL:
              <input
                type="text"
                className="u-full-width"
                name="taskurl"
                value={taskurl}
                onChange={this.handleChange}
              />
            </label>

          
          <label>
            Delay:
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
            <button className="button-primary" id="createTaskButton">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateTask;
