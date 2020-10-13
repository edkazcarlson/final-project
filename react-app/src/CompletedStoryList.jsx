import React, { Component } from 'react';
import axios from 'axios';
/*
TODO:
-add more stuff to each story
-make voting work (will require users to be logged in)
-might want to have IndividualPage be passed in as component in MAP to keep things less messy!
Feature ideas:
-way to sort (i.e., newest default, other options like most voted, alphabetical by title, longest, etc)
-could make it span multiple pages instead of just one giant page
*/
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