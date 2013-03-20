// Start Socket
var socket = io.connect('http://localhost/cio');

socket.on('connect', function () {

	socket.emit('Controller Connected', 'l');

});

// Game controller 
var GC = {
	sendMovement: function(input) {
		socket.emit('move', input);
	}
}

// Controller Types
var CT = {
	buttons: {
		init: function () {

			$('#up').on('click', function() {
				GC.sendMovement( { dir: 'n' });
			});

			$('#down').on('click', function() {
				GC.sendMovement( { dir: 's' } );
			});

		},
		destory: function () {

		}
	},
	arrowkeys:  {
		init: function () {

			$(document).keydown(function(evt){
			  if (evt.which == 38) { // up
		        GC.sendMovement({ dir: 'n' });

			  } else if (evt.which == 40) { // down
		        GC.sendMovement({ dir: 's' });
			  }
		      console.log('key pressed: ' + evt.which);
		    });

		},
		destory: function () {

		}
	}
}

$(function() {

	// We need to control active input types by initing them and destorying them after
	CT.buttons.init();
	CT.arrowkeys.init();

});