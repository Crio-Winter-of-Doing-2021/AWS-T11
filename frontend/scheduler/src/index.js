import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './user/Login';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ProtectedRoute } from "./user/protected.route";
import Signup from './user/Signup';

function Index() {
  return (
    <div className="">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/signup" component={Signup}/>
        <ProtectedRoute exact path="/Dashboard" component={App} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Index />
  </BrowserRouter>,
  rootElement
);
