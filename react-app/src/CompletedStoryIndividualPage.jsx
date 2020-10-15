import React, {} from 'react'
import axios from "axios"
import {IndexeddbPersistence} from "y-indexeddb";
import * as Y from "yjs";

export default class CompletedStoryIndividualPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            story: null
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
                    <button onClick={() => this.setVote(-1)}>-</button><button onClick={() => this.setVote(0)}>·</button><button onClick={() => this.setVote(1)}>+</button>
                    <p>Points: {this.getVotes(this.state.story.votes)}</p>
                    <p>Author: {this.state.story.contributors[0]}</p>
                    <p>Story Type: {this.state.story.storyType}</p>
                    <p>{this.state.story.listofwords.join(' ')}</p>
                    <em>Finished at {d.toLocaleDateString()} {d.toLocaleTimeString()} and took {dur.getHours()} hours and {dur.getMinutes()} minutes to finish</em>
                </div>
            )
        }
        return null;
    }

    setVote(vote) {
        //where vote is -1, 0, or 1
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