import axios from 'axios';
import React from 'react';

export default class Home extends React.Component {
    test() {
        axios.get('/del')
    }
  render() {
    return (
      <div className="App">
        <h1>One Word Story</h1>
        <br/>
        <a href="/contribute">Contribute</a>
        <a href="/completedworks">Completed stories</a>
        <a href="/logout">Logout (doesnt do anything rn lol)</a>
        <br/>
        <button onClick={this.test}>Reset db (for testing purposes)</button>
      </div>
    );
  }
}