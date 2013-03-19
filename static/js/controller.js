// Start Socket
var socket = io.connect('http://localhost/cio');

socket.on('connect', function () {

	socket.emit('Controller Connected', 'l');

});

$(function() {

	$('#up').on('click', function() {
		socket.emit('move', { type: 'up', user: 'left' });
		console.log('Move Up!');
	});

	$('#down').on('click', function() {
		socket.emit('move', { type: 'down', user: 'left' });
		console.log('Move Down!');
	});

});