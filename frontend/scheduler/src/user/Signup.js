import React, { Component } from "react";
import { Route, Redirect, Link } from "react-router-dom";
import auth from "./auth";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      redirectToDash: false,
    };
  }

  HandleSignup = (e) => {
    e.preventDefault();
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
          })
        );
        console.log(res);
        auth.login( () => {
          this.props.history.push("/Dashboard");
        } )
        // this.setState({ redirectToDash: true });
      })
      .catch((err) => console.log(err));
    this.setState({ name: "", email: "", password: "" });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    var renderComponent;
    if (this.state.redirectToDash == false)
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
                type="text"
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
            pathname: "/",
            state: {
              from: this.props.location,
            },
          }}
        />
      );

    return <div>{renderComponent}</div>;
  }
}

export default Signup;
