const crypto = require("crypto");
const mongoose = require("mongoose");

const express = require("express");
const app = express();
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


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
  email: String,
  sessionID: String
});

app.listen(INPUTPORT, dank.connectionRec);

const ENTRYERR = (err, u) => {
  if (err){
    console.log("\n\n\n\nError inputting data into mongoDB\n\n\n\n");
  }else{
    console.log("\n\nServerside success\n\n");
  }
};

var userModel = mongoose.model('user', userSchema);

//DEPROCATED
const REGISTERHANDLER = (req, res) => {
  var sessionid = crypto.randomBytes(16).toString("base64");
  var thisUser = new userModel({userName: req.params.userName, password: req.params.password, email: req.params.email, sessionID: sessionid});
  thisUser.save(ENTRYERR);
  console.log(`Successfully entered:\n${req.params.userName}\n${req.params.password}\n${req.params.email}\n\n\n`);
  res.send("success");
  collection = db.collections;
  console.log(collection);
  var us = getUsers();
  us.then(function(result) {
     console.log(result) // "Some User token"
  })
};

const REGISTERHANDLERCRYPTO = (req, res) => {
  const salt = crypto.randomBytes(16).toString("base64");
  const hash = crypto.createHmac("sha256", salt).update(req.params.password).digest('base64');
  const salthash = `${salt}$${hash}`;
  var sessionid = crypto.randomBytes(16).toString("base64");
  var thisUser = new userModel({userName: req.params.userName, password: salthash, email: req.params.email, sessionID: sessionid});
  thisUser.save(ENTRYERR);
  console.log(`Successfully entered:\n${req.params.userName}\n${req.params.password}\n${salthash}\n${req.params.email}\n\n\n`);
  res.send("success");
  collection = db.collections;
  console.log(collection);
  var us = getUsers();
  us.then(function(result) {
     console.log(result) // "Some User token"
  })
};

const POSTTEST = (req, res) => {
  console.log(req.body);
  res.send("Success");
}

const POSTREGISTERHANDLERCRYPTO = (req, res) => {
  const salt = crypto.randomBytes(16).toString("base64");
  const hash = crypto.createHmac("sha256", salt).update(req.body.password).digest('base64');
  const salthash = `${salt}$${hash}`;
  var sessionid = crypto.randomBytes(16).toString("base64");
  var thisUser = new userModel({userName: req.body.username, password: salthash, email: req.body.email, sessionID: sessionid});
  thisUser.save(ENTRYERR);
  console.log(`Successfully entered:\n${req.body.username}\n${req.body.password}\n${salthash}\n${req.body.email}\n\n\n`);
  res.send("success");
  collection = db.collections;
  console.log(collection);
  var us = getUsers();
  us.then(function(result) {
     console.log(result) // "Some User token"
  })
};

const LOGINHANDLER = (req, res) => {
  var userForName = getUser(req.params.userName);
  userForName.then(function(result) {
    var parts = result.password.split("$");
    const newHash = crypto.createHmac("sha256", parts[0]).update(req.params.password).digest('base64');
    console.log(`\n\nEntered Password:${req.params.password}\n\n`);
    console.log(`\n\nDatabase Password Hash:${parts[1]}\n\n`);
    console.log(`\n\nEntered Password Hash:${newHash}\n\n`);
    if((`${parts[0]}$${newHash}`) == `${result.password}`){
      const newSalt = crypto.randomBytes(16).toString("base64");
      const newHash = crypto.createHmac("sha256", newSalt).update(req.params.password).digest('base64');
      const newSaltHash = `${newSalt}M${newHash}`;
      var sessionid = crypto.randomBytes(16).toString("base64");
      userModel.updateOne({userName: req.params.userName},{password: newSaltHash, sessionID: sessionid}, function(err, res) {
        //handler
      });
      console.log("Login successful");
      res.send("Logged in");
    }
    else{
      console.log("Login failed");
      res.send("Login failed");
    }
    collection = db.collections;
    console.log(collection);
    var us = getUsers();
    us.then(function(result) {
       console.log(result) // "Some User token"
    })
  });
};

const POSTLOGINHANDLER = (req, res) => {
  var validPassWord = false;
  var usersWithName = getUsers(req.body.username);
  usersWithName.then(function(users){
    if(!users){
      res.status(500).send("No user with that username");
    }else{
      for(user of users){
        var oldHashParts = user.password.split("$");
        var oldSalt = oldHashParts[0];
        var checkHash = crypto.createHmac("sha256", oldSalt).update(req.body.password).digest("base64");
        if(checkHash == oldHashParts[1]){
          validPassWord = true;
          newSalt = crypto.randomBytes(16).toString("base64");
          var newHash = crypto.createHmac("sha256", newSalt).update(req.body.password).digest("base64");
          newPassword = `${newSalt}$${newHash}`;
          var sessionid = crypto.randomBytes(16).toString("base64");
          user.updateOne(user, {password: newPassword, sessionID: sessionid}, function(err, res) {
            //handler
          });
          console.log("Login successful");
          res.send("Logged in");
        }
      }
      if(!validPassWord){
        console.log("Invalid password provided");
        res.status(500).send("Password incorrect");
      }
    }
  });
}

function DELETEALLHANDLER(req, res){
  deleteAllUsers();
  res.send("All users deleted");
}

app.get("/register/userName/:userName/password/:password/email/:email", REGISTERHANDLERCRYPTO);
app.get("/login/userName/:userName/password/:password", LOGINHANDLER);
app.get("/deleteAll", DELETEALLHANDLER);
app.post("/register", POSTREGISTERHANDLERCRYPTO);
app.post("/login", POSTLOGINHANDLER)

//find list of users with matching username
async function getUsers(username){
  return await userModel.find({userName: `${username}`}, null);
}

//find one user with matching username (unstable)
async function getUser(username){
  return await userModel.findOne({userName: `${username}`}, null);
}

async function deleteUser(username){
  await userModel.deleteOne({userName: `${username}`}, function(err){err?console.log("error deleting user"):console.log(`success deleting ${username}`)});
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
