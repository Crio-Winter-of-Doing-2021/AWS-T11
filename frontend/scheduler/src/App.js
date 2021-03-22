import './css/App.css'
import AllTask from './Components/AllTask';
import CreateTask from './Components/CreateTask';
import Nav from './Components/Nav';
import Home from './Components/Home';
import Task from './Components/Task';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom'
import React from 'react';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav/>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/createtask" component={CreateTask} />
          <Route path="/alltask" component={AllTask} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
