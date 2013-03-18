var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(1337);
console.log('Listening on port 1337');

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/static/controller.html');
});

app.get('/board/', function (req, res) {
  res.sendfile(__dirname + '/static/board.html');
});

