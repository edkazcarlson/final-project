//this will be my server file!
const path = require("path");
const express = require("express");
const app = express(); // create express app
const bodyParser = require('body-parser');

// add middlewares
app.use(express.static(path.join(__dirname, "react-app", "build")));
app.use(express.static("public"));

app.post('/addstory', bodyParser.json(), (req, res) => {
  console.log(req.body);
})

//gets everything else
app.get('*', (req, res)=>{
  res.status(200).sendFile(path.join(__dirname, "react-app", "build", "index.html"))
})

// start express server on port 3000
app.listen(3000, () => {
  console.log("server started on port 3000");
});
