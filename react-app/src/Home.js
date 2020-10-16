import axios from 'axios';
import React from 'react';
import './App.css';

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
        axios.get('/getcurstory')
            .then(response => {
                if (response.data.status === 'nostory') {
                    console.log("NO STORY!");
                    //we gotta handle that condition here
                } else {
                    this.setState({
                        currentStory: {}
                    });
                }

            })
    }


    jumpToStory(id) {
        this.props.setCurrentInProgressStory(id);
        window.open('/inProgressStory', "_self");
    }

    test() {
        axios.get('/del')
    }

    render() {
        return (
            <div className="App" style={{display: 'flex', flexDirection: "column", justifyContent: 'space-around', alignItems: 'center'}}>
                <h1 className="title">One Word Story</h1>
                <br/>
                <a className="subtitle" href="/contribute">Contribute</a>
                <br/>
                <button onClick={this.test}>Reset db (for testing purposes)</button>
                {/* {this.getStories().length === 0 ?
         <CreateStory/>: this.getStories().map((story) =>{
          return(<div onClick = {() => {this.jumpToStory(story.id)}}>
            <b>{story.title}</b> written by {story.op}
          </div>
         )}) } */}
                <div className="lowPriority">
                    ICON MADE BY ICONKING FROM WWW.FREEICONS.IO
                </div>

            </div>
        );
    }
}
