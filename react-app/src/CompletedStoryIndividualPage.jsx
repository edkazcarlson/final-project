import React, { Component } from 'react'
//decide whether to use this for each completed story or to just have everything in one jsx file.
export default function CompletedStoryIndividualPage(){
    let demoTitle = 'title'
    let demoStory = 'lorem ipsum i aint copying the whole thing'

    return (
        <div style = {{marginLeft: '10px'}}>
            <h2>{demoTitle}</h2>
            <p>{demoStory}</p>
        </div>
    )
}
