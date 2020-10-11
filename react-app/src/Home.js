import axios from 'axios';
import React from 'react';
import CurrentStory from './CurrentStory';

/* two ways we can format website (imo):
1) have everything sorta be on one page
2) have home page be a hub for other pages
I will do a hybrid of 1 and 2. basically, only let story be created if story is not going on rn.
otherwise, the story can just be edited on the homepage.
IF we want users to only edit when they are logged in, we should have story be editable on a different page
in my opinion and just have homepage be more of a login page.
*/
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStory: {},
            currentStoryStatus: {},
        };
    }
    componentDidMount() {
        axios.get('/getcurstory' )
        .then(response => {
            if(response.data.status==='nostory') {
                console.log("NO STORY!");
                //we gotta handle that condition here
                this.setState({
                    currentStoryStatus:{"status":0}
                });
            } else {
                this.setState({
                    currentStory:response.data
                });
                this.setState({
                    currentStoryStatus:{"status":1}
                
                });
            }
            
        })
    }
    test() {
        axios.get('/del')
    }
    endStory() {
        this.setState({
            currentStoryStatus:{"status":0},
            currentStory:null
        });
    }
  render() {
    return (
      <div className="App">
        <h1>One Word Story</h1>
        <br/>
        <h2>Current Story</h2>
        <br/>
        {this.state.currentStoryStatus.status==1?<CurrentStory story={this.state.currentStory} endStory={this.endStory.bind(this)}></CurrentStory>:<p>There does not appear to be a story right now! Click below to start one :)<a href="/createstory">Create story</a></p>}
        
        <button onClick={this.test}>Reset db (for testing purposes)</button>
      </div>
    );
  }
}
