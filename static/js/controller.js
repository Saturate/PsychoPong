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
		destory: function () {}
	},
	deviceOrientation: {
		init: function () {
			if (window.DeviceOrientationEvent) {
				document.getElementById("doEvent").innerHTML = "DeviceOrientation";
					
				// Listen for the deviceorientation event and handle the raw data
				window.addEventListener('deviceorientation', function(eventData) {
					// gamma is the left-to-right tilt in degrees, where right is positive
					var tiltLR = eventData.gamma;

					// beta is the front-to-back tilt in degrees, where front is positive
					var tiltFB = eventData.beta;

					// alpha is the compass direction the device is facing in degrees
					var dir = eventData.alpha

					// deviceorientation does not provide this data
					var motUD = null;

					// call our orientation event handler
					deviceOrientationHandler(tiltLR, tiltFB, dir, motUD);
				}, false);

			} else if (window.OrientationEvent) {
				document.getElementById("doEvent").innerHTML = "MozOrientation";

				window.addEventListener('MozOrientation', function(eventData) {
					// x is the left-to-right tilt from -1 to +1, so we need to convert to degrees
					var tiltLR = eventData.x * 90;

					// y is the front-to-back tilt from -1 to +1, so we need to convert to degrees
					// We also need to invert the value so tilting the device towards us (forward) 
					// results in a positive value. 
					var tiltFB = eventData.y * -90;

					// MozOrientation does not provide this data
					var dir = null;

					// z is the vertical acceleration of the device
					var motUD = eventData.z;

					// call our orientation event handler
					deviceOrientationHandler(tiltLR, tiltFB, dir, motUD);
				}, false);
			} else {
				document.getElementById("doEvent").innerHTML = "Not supported on your device or browser."
			}

			function deviceOrientationHandler(tiltLR, tiltFB ,dir, motionUD) {
				document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
				document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
				document.getElementById("doDirection").innerHTML = Math.round(dir);
				document.getElementById("doMotionUD").innerHTML = motionUD;

				// Apply the transform to the image
				document.getElementById("rotateMe").style.webkitTransform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
				document.getElementById("rotateMe").style.MozTransform = "rotate(" + tiltLR + "deg)";
				document.getElementById("rotateMe").style.transform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";

				if (Math.round(tiltFB) >= 30 || Math.round(tiltFB) <= -30) {
					console.log('DEBUG: Send event?', Math.round(tiltFB));
				};
			}
		},
		destory: function () {
			// Remove Event Listeners
		}
	}
}

$(function() {

	// We need to control active input types by initing them and destorying them after
	CT.buttons.init();
	CT.arrowkeys.init();
	CT.deviceOrientation.init();


});