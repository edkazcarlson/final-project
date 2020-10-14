import React from 'react';
import axios from "axios"
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

const ydoc = new Y.Doc()

export default class CreateStory extends React.Component {
/*
TODO:
add client-side validation
*/
 createStory(e) {
    e.preventDefault();
    const inputs = document.querySelectorAll('.storyInput');
    if(valid()) { //validates data and sends alert if data is invalid
        axios.post('/addstory', {
            author: "Insert user ID",
            storylength: inputs[0].value,
            storyfirstword: inputs[1].value,
            skip: inputs[2].value,
            storyType: document.querySelector('input[name="storyType"]:checked').value
        })
            .then(response => {
                // this allows you to instantly get the (cached) documents data
                const indexeddbProvider = new IndexeddbPersistence(response.data._id, ydoc)
                indexeddbProvider.whenSynced.then(() => {
                    console.log('loaded data from indexed db: ' + response)
                })

                // Sync clients with the y-webrtc provider.
                const webrtcProvider = new WebrtcProvider(response.data._id, ydoc)

                // Sync clients with the y-websocket provider
                const websocketProvider = new WebsocketProvider(
                    'wss://demos.yjs.dev', response.data._id, ydoc
                )
                const yarray = ydoc.getArray(response.data._id);
                yarray.insert(0, [response.data.listofwords[0]]);
                alert("Story created successfully!");
            })
    }
 }
  render() {
    return (
      <div className="App">
        <h1>Create Story</h1><br/>
        <form>
            <label for="storylength">Story length </label><input id="storylength" type="number" name="storylength" className="storyInput"/><br/>
            <label for="storyfirstword">Story first word </label><input id="storyfirstword" name="storyfirstword" className="storyInput"/><br/>
            <label htmlFor="skip">Number of Contributions before Recontributing (should probably have a longer explanation for this bit) </label><input id="skip" type="number" name="skip" className="storyInput"/><br/>
            <input type="radio" id="word" name="storyType" value="word" checked/><label htmlFor="word">Word</label><br/>
            <input type="radio" id="phrase" name="storyType" value="phrase"/><label htmlFor="phrase">Phrase</label><br/>
            <input type="submit" value="Create Story" id="createStory" onClick={this.createStory}/><br/>
        </form><br/>
        <a href="/">Return to homepage</a>
      </div>
    );
  }
}

function valid() {
    const inputs = document.querySelectorAll('.storyInput');
    const storyType = document.querySelector('input[name="storyType"]:checked').value;
    console.log(0 <= parseInt(inputs[2].value))
    console.log(parseInt(inputs[2].value) < parseInt(inputs[0].value))
    if(!(0 < parseInt(inputs[0].value) && parseInt(inputs[0].value) < 100)) { //don't need to check type, only length, because input is type number
        alert("Please choose a story length between 0 and 100 words.");
    } else if (storyType === "word" && inputs[1].value.trim() !== inputs[1].value.replace(/ /g,'')) {
        alert("Please enter a word or switch the story type to phrase.")
    } else if (storyType === "phrase" && inputs[1].value.length > 200) {
        alert("Please enter a phrase less than 200 characters.")
    } else if (!(0 <= parseInt(inputs[2].value) && parseInt(inputs[2].value) < parseInt(inputs[0].value))) {
        alert("Please choose a skip value between 0 and the maximum story length.")
    } else {
        return true;
    }
    return false;
}
