import axios from 'axios';
import React from 'react';

/* two ways we can format website (imo):
1) have everything sorta be on one page
2) have home page be a hub for other pages
I will do a hybrid of 1 and 2. basically, only let story be created if story is not going on rn.
otherwise, the story can just be edited on the homepage.
IF we want users to only edit when they are logged in, we should have story be editable on a different page
in my opinion and just have homepage be more of a login page.
*/
export default class CurrentStory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listOfWords: this.props.story.listofwords,
        };
    }
    /*
    componentDidMount() {
        axios.get('/getcurstory' )
        .then(response => {
            if(response.data.status==='nostory') {
                console.log("NO STORY!");
                //we gotta handle that condition here
                this.setState({
                    currentStory:{"status":0}
                });
            } else {
                this.setState({
                    currentStory:{"status":1}
                });
            }
            
        })
    }*/
    addWord(e) {
        e.preventDefault();
        axios.post('/addword', {'id':this.props.story._id, 'word': document.querySelector('#nextword').value})
        .then(response=> {
            console.log('success');
            
            this.setState({
                listOfWords: [...this.state.listOfWords, response.data.newword]
            });
            if(response.data.isFilled) {
                alert("Story is complete!");
                this.props.endStory();
            }
        })
    }
  render() {
    return (
      <div>
          <h3>{this.props.story.title}</h3>
          {console.log(this.props)}
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