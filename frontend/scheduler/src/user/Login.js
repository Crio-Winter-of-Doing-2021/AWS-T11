import React, { Component, useState } from "react";
import { Route, Redirect, Link } from "react-router-dom";
import auth from "./auth";
import "../css/login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      redirectToDash: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    try {
      const local_token = JSON.parse(localStorage.getItem("login"));
      console.log(local_token["token"]);

      var myHeader = new Headers();
      myHeader.append("Authorization", "Bearer " + local_token["token"]);
      myHeader.append("Content-Type", "application/json");

      fetch("http://localhost:3000/user/login", {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        body: JSON.stringify(this.state),
        headers: myHeader,
      })
        .then(function (response) {
          if (!response.ok) {
            if (response.status === 404) {
              alert("Invalid Email !");
              window.location.reload();
            }
            throw new Error("HTTP status " + response.status);
          }
          return response.json();
        })
        .then((res) => {
          this.setState({ redirectToDash: true });
          auth.login(() => {
            this.props.history.push("/Dashboard");
          });
          console.log(res);
        })
        .catch((err) => console.log(err, " - fetch error!"));
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    var renderComponent;
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
              type="text"
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

    return <div>{renderComponent}</div>;
  }
}

/*
<div className={"formBg"}>
          <div className="form-container">
              <h1>Login</h1>
        <form  onSubmit={this.handleSubmit}>
          <label>Email:</label> 
          <input
            type="text"
            name="email"
            className="loginForm"
            value={this.state.email}
            onChange={this.handleChange}
          />
          
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          
          <div>
            <button
            // onClick={() => {
            //   auth.login(() => {
            //     this.props.history.push("/Dashboard");
            //   });
            // }}
            >
              Login
            </button>
          </div>
        </form>
        </div>
      </div>
*/

export default Login;
