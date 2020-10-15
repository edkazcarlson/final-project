import React, {} from 'react'
import axios from "axios"
import {IndexeddbPersistence} from "y-indexeddb";
import * as Y from "yjs";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

export default class CompletedStoryIndividualPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            story: null,
            chosenVote: null,
        };
    }

    componentDidMount() {
        let that = this;
        const urlParams = new URLSearchParams(window.location.search);
        const _id = urlParams.get('id');
        axios.post('/getbyID', {_id}).then(function (response) {
            const ydoc = new Y.Doc()
            const indexeddbProvider = new IndexeddbPersistence(response.data._id, ydoc)
            indexeddbProvider.whenSynced.then(() => {
                console.log(response.data.story)
                that.setState({
                    story: response.data.story
                });
                fetch("/currentUser").then(function(response) {return response.json()
                }).then((json) => {return json.user})
                .then((id) => {response.data.story.votes.forEach((ele) => {
                    if (ele.id === id){
                        that.setState({chosenVote: ele.value});
                    }
                })})

                console.log(that.state)
            })
        })
    }

    render() {
        if (this.state.story != null) {
            const d = new Date(this.state.story.timeEnd * 1000)
            const dur = new Date((this.state.story.timeEnd - this.state.story.timeStart) * 1000)
            return (
                <div style={{marginLeft: '10px'}}>
                    <h2>{this.state.story.title}</h2>
                    <ThumbUpIcon style = {{color: this.state.chosenVote == 1 ? 'red': 'black'}} onClick={() => this.setVote(1)}/>
                    <ThumbDownIcon style = {{color: this.state.chosenVote == -1 ? 'red': 'black'}} onClick={() => this.setVote(-1)}/>
                    <p>Points: {this.getVotes(this.state.story.votes)}</p>
                    <p>{this.processStory(this.state.story.listofwords)}</p>

                    <p>Author: {this.state.story.contributors[0]}</p>
                    <p>Story Type: {this.state.story.storyType}</p>
                    <p>{this.state.story.listofwords.join(' ')}</p>
                    <em>Finished at {d.toLocaleDateString()} {d.toLocaleTimeString()} and took {dur.getHours()} hours and {dur.getMinutes()} minutes to finish</em>
                </div>
            )
        }
        return null;
    }

    processStory(story){
        let toReturn = story[0];
        console.log(this.state.story)
        console.log(story)
        story.forEach((ele, indx) => {
            if (indx > 0){
                toReturn += ' ' + ele
            }
        })
        toReturn += '.'
        return toReturn
    }

    setVote(vote) {
        //where vote is -1, 0, or 1
        this.setState({chosenVote: vote})
        console.log("Voting!")
        let that = this;
        let newVotes = that.state.story.votes;
        fetch("/currentUser").then(function(response) {return response.json()
        }).then( function( json ) {
            if(!newVotes.map(a => a.id).includes(json.user)) {
                that.state.story.votes.push({id: json.user, value: vote});
            } else {
                that.state.story.votes[that.state.story.votes.indexOf(that.state.story.votes.find(obj => obj.id === json.user))] = {id: json.user, value: vote};
            }
            console.log(that.state.story.votes);
            axios.post('/changeVote', {
                _id: that.state.story._id,
                votes: that.state.story.votes
            }).then(response => { that.forceUpdate();
            console.log("reached here");})
         })
    }

    //assumes that vote objects in the votes array have a value field alongside an id field
    getVotes(votes) {
        let voteCount = 0;
        for (const vote in votes) {
            voteCount += votes[vote].value;
        }
        return voteCount;
    }
}