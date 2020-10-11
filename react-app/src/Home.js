import React from 'react';

/* two ways we can format website (imo):
1) have everything sorta be on one page
2) have home page be a hub for other pages
I will do a hybrid of 1 and 2. basically, only let story be created if story is not going on rn.
otherwise, the story can just be edited on the homepage.
IF we want users to only edit when they are logged in, we should have story be editable on a different page
in my opinion and just have homepage be more of a login page.
*/
export default class Home extends React.Component {
  render() {
    return (
      <div className="App">
        <h1>One Word Story</h1>
        <br/>
        <h2>Current Story</h2>
        <br/>
        <p>There does not appear to be a story right now! Click below to start one :)</p>
        <a href="/createstory">Create story</a>
        
      </div>
    );
  }
}
