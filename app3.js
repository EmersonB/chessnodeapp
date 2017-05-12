
var express = require('express');
var path = require('path')
var app = express();
var Handlebars = require('handlebars');
var admin = require("firebase-admin");
var serviceAccount = require(__dirname+"/private.json");

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

app.use(require('./controllers'));

var firebase = require('firebase/app');
require('firebase/database');

var config = {
    apiKey: "--ZfxxA",
    authDomain: "-.firbaseapp.com",
    databaseURL: "://-.firebaseio.com",
    projectId: "-",
    storageBucket: "-.appspot.com",
    messagingSenderId: ""
  };

firebase.initializeApp(config);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tjweb-55683.firebaseio.com"
});
var db = admin.database();
var ref = db.ref("nodeapp");

var players = {};
  ref.child("players").on("value", function(snapshot) {
  console.log(snapshot.val());
  players = snapshot.val();
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

app.set('port', process.env.PORT || 8080);

var listener = app.listen(app.get('port'), function() {
  console.log( listener.address().port );
});

app.get('/', function(req, res) {

  var template = require( __dirname+'/home.hbs');
  var data = { "title": "Emerson"};
  var result = template(data);
  res.send(result);

});

app.get('/nationals', function(req, res) {

  var template = require( __dirname+'/nationals.hbs');
  var data = { "title": "Super Nationals", "players": Object.keys(players).toString()};
  var result = template(data);
  res.send(result);

});

app.get('/getplayers', function(req, res) {

  res.send(players);

});

app.post('/update', function(req, res) {
  //console.log(req.body.name);
  var name = req.body.name;
  var score = req.body.score;
  var game = req.body.game;
  console.log(name);
  console.log(players[name]);
  var playersRef = ref.child("players");
  if((name) in players){
    players[name][game] = score;
  }
  else{
    players[name] = ["N/A","N/A","N/A","N/A","N/A","N/A","N/A"]
    players[name][game] = score;
  }
  playersRef.set(players);
  console.log(players);
});
