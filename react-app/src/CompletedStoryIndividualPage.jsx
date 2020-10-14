import React, { Component } from 'react'

export default function CompletedStoryIndividualPage(props){
    let demoTitle = 'title'
    let demoStory = 'lorem ipsum i aint copying the whole thing'
    console.log(props.id)
    return (
        <div style = {{marginLeft: '10px'}}>
            <h2>{demoTitle}</h2>
            <p>{demoStory}</p>
            {props.id}
        </div>
    )
}
