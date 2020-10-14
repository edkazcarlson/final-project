import axios from 'axios';
import React from 'react';
import CreateStory from './CreateStory'

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
            } else {
                this.setState({
                    currentStory:{}
                });
            }
            
        })
    }
    getStories(){
      //axios something
      return [{title: 'sampleTitle1', id: 1, op: 'author1'}, {title: 'sampleTitle2', id: 2, op: 'author2'}]
    }

    jumpToStory(id){
      this.props.setCurrentInProgressStory(id);
      window.open('/inProgressStory', "_self");
    }
  render() {
    return (
      <div className="App">
        
        <h1>One Word Story</h1>
        <br/>
        <h2>Current Story</h2>
        <br/>
        {this.getStories().length === 0 ?
         <CreateStory/>: this.getStories().map((story) =>{
          return(<div onClick = {() => {this.jumpToStory(story.id)}}>
            <b>{story.title}</b> written by {story.op}
          </div>
         )}) }

        
      </div>
    );
  }
}
