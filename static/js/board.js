// Options/Settings
var opt = {
	width: 700,
	height: 400
};

var players = [];


// Start Socket
var socket = io.connect('http://localhost/bio');

socket.on('connect', function () {
	console.log('Board Connected...');
	socket.emit('Board Connected', { client: 'data' });
});

socket.on('playerConnected', function (player) {
	console.log('Player Connected.', player);
	players.push(player.id);
});



var Board = {
	resolvePlayer: function(id) {
		return jQuery.inArray(id, players);
	},
	launchFullScreen: function (element) {
		if(element.requestFullScreen) {
			element.requestFullScreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullScreen) {
			element.webkitRequestFullScreen();
		}
	}
}

window.onload = function() {

	$('#fullscreen').on('click', function(e) {
		e.preventDefault();
		Board.launchFullScreen(document.documentElement);
	});

	// Make game board!
	Crafty.init(opt.width, opt.height);
	Crafty.background('rgb(0,0,0)');


	// loading scene preloads all images, then runs title scene
	Crafty.scene("loading", function() {
		//Crafty.e("2D, DOM, Image").attr({x: 0, y: 0}).image("images/loading.png");
		Crafty.e("load, DOM, 2D, Text")
			.attr({ x: opt.width / 2, y: opt.height / 2, w: 100, h: 20, points: 0 })
			.textColor('#FFFFFF')
			.text("Loading...");


		// For some reason we need a png, does mp3 not work?
		Crafty.load(["/img/title.png","/sound/start.mp3"],
			function() {

				console.log('Done loading...');

				// Instead of using the HTML5 audio tag directly, we use Crafty to load these files.
				Crafty.audio.add({
					start: ["/sounds/start.mp3"]
				});

				Crafty.scene("title");

			},
			function(e) {
				//progress
				console.log(e);
			},
			function(e) {
				// error
				console.error('Load error:', e);
			}
		);

	});


	// Before we play we want to wait
	Crafty.scene("title", function() {

		Crafty.e("StartMsg, DOM, 2D, Text")
			.attr({ x: 0 , y: opt.height / 2, w: opt.width, h: 20, points: 1 })
			.css("textAlign", "center")
			.textColor('#FFFFFF')
			.text("Press SPACE to start...");

		socket.emit('Board Ready');


		var spaceToStart = function(e) {
			if (e.keyCode === Crafty.keys['SPACE']) {

				Crafty.audio.play("start");

				//document.getElementById('soundStart').play();

				Crafty.unbind("KeyDown", spaceToStart);
				Crafty.scene("main");
			}
		};
		Crafty.bind("KeyDown", spaceToStart);
	});

	Crafty.scene("main", function() {

		//Paddles
		var paddleLeft = Crafty.e("Paddle, 2D, DOM, Color, Multiway")
			.color('rgb(255,255,255)')
			.attr({ x: 20, y: opt.height / 2 - 50, w: 10, h: 100 })
			.multiway(4, { W: -90, S: 90 });
		var paddleRight = Crafty.e("Paddle, 2D, DOM, Color, Multiway")
			.color('rgb(255,255,255)')
			.attr({ x: opt.width - 40, y: (opt.height / 2) - 50, w: 10, h: 100 })
			.multiway(4, { UP_ARROW: -90, DOWN_ARROW: 90 });


		paddleLeft.bind("move", function(e) {
			console.log('left move', e);
			this.move(e.dir, e.distance);
		});

		paddleRight.bind("move", function(e) {
			console.log('right move', e);
			this.move(e.dir, e.distance);
		});

		socket.on('move', function (data) {
			var player = Board.resolvePlayer(data.id);
			console.log('Move event from socket!', data);

			if (player === 0) {
				paddleLeft.trigger("move", { distance: 15, dir: data.dir });
			} else if (player === 1) {
				paddleRight.trigger("move", { distance: 15, dir: data.dir });
			};
		});


		//Ball
		Crafty.e("2D, DOM, Color, Collision")
			.color('rgb(255,255,255)')
			.attr({ x: opt.width / 2, y: opt.height / 2, w: 10, h: 10,
					dX: Crafty.math.randomInt(2, 5),
					dY: Crafty.math.randomInt(2, 5) })
			.bind('EnterFrame', function () {
				//hit floor or roof
				if (this.y <= 0 || this.y >= opt.height - 10)
					this.dY *= -1;

				if (this.x > opt.width) {
					this.x = opt.height;
					Crafty("LeftPoints").each(function () {
						this.text(++this.points + " Points");
					});
				}
				if (this.x < 10) {
					this.x = opt.height;
					Crafty("RightPoints").each(function () {
						this.text(++this.points + " Points");
					});
				}

				this.x += this.dX;
				this.y += this.dY;
			})
			.onHit('Paddle', function () {
			this.dX *= -1;
		});

		//Score boards
		Crafty.e("LeftPoints, DOM, 2D, Text")
			.attr({ x: 20, y: 20, w: 100, h: 20, points: 0 })
			.textColor('#FFFFFF')
			.text("0 Points");
		Crafty.e("RightPoints, DOM, 2D, Text")
			.attr({ x: opt.width - 90, y: 20, w: 100, h: 20, points: 0 })
			.textColor('#FFFFFF')
			.text("0 Points");
	});

	// init the game
	Crafty.scene("loading");
};