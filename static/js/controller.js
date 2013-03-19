// Start Socket
var socket = io.connect('http://localhost/cio1');

socket.on('connect', function () {

	socket.emit('Controller Connected', 'l');

});

// Game controller 
var GC = {
	sendMovement: function(input) {
		socket.emit('move', { type: 'n', user: 'left' });
	}
}

$(function() {
	$(document).keydown(function(evt){
	  if (evt.which == 38) { // up
        GC.sendMovement( { dir: 'n' } } 

	  } else if (evt.which == 40) { // down
        GC.sendMovement( { dir: 's' } } 
	  }
      console.log('key pressed: ' + evt.which);
    });

	$('#up').on('click', function() {
		GC.sendMovement( { dir: 'n' } } 
	});

	$('#down').on('click', function() {
		GC.sendMovement( { dir: 's' } )
	});

});