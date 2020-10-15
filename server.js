//this will be my server file!
const path = require("path"); 
const express = require("express");
const slash   = require('express-slash');
const app = express(); // create express app
const cookieSession = require('cookie-session');
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();


app.enable('strict routing');
app.use(slash());

const bodyParser = require('body-parser');

const passport = require('passport');
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    
    // To keep the example simple, the user's GitHub profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the GitHub account with a user record in your database,
    // and return that user instead.
    return done(null, profile);
  });
}
));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://user:aNy7D3J1XbTT2@cluster0.ajcp4.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let stories = null;
client.connect(err => {
  stories = client.db("data").collection("teststories");
  // stories.find({ }).toArray().then((res) => {console.log(res)})
});
let users = null;
client.connect(err => {
  users = client.db("data").collection("users");
  // users.find({ }).toArray().then((res) => {console.log(res)})
})


// add middlewares
// app.use(express.static(path.join(__dirname, "react-app", "build")));
// app.use(express.static("public"));


app.use(bodyParser.json())
function setSessionUser(req, username, password){
  req.session['User'] = username;
  req.session['Pass'] = password;
}

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
});

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    let username = req.user.username;
    let pass = req.user.id;
    let checkQuery = {'username': username, 'password': pass}
    users.find(checkQuery).toArray(function(err, result){
      if (err){
        throw err;
      } 
      if (result.length === 1){
        console.log('found and logging in ')
        console.log(username)
        console.log(pass)
        setSessionUser(req, username, pass);
        res.redirect('/');
      } else { //username password combo not found
        console.log('make a new user')
        users.insertOne({'username': username, 'password': pass}).then(setSessionUser(req, username, pass))
        res.redirect('/');
      }
    })
});

app.post('/addstory', bodyParser.json(), (req, res) => {
  stories.countDocuments({}, (err, result)=> {
    stories.insertOne({title: `Story ${result}`, listofwords:[req.body.storyfirstword], maxwords: req.body.storylength, finishedStory: false, votes: [], contributors: [req.body.author], timeStart: Date.now(), timeEnd: null, storyType: req.body.storyType, skip: req.body.skip}).then(r=> {
      res.send(r.ops[0]);
    });
  });
})

app.get('/getcurstory', (req, res) => {
  stories.findOne({finishedStory: false}, (err, result)=> {
    if(result==null) console.log("NO CUR STORY");
    else console.log("WE FOUND ON BOISSSS");
  })
})

app.get('/getallcompleted', (req, res) => {
  stories.find({finishedStory: true}).toArray(function(err, result){
    res.json({stories: result});
  });
})

app.post('/getbyID', bodyParser.json(), (req, res) => {
  stories.find({_id: mongo.ObjectId(req.body._id), finishedStory: true}).toArray(function(err, result){
    res.json({story: result[0]});
  });
})

app.post('/changeVote', bodyParser.json(), (req, response) => {
  stories.updateOne({_id: mongo.ObjectId(req.body._id)}, {$set: {votes: req.body.votes}}, { upsert: false }, (err, res) => response.send(res));
})

app.get('/', (request, response) =>{
  console.log('/')
  let username = request.session['User'];
  console.log(`username: ${username}`)
  if (username == null){
    console.log('redirect to login')
    response.redirect('/login');
  } else {
    console.log('show home')
    response.sendFile(__dirname + "/react-app/build/index.html");
  }
})


app.post('/login', (request, response) => {
  let username = request.body.username;
  let pass = request.body.password;
  let checkQuery = {'username': username, 'password': pass}
  users.find(checkQuery).toArray(function(err, result){
    if (err){
      throw err;
    } 
    if (result.length === 1){
      console.log('found and logging in ')
      console.log(username)
      console.log(pass)
      setSessionUser(request, username, pass);
      response.redirect('/');
    } else { //username password combo not found
      let userExistsQuery = {'username': username};
      users.find(userExistsQuery).toArray(function(err, result){
        if (err){
          throw err;
        }
        if (result.length === 1){ //found a username
          response.json({error: 'password'})
        } else {//couldnt find username
          response.json({error: 'username'})
        }
      })
    }
  })
});

app.post('/register', (request, response) => {
  let username = request.body.username;
  let pass = request.body.password;
  let checkQuery = {'username': username}
  users.find(checkQuery).toArray(function(err, result){
    if (err){
      throw err;
    }
    if (result.length === 1){
      response.json({code: 'found'})
    } else {
      users.insertOne({'username': username, 'password': pass})
      .then(setSessionUser(request, username, pass))
      .then(() => response.json({code: 'made'}));
    }
  })
})

app.post('/logOut', (request, response) => {
  setSessionUser(request, null, null)
  response.sendStatus(200)
})



app.get("/login", (request, response) => {
  response.sendFile(__dirname + "/react-app/build/index.html");
});
app.get('/currentUser', (request, response) => {
  response.json({user: request.session['User']})
});
app.get("/register", (request, response) => {
  response.sendFile(__dirname + "/react-app/build/index.html");
});
app.get("/completedStories", (request, response) => {
  response.sendFile(__dirname + "/react-app/build/index.html");
});
app.get("/CreateStory", (request, response) => {
  response.sendFile(__dirname + "/react-app/build/index.html");
});

app.get("/completeStory", (request, response) => {
  // response.json({request.body.id})
  response.sendFile(__dirname + "/react-app/build/index.html");
});


// gets everything else
// app.get('*', (req, res)=>{
//   res.status(200).sendFile(path.join(__dirname, "react-app", "build", "index.html"))
// })

app.use(express.static("react-app/build"));

// start express server on port 3000
app.listen(3000, () => {
  console.log("server started on port 3000");
});