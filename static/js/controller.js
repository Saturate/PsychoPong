// Start Socket
var socket = io.connect('http://localhost/cio1');

socket.on('connect', function () {

	socket.emit('Controller Connected', 'l');

});

// Game controller 
var GC = {
	sendMovement: function(e) {
		socket.emit('move', { type: 'n', user: 'left' });
	}
}

$(function() {
	$(document).keydown(function(evt){
	  if (evt.which == 38) { // up
        socket.emit('move', { dir: 'n' });
	  } else if (evt.which == 40) { // down
        socket.emit('move', { dir: 's' });
	  }
      console.log('key pressed: ' + evt.which);
    });

	$('#up').on('click', function() {
		socket.emit('move', { dir: 'n', user: 'left' });
		console.log('Move Up!');
	});

	$('#down').on('click', function() {
		socket.emit('move', { dir: 's', user: 'left' });
		console.log('Move Down!');
	});

});