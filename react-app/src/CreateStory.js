import React from 'react';
import axios from "axios"
import * as Y from 'yjs'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

const ydoc = new Y.Doc()

const theme = createMuiTheme({
    spacing: 8,
    palette: {
      type: 'dark',
      primary: {
        main: "#7e57c2", //purple
      },
      secondary: {
        main: '#76ff03', //green
      },
    },
  });


export default class CreateStory extends React.Component {

 createStory(e) {
    e.preventDefault();
    const inputs = document.querySelectorAll('.storyInput');
    if(valid()) { //validates data and sends alert if data is invalid
        fetch("/currentUser").then(function(response) {return response.json()
        }).then( function( json ) {
            axios.post('/addstory', {
                author: json.user,
                storylength: inputs[0].value,
                storyfirstword: inputs[1].value.trim(),
                skip: inputs[2].value,
                storyType: document.querySelector('input[name="storyType"]:checked').value
            })
            .then(response => {
                // this allows you to instantly get the (cached) documents data
                const indexeddbProvider = new IndexeddbPersistence(response.data._id, ydoc)
                indexeddbProvider.whenSynced.then(() => {
                    console.log('loaded data from indexed db: ' + response)
                })
                const yarray = ydoc.getArray(response.data._id);
                yarray.insert(0, [response.data.listofwords[0]]);
                alert("Story created successfully!");
            })
         })
    }
 }
  render() {
    return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <h1 className="subtitle">Create Story</h1><br/>
        <form>
            
            <TextField style={{margin: theme.spacing(1)}} id="storylength" label="Story length" type="number" placeholder="Story length" variant="filled" className="storyInput" margin="normal" InputLabelProps={{shrink: true,}}/>
            <TextField style={{margin: theme.spacing(1)}} id="storyfirstword" label="First word of story" type="number" placeholder="First word of story" variant="filled" className="storyInput" margin="normal" InputLabelProps={{shrink: true,}}/><br/>
            <TextField style={{margin: theme.spacing(1)}} id="skip" label="Repeat frequency" type="number" placeholder="Repeat frequency" helperText="How many turns users must wait before recontributing." variant="filled" className="storyInput" margin="normal" InputLabelProps={{shrink: true,}}/><br/>
            <FormControl component="inputlength" margin="normal">
                <FormLabel component="legend">Choose how users can contribute</FormLabel>
                <RadioGroup name="storyType">
                    <FormControlLabel style={{color: "rgba(255, 255, 255, 87)"}} value="word" control={<Radio />} label="One word at a time" />
                    <FormControlLabel style={{color: "rgba(255, 255, 255, 87)"}} value="phrase" control={<Radio />} label="Short phrases" />
                 </RadioGroup>
            </FormControl><br/>
            <Button style = {{fontSize: '16px'}} variant="contained" onClick = {this.createStory}>Create Story</Button><br/>
        </form><br/>
        <a href="/">Return to homepage</a>
      </div>
      </ThemeProvider>
    );
  }
}

function valid() {
    const inputs = document.querySelectorAll('.storyInput');
    const storyType = document.querySelector('input[name="storyType"]:checked').value;
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
