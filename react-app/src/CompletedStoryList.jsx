import React, { Component } from 'react'

// export default function CompletedStoryList(props) {
export default class CompletedStoryList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            demoStories : [{votes: 1, title: 'demoTitle1', id: 1}, {votes: 2, title: 'demoTitle2', id: 2}]
        };
    }

    componentDidMount() {
        let that = this;
        fetch("/getallcompleted").then(function(response) {
            return response.json()
        })
        .then( ( json ) => {
            console.log(this);
            console.log(json.stories);
            that.setState({
                demoStories : json.stories
            });
        })
    }

    onClick(id){
        this.props.setCurrentStory(id);
        window.open('/#/completeStory', "_self");
    }

    render() {
        return(<div>
            {this.props.id}
               {this.state.demoStories.map((story) =>{
                   return (<div>
                       <p href = '/completeStory' onClick = {() => {this.onClick(story.id)}}><b>{this.getVotes(story.votes)}: </b>
                       {story.title}</p>
                   </div>)
               })}
            </div>)
    }

    //assumes that vote objects in the votes array have a value field
    getVotes(votes) {
        let voteCount = 0;
        for(const vote in votes) {
            voteCount += votes[vote].value;
        }
        return voteCount;
    }
}
