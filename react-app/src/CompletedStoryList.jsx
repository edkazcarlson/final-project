import React, { Component } from 'react';
import axios from 'axios';

export default class CompletedStoryList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listOfStories: [],
        }
    }
    componentDidMount(){
        axios.get('/getfinishedstories')
        .then(res=>{
            this.setState({
                listOfStories: res.data
            })
        })
    }
    onClick(id){
        
    }
    render() {
        return (
        <div>
            {this.state.listOfStories.map((story)=>(
                <div>
                    <h2>{story.title}</h2>
                    <p>{story.listofwords.join(' ')}</p>
                    <a href="">VOTE!!!!!!</a>
                    <p>other info........</p>
                </div>
            ))}
        </div>
        )
    }
}
/*{demoStories.map((story) =>{
                return (<div>
                    <b>{story.vote}: </b><a href = '/completeStory'>{story.title}</a>
                </div>)
            })}*/