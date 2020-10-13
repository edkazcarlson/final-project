import axios from 'axios';
import React from 'react';

export default function TopBar(props){
  let links = [{name: 'Home Page', url: '/'},{name: 'Browse Completed Stories', url: '/completedStories'}];
  
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

  function getUser(){
    fetch('/currentUser').then((res) => {
      return res.json()
    }).then((json) => {
      console.log(json)
    })
  }
  getUser()
  return (
    <div className="TopBar" style = {{marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
      <div>
        {links.map(function(link){
          return (<button style = {{fontSize: '24px'}} onClick = {() => {jumpToPage(link.url)}}>{link.name}</button>)
        })}
      </div>

      <button style = {{fontSize: '24px', textAlign: 'right'}} onClick = {logOut}>LogOut</button>
    </div>
  );
}
