import "./css/App.css";
import AllTask from "./Components/AllTask";
import CreateTask from "./Components/CreateTask";
import Nav from "./Components/Nav";
import ModifyComponent from "./Components/ModifyComponent";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Component } from "react";
import { ProtectedRoute } from "./user/protected.route";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Nav {...this.props} />
          <Switch>
            <ProtectedRoute
              path="/Dashboard/createtask"
              component={CreateTask}
            />
            <ProtectedRoute path="/Dashboard/alltask" component={AllTask} />
            <ProtectedRoute
              path="/Dashboard/modify_task"
              component={ModifyComponent}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
