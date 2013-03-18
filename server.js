var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('Well.. wakka wakka!');
});

app.get('/hello.txt', function(req, res){
  res.send('Hello World');
});

app.get('/let-me-travle', function(req, res){
  res.redirect('http://www.translate.google.com/translate_tts?tl=da&q=Du%20er%20grim');
});


app.get('/users', function(req, res){
  res.json({ user: ['Allan', 'Adam'] });
});

app.listen(1337);
console.log('Listening on port 1337');