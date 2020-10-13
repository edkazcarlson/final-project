import axios from 'axios';
import React from 'react';

import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

const ydoc = new Y.Doc()


// array of numbers which produce a sum
let yarray



/* two ways we can format website (imo):
1) have everything sorta be on one page
2) have home page be a hub for other pages
I will do a hybrid of 1 and 2. basically, only let story be created if story is not going on rn.
otherwise, the story can just be edited on the homepage.
IF we want users to only edit when they are logged in, we should have story be editable on a different page
in my opinion and just have homepage be more of a login page.
*/
const listOfWords = ydoc.getArray('listofwords')
export default class CurrentStory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfWords: [],
            maxWords: -1,
            title: '',
            id: -1
        }        
    }
    
    componentDidMount() {
        axios.get('/getcurstory')
        .then(res=> {
            console.log(res.data)
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
                console.log(yarray.toArray())
                this.setState({
                    listOfWords: res.data.listofwords,
                    maxWords: res.data.maxwords,
                    title: res.data.title,
                    id: res.data._id,
                });
            }
            
            yarray.observe(event => {
                // print updates when the data changes
                console.log('cur words: ', yarray.toArray().length)
                
                this.setState({
                    listOfWords: yarray.toArray()
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
        console.log(this.state.id)
        
        axios.post('/addword', {'id':this.state.id, 'word': nextword})
        .then(response=> {
            console.log('success');
            yarray.push([response.data.newword])
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
          </div>
      </div>
    );
  }
}
//need client-side verification that they enter a "valid word" (aka no spaces)
//can simply check if word is the same when removing all whitespace?