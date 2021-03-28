import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import auth from "./auth";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      userName: "",
      userId: "",
      redirectToDash: false,
    };
  }

  componentDidMount() {
    try {
      let local_storage = JSON.parse(localStorage.getItem("login"));
      if (local_storage["login"]) {
        var _name = local_storage["userName"];
        var _id = local_storage["UserId"];
        auth.login(_name, _id);
        this.setState({ redirectToDash: true });
      } else console.log("failed to get access to localStorage data");
    } catch (err) {
      console.log("Can not signup without credintials");
      this.setState({ redirectToDash: false });
    }
  }

  HandleSignup = (e) => {
    e.preventDefault();
    try {
      fetch("http://localhost:3000/user/signup", {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        body: JSON.stringify(this.state),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          if (!response.ok) {
            if (response.status === 409) alert("Email already used!");
            if (response.status === 422) alert("Invalid Email !");
            window.location.reload();
            throw new Error("HTTP status " + response.status);
          }
          return response.json();
        })
        .then((res) => {
          localStorage.setItem(
            "login",
            JSON.stringify({
              login: true,
              token: res.token,
              userName: res.userName,
              userId: res.userId,
            })
          );
          auth.login(res["userName"], res["userId"]);
          this.setState({
            userName: this.state.name,
            userId: res["userId"],
            redirectToDash: true,
          });
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log("ERROR WHILE CREATING ACCOUNT! - ");
      console.log(err);
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    var renderComponent;
    if (!this.state.redirectToDash)
      renderComponent = (
        <div className="CreateTask">
          <form
            action=""
            id="createTaskForm"
            className="forms"
            onSubmit={this.HandleSignup}
          >
            <h1>Create An Account</h1>
            <label>
              Name
              <input
                type="text"
                className="u-full-width"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </label>
            <label>
              Email
              <input
                type="text"
                className="u-full-width"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </label>

            <label>
              Password
              <input
                className="u-full-width"
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </label>

            <button className="button-primary" id="createTaskButton">
              SIGN UP
            </button>
            <dir>
              <Link
                style={{
                  color: "rgb(71, 92, 99)",
                  textDecoration: "none",
                }}
                to="/"
              >
                Login
              </Link>
            </dir>
          </form>
        </div>
      );
    else
      renderComponent = (
        <Redirect
          to={{
            pathname: "/Dashboard",
            state: {
              from: this.props.location,
              userName: this.state.userName,
              userId: this.state.userId,
            },
          }}
        />
      );

    return <div>{renderComponent}</div>;
  }
}

export default Signup;
