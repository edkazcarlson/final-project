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
        const id = urlParams.get('id');
        axios.post('/getbyID', {_id: id}).then( function( response ) {
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
        console.log("Render", this.state.story)
        if(this.state.story != null) {
            return (
                <div style = {{marginLeft: '10px'}}>
                     <h2>{this.state.story.title}</h2>
                     <p>Likes: {this.getVotes(this.state.story.votes)}</p>
                     <p>{this.state.story.listofwords}</p>
                     <p>Author: {this.state.story.contributors[0]}</p>
                     <p>Story Type: {this.state.story.storyType}</p>
                </div>
            )
        }
        return null;
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