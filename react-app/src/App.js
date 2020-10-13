import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home'
import CreateStory from './CreateStory'
import CompletedStoryList from './CompletedStoryList'
import CurrentStory from './CurrentStory'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {currentStoryID: -1, inProgressStoryID : -1}
  }
  setCurrentStory(id){
    this.setState({currentStoryID: id})
  }
  setCurrentInProgressStory(id){
    this.setState({inProgressStoryID: id})
  }
  render() {
    return(
    <Router>
        <Route exact path='/'>
          <Home setCurrentInProgressStory = {this.setCurrentInProgressStory}/>
        </Route>
        <Route path='/createstory'>
          <CreateStory/>
        </Route>
        <Route path='/contribute'>
          <CurrentStory/>
        </Route>
        <Route path='/completedworks'>
          <CompletedStoryList/>
        </Route>

    </Router>
    );
  }
}
//pages (routes) we need, going off of Char's model:
/*
-home page
-create story page /createstory
-contribute page /contribute
--page that says you cannot contribute at the moment (still same link, diff component)
-view past stories /completedworks
--we can have a component for each individual story!

-idk how login/signup will work????

*/
