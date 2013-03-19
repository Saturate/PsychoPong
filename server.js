var app = require('express')();
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

app.get('/js/board.js', function (req, res) {
  res.sendfile(__dirname + '/static/js/board.js');
});

app.get('/js/controller.js', function (req, res) {
  res.sendfile(__dirname + '/static/js/controller.js');
});

app.get('/sounds/start.mp3', function (req, res) {
  res.sendfile(__dirname + '/static/sound/start.mp3');
});

app.get('/css/main.css', function (req, res) {
  res.sendfile(__dirname + '/static/css/main.css');
});

/* Socket.io Events */
var board = io
  .of('/bio')
  .on('connection', function (socket) {
    socket.emit('news', { status: 'Board connected' });
  });

var controller1 = io
  .of('/cio1')
  .on('connection', function (socket) {
    socket.emit('status', { status: 'connected' });
    console.log(board);
    socket.on('move', function (data) {
      board.emit('move', { player: 1, dir: data.dir });
      console.log('Player 1, move: ' + data.dir);
    });
  });

var controller2 = io
  .of('/cio2')
  .on('connection', function (socket) {
    socket.emit('status', { status: 'connected' });
    console.log(board);
    socket.on('move', function (data) {
      board.emit('move', { player: 2, dir: data.dir });
      console.log('Player 2, move: ' + data.dir);
    });
  });
