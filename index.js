const crypto = require("crypto");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const INPUTPORT = 3000;
const DBPORT = 26004;
var dank = require("./dank");

mongoose.connect(`mongodb://localhost:${DBPORT}`, {useNewUrlParser:true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var userSchema = new mongoose.Schema({
  userName: String,
  password: String,
  data: String
});

app.listen(INPUTPORT, dank.connectionRec);

const ENTRYERR = (err, u) => {
  if (err){
    console.log("\n\n\n\nError inputting data into mongoDB\n\n\n\n");
  }else{
    console.log("\n\nServerside success\n\n");
  }
};

var user = mongoose.model('user', userSchema);

const POSTHANDLER = (req, res) => {
  var thisUser = new user({userName: req.params.userName, password: req.params.password, data: req.params.data});
  thisUser.save(ENTRYERR);
  console.log(`Successfully entered:\n${req.params.userName}\n${req.params.password}\n${req.params.data}\n\n\n`);
  res.send("success");
  collection = db.collections;
  console.log(collection);
  var us = getUsers();
  us.then(function(result) {
     console.log(result) // "Some User token"
  })
};

app.get("/userName/:userName/password/:password/data/:data", POSTHANDLER);

async function getUsers(){
  return await user.find({}, null);
}

async function deleteUser(username){
  await user.deleteOne({userName: `${username}`}, function(err){err?console.log("error deleting user"):console.log(`success deleting ${username}`)});
  var us = getUsers();
  us.then(function(result) {
     console.log(result) // "Some User token"
  })
}

function deleteAllUsers(){
  var us = getUsers();
  us.then(function(result) {
    for(let entry of result){
      deleteUser(entry.userName);
    }
  })

}
