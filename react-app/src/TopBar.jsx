import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';

export default function TopBar(props){
  let links = [{name: 'Home Page', url: '/'}
  ,{name: 'Browse Completed Stories', url: '/completedStories'}
  ,{name: 'Make a Story', url: '/CreateStory'}
  ,{name: 'Contribute', url: '/contribute'}];
  const [isLoggedIn, changeLoginStatus] = React.useState(true)
  React.useEffect(() => {
    fetch('/currentUser').
    then(function(response){
      return response.json()
    }).
    then(function(json){
      console.log(json)
      changeLoginStatus(json.user !== null)
    })
  })

  function logOut(){
    fetch('/logOut', {
      method:'POST'
    }).then(() => {
      window.open('/', "_self");
    })
  }

    function logOut() {
        fetch('/logOut', {
            method: 'POST'
        }).then(() => {
            window.open('/', "_self");
        })
    }

    function jumpToPage(url) {
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
      {isLoggedIn? <Button style = {{fontSize: '16px'}} variant="contained" onClick = {logOut}>Log out</Button>:
      <Button style = {{fontSize: '16px'}} variant="contained" onClick = {() => {jumpToPage('/login')}}>Log in</Button>}
      
    </div>
  );
}
