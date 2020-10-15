import React, {} from 'react'

export default class CompletedStoryList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            demoStories : []
        };
    }

    componentDidMount() {
        let that = this;
        fetch("/getallcompleted").then(function(response) {
            return response.json()
        })
        .then( function( json ) {
            that.setState({
                demoStories : json.stories
            });
        })
    }

    render() {
        return(<div>
               {this.state.demoStories.map((story) =>{
                   return (<div>
                       <b>{this.getVotes(story.votes)}: </b><button onClick={() => this.click(story._id)}>{story.title}</button>
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

    click(id) {
        this.props.setCurrentStory(id);
        setTimeout(() => window.open('/completeStory?id='+id, "_self"), 10);
    }
}
