import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import auth from "./auth";
import "../css/login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      userId: 0,
      redirectToDash: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

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
      // console.log(
      //   "Can not login without creditinals!"
      // );
      this.setState({ redirectToDash: false });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    try {
      fetch("http://localhost:3000/user/login", {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        body: JSON.stringify(this.state),
        headers: { "Content-Type": "application/json" },
      })
        .then(function (response) {
          if (!response.ok) {
            if (response.status === 404) {
              alert("Invalid Email or Password!");
              window.location.reload();
            }
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
              Admin: false,
            })
          );
          // console.log("Login data ! ");
          auth.login(res["userName"], res["userId"]);
          this.setState({
            redirectToDash: true,
            userId: res["userId"],
            name: res["userName"],
          });
        })
        .catch((err) => console.log(err, " - fetch error!"));
    } catch (err) {
      console.log(err);
    }
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
            onSubmit={this.handleSubmit}
          >
            <h1>Login</h1>
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
              LOGIN
            </button>
            <dir>
              <Link
                style={{
                  color: "rgb(71, 92, 99)",
                  textDecoration: "none",
                }}
                to="/signup"
              >
                Signup
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
            },
          }}
        />
      );
    return <div>{renderComponent}</div>;
  }
}

export default Login;
