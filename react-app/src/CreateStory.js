import React from 'react';
import axios from "axios"
export default class CreateStory extends React.Component {
  /*
    can add more inputs in future, for now just threw in a couple for testing purposes!

    I am using axios because it is so much nicer than fetch
  */
 createStory(e) {
    e.preventDefault();
    const inputs = document.querySelectorAll('.storyInput');
    axios.post('/addstory', {storyname: inputs[0].value, storylength: inputs[1].value, storyfirstword: inputs[2].value})
    .then(response=> {
        console.log("This is the response: ", response.data);
    })
 }
  render() {
    return (
      <div className="App">
        <h1>Create Story</h1>
        <br/>
        <form>
            <label for="storyname">Story name</label><input id="storyname" name="storyname" className="storyInput"></input>
            <label for="storylength">Story length</label><input id="storylength" name="storylength" className="storyInput"></input>
            <label for="storyfirstword">Story first word</label><input id="storyfirstword" name="storyfirstword" className="storyInput"></input>
            <input type="submit" value="Create Story" id="createStory" onClick={this.createStory}/>
            
        </form>
      </div>
    );
  }
}
