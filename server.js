const path = require("path");
const express = require("express");
const app = express(); // create express app
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://user:aNy7D3J1XbTT2@cluster0.ajcp4.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
let stories = null;
client.connect(err => {
  stories = client.db("data").collection("teststories");
});
// add middlewares
app.use(express.static(path.join(__dirname, "react-app", "build")));
app.use(express.static("public"));

/*
TODO:
-add backend based on stuff needed from frontends' TODO lists!
*/

/*
a story object has the following properties:
-id (based on db, makes easy to update)
-story name title. IDEA: we can have this be added after the story. and have a generated one at beginning (story x)
-list of words listofwords
-maximum number of words maxwords

MORE TO COME :))))))
*/
app.post('/addstory', bodyParser.json(), (req, res) => {
  stories.countDocuments({}, (err, result)=> {
    stories.insertOne({title: `Story ${result}`, listofwords:[req.body.storyfirstword], maxwords: req.body.storylength, finishedStory: false}).then(r=> {
      res.send(r.ops[0]);
    });
  });
})
//grabs the current story
app.get('/getcurstory', (req, res) => {
  stories.findOne({finishedStory: false}, (err, result)=> {
    if(result==null) res.send({status:"nostory"});
    else res.send(result);
  })
})
//adds word to story
app.post('/addword', bodyParser.json(), (req, res)=> {
  stories.updateOne({_id:mongodb.ObjectID(req.body.id)}, {$push: {listofwords: req.body.word}})
  .then(()=>{
    stories.findOne({_id:mongodb.ObjectID(req.body.id)}, (err, result)=>{
      const isFilled = result.listofwords.length >= result.maxwords;
      if(isFilled) {
        stories.updateOne({_id:mongodb.ObjectID(req.body.id)}, {$set: {finishedStory: true}})
        .then(()=>res.send({newword: req.body.word, isFilled}));
      } else {
        res.send({newword: req.body.word, isFilled});
      }
      
    })
  })
})
//called when the user enters the finished stories page
app.get('/getfinishedstories', (req, res)=> {
  stories.find({"finishedStory": true}).toArray((err,results)=>{
    res.send(results);
  });
})

//testing purposes
app.get('/del', (req, res) => {
  stories.remove({})
})

//gets everything else
app.get('*', (req, res)=>{
  res.status(200).sendFile(path.join(__dirname, "react-app", "build", "index.html"))
})

// start express server on port 3000
app.listen(3000, () => {
  console.log("server started on port 3000");
});
