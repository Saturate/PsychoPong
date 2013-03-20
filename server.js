var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(1337);
console.log('Listening on port 1337');


/* Rounting */
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/static/controller.html');
});
app.get('/board/', function (req, res) {
  res.sendfile(__dirname + '/static/board.html');
});
app.use('/', express.static('static'));


/* Socket.io Events */
var board = io
  .of('/bio')
  .on('connection', function (socket) {
    socket.emit('news', { status: 'Board connected' });
  });

var controller = io
  .of('/cio')
  .on('connection', function (socket) {
    socket.emit('status', { status: 'connected' });
    board.emit('playerConnected', { id: '1' });


    // send the clients id to the client itself.
    socket.send(socket.id);

    console.log(board);
    socket.on('move', function (data) {
      board.emit('move', { player: 1, dir: data.dir });
      console.log('Player 1, move: ' + data.dir);
    });
  });
