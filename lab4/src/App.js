import logo from './logo.svg';
import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
function App() {
  return (
    <Router>
        <Switch>
          <Route exact path="/">
            <RootContainer/>
          </Route>
          <Route path="/characters/page/:page">
            <RootContainer/>
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
