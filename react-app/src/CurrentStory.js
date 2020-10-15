import axios from 'axios';
import React from 'react';

import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

const ydoc = new Y.Doc()
let yarray

/*
TODO:
-add client side validation to check if they enter a "valid word" (same as for CreateStory.js)
-add feature to limit user to contributing. this is based on the setting when they create a story.
*/
const listOfWords = ydoc.getArray('listofwords')
export default class CurrentStory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfWords: [],
            maxWords: -1,
            title: '',
            id: -1,
            curWordCount: 0,
        }        
    }
    
    componentDidMount() {
        axios.get('/getcurstory')
        .then(res=> {
            if(res.data.status=="nostory") {
                window.open('/createstory', "_self");

            } else {

                // this allows you to instantly get the (cached) documents data
                const indexeddbProvider = new IndexeddbPersistence(res.data._id, ydoc)
                indexeddbProvider.whenSynced.then(() => {
                console.log('loaded data from indexed db')
                })

                // Sync clients with the y-webrtc provider.
                const webrtcProvider = new WebrtcProvider(res.data._id, ydoc)

                // Sync clients with the y-websocket provider
                const websocketProvider = new WebsocketProvider(
                'wss://demos.yjs.dev', res.data._id, ydoc
                )
                yarray = ydoc.getArray(res.data._id)
                this.setState({
                    listOfWords: res.data.listofwords,
                    maxWords: res.data.maxwords,
                    title: res.data.title,
                    id: res.data._id,
                    curWordCount: res.data.listofwords.length,
                });
            }
            //called when yarray is modified
            yarray.observe(event => {
                this.setState({
                    listOfWords: yarray.toArray(),
                    curWordCount: yarray.toArray().length,
                });
                if(this.state.maxWords==yarray.length) {
                    alert("Story is complete!");
                    //yarray.delete(0, yarray.length) NOT needed if my theory is correct :D
                    window.open('/', '_self');
                } else {
                    console.log(this.state.maxWords, yarray.length);
                }
            });   
        })
    }
    addWord(e) {
        const nextword = document.querySelector('#nextword').value;
        e.preventDefault();
        axios.post('/addword', {'id':this.state.id, 'word': nextword})
        .then(response=> {
            yarray.push([response.data.newword]);
            document.querySelector('#nextword').value='';
        })
    }
  render() {
    return (
      <div>
          <h3>{this.state.title}</h3>
          <div>
              {this.state.listOfWords.map(word=>(
                  <span>{word} </span>
              ))}
              <br/>
              <form>
                  <label for="nextword">Next Word:</label><input id="nextword" name="nextword"/>
                <input type="submit" onClick={this.addWord.bind(this)}/>
                
              </form>
              <br/>
              <h4>There are {this.state.maxWords - this.state.curWordCount} words left!</h4>
          </div>
      </div>
    );
  }
}
