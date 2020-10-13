import React, { Component } from 'react'

export default function CompletedStoryList(props) {
    let demoStories = [{vote: 1, title: 'demoTitle1', id: 1}, {vote: 2, title: 'demoTitle2', id: 2}];

    function onClick(id){
        props.setCurrentStory(id);
        window.open('/completeStory', "_self");
    }
    return (
        <div>
            {demoStories.map((story) =>{
                return (<div>
                    <b>{story.vote}: </b><a href = '/completeStory'>{story.title}</a>
                </div>)
            })}
        </div>
    )
}
