import axios from 'axios';
import React from 'react';
import Button from '@material-ui/core/Button';


export default function TopBar(props){
  let links = [{name: 'Home Page', url: '/'},{name: 'Browse Completed Stories', url: '/completedStories'},{name: 'Make a Story', url: '/CreateStory'}];
  
  function logOut(){
    fetch('/logOut', {
      method:'POST'
    }).then(() => {
      window.open('/', "_self");
    })
  }

  function jumpToPage(url){
    window.open(url, "_self");
  }


  return (
    <div className="TopBar" style = {{marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
      <div >
        {links.map(function(link){
          return (<Button 
            style = {{fontSize: '16px'}} 
            onClick = {() => {jumpToPage(link.url)}}
            variant="contained">{link.name}</Button>)
        })}
      </div>
      <Button style = {{fontSize: '16px'}} variant="contained" onClick = {logOut}>LogOut</Button>
    </div>
  );
}
