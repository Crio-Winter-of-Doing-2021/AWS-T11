import "./css/App.css";
import AllTask from "./Components/AllTask";
import CreateTask from "./Components/CreateTask";
import Nav from "./Components/Nav";
import ModifyComponent from "./Components/ModifyComponent";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from "react-router-dom";
import React, { Component } from "react";
import { ProtectedRoute } from "./user/protected.route";
import auth from "./user/auth";
import UserData from './user/UserData';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login: false,
      userName: "",
      userId: "",
    };
  }

  componentDidMount() {
    console.log("In APP mount !"+this.props.location.state.userName);
    try {
      let local_storage = JSON.parse(localStorage.getItem("login"));
      if(local_storage["login"]){
        var _name =  local_storage["userName"];
        var _id = local_storage["UserId"];
        auth.login(_name,_id);
        this.setState({login:true , userName:_name , userId:_id});
      }
      else console.log("failed test");
    } catch (err) {
      console.log("No able to retrieve values from LocalStorage in App.js");
    }
  }

  render() {
    var renderComponent;
    renderComponent = (
      <Router>
        <div className="App">
          <Nav {...this.props} />
          {/* <div id="test">
            <h1>Welcome {this.state.userName}</h1>
          </div> */}
          <Switch>
          <Route
                exact
                path="/Dashboard"
                render={() => {
                    return (
                      <Redirect to="/Dashboard/home" {...this.props} /> 
                    )
                }}
              />
            <ProtectedRoute path="/Dashboard/home" {...this.props} component={UserData} />
          <ProtectedRoute
              path="/Dashboard/userdata"
              component={UserData}
            />
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

    return <div>{renderComponent}</div>;
  }
}

export default App;
