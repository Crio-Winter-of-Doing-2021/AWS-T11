import "./css/App.css";
import "./css/login.css";
import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import App from "./App";
import Login from "./user/login";
import Signup from "./user/Signup";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: "",
    };
  }

  handleOnLogin = () => {
    console.log("called!");
    this.setState({ loggedIn: true });
  };

  render() {
    var renderObject;

    this.state.loggedIn
      ? (renderObject = <App />)
      : (renderObject = (
          <div>
            TEST
            <Login onLogin={this.handleOnLogin} />
          </div>
        ));

   return(
       <div>
           {renderObject}
       </div>
       
   )
  }
}

export default Home;
