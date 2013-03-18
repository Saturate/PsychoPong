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

app.get('/js/board.js', function (req, res) {
  res.sendfile(__dirname + '/static/js/board.js');
});

var board = io
  .of('/bio')
  .on('connection', function (socket) {
    socket.emit('news', { status: 'Board connected' });
  });

var controller = io
  .of('/cio')
  .on('connection', function (socket) {
    socket.emit('status', { status: 'connected' });
    socket.on('l', function (data) {
      board.socket.emit('l', 'l');
    });
    socket.on('r', function (data) {
      board.socket.emit('r', 'r');
    });
  });
