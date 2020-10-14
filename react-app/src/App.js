import React from 'react';
import './App.css';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home'
import CreateStory from './CreateStory'
import TopBar from './TopBar'
import CompletedStoryList from './CompletedStoryList'
import CompletedStoryIndividualPage from './CompletedStoryIndividualPage';
import InProgressStory from './InProgressStory';
import Login from './Login'

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {currentStoryID: -1, inProgressStoryID : -1}
  }
  setCurrentStory = (id) => {
    this.setState({currentStoryID: id})
  }
  setCurrentInProgressStory= (id) =>{
    this.setState({inProgressStoryID: id})
  }
  render() {
    return(
    <Router>
        <TopBar/>
        <Route exact path='/'>
          <Home setCurrentInProgressStory = {this.setCurrentInProgressStory}/>
        </Route>
        <Route exact path = "/login">
          <Login
          isLogin = {true}/>
        </Route>
        <Route path = "/register">
          <Login
          isLogin = {false}/>
        </Route>
        <Route path='/createstory'>
          <CreateStory/>
        </Route>
        <Route path='/inProgressStory'>
          <InProgressStory/>
        </Route>
        <Route path='/completedStories'>
          <CompletedStoryList
          setCurrentStory = {this.setCurrentStory}
          id = {this.state.currentStoryID}/>
        </Route>
        <Route path='/completeStory'>
          <CompletedStoryIndividualPage
          id = {this.state.currentStoryID}/>
        </Route>

    </Router>
    );
  }
}
