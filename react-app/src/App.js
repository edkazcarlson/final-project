import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home'
import CreateStory from './CreateStory'

export default class App extends React.Component {

  render() {
    return(
    <Router>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/createstory' component={CreateStory}/>
      </Switch>
    </Router>
    );
  }
}
