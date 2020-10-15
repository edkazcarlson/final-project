import axios from 'axios';
import React from 'react';
import Button from '@material-ui/core/Button';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: "#7e57c2", //purple
    },
    secondary: {
      main: '#76ff03', //green
    },
  },
});

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
    <ThemeProvider theme={theme}>
    <div className="TopBar" style = {{marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
      <div >
        {links.map(function(link){
          return (<Button  
            onClick = {() => {jumpToPage(link.url)}}
            variant="contained">{link.name}</Button>)
        })}
      </div>
      <Button variant="contained" onClick = {logOut}>LogOut</Button>
    </div>
    </ThemeProvider>
  );
}
