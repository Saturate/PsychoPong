// Start Socket
var socket = io.connect('http://localhost/cio1');

socket.on('connect', function () {

	socket.emit('Controller Connected', 'l');

});

$(function() {
	$(document).keydown(function(evt){
	  if (evt.which == 38) { // up
        socket.emit('move', { dir: 'u' });
	  } else if (evt.which == 40) { // down
        socket.emit('move', { dir: 'd' });
	  }
      console.log('key pressed: ' + evt.which);
    });

	$('#up').on('click', function() {
		socket.emit('move', { type: 'up', user: 'left' });
		console.log('Move Up!');
	});

	$('#down').on('click', function() {
		socket.emit('move', { type: 'down', user: 'left' });
		console.log('Move Down!');
	});

});