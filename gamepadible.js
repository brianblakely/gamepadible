(function() {
	"use strict";

	window.Pads = [];

	window.Pad = function(options) {
		var self = this;

		// Normalize options.
		options = options || {};
		var optionsDefault = {
				name: 'Pad '+(Pads.length+1),
				deadzone: 0.15
			};
		for(var option in optionsDefault) {
			options[option] = options[option] || optionsDefault[option];
		}

		// Pad properties.
		self.options = options;
		self.name = options.name;
		self.index = Pads.length;
		self.connected = false;

		// Pad events.
		self.connection = {};
		self.leftStick = {
			move: {},
			up: {},
			right: {},
			down: {},
			left: {},
			button: {}
		};
		self.rightStick = {
			move: {},
			up: {},
			right: {},
			down: {},
			left: {},
			button: {}
		};
		self.dpad = {
			up: {},
			right: {},
			down: {},
			left: {}
		};
		self.button = {
			north: {},
			east: {},
			south: {},
			west: {},
			start: {},
			select: {}
		};
		self.leftShoulder = {
			front: {},
			back: {}
		};
		self.rightShoulder = {
			front: {},
			back: {}
		};

		self.remove = function() {
			Pads.splice(self.index, 1);
		};

		Pads.push(self);

		// Start polling for gamepad input.
		if(Pads.length === 1) {
			requestAnimationFrame(padPoll);
		}

		return Pads[self.index];
	};

	function PadConnectionEvent() {

	}

	var axisInfo = function() {

		};

	function PadAxisEvent(axes, type) {
		var self = this;


	}

	function PadButtonEvent() {

	}

	// A per-frame loop that polls for gamepad input.

	// Loop commons.
	var connPads = {}, // Reported connections.
		realPads = [], // Real connections.
		padInfo = {},
		padCnt = 0;

	var padPoll = function() {
			if(!Pads.length) {
				return false;
			}

			connPads = navigator.getGamepads();
			realPads = [];

			// Dig out actual gamepads.
			for(padCnt = connPads.length-1; padCnt >= 0; --padCnt) {
				if(
					connPads[padCnt] === undefined
					|| connPads[padCnt].axes.length
					|| connPads[padCnt].buttons.length
				) {
					realPads.push(connPads[padCnt]);
				}
			}

			// Send data from poll.
			Pads.forEach(sendPadInfo);

			// Poll again at next frame.
			requestAnimationFrame(padPoll);
		},

		// Go through Pads, send them data from poll.
		sendPadInfo = function(pad, i) {
			padInfo = realPads[i];

			// Pad no longer exists.
			if(!padInfo) {
				if(pad.connected) {
					pad.connected = false;
					// ... Lift buttons.
				}

				return false;
			}

			if(!pad.connected) {
				pad.connected = true;
			}

			// ... Calculate heading.
			padInfo.axes.forEach(parseInput, pad);

			padInfo.buttons.forEach(parseInput, pad);
		},

		// Parse analog stick data for sending.
		parseAxes = function(strength, i, axes) {
			if(Math.abs(strength) <= this.options.deadzone) {
				return false;
			}

			switch(i) {
				case 0:
					if(strength < 0 && this.leftStick.up.push) {
						this.leftStick.up.push.call(this, new PadAxisEvent(axes));
					} else if(strength > 0 && this.leftStick.down.push) {
						this.leftStick.down.push.call(this, new PadAxisEvent(axes));
					}
					break;
				case 1:
					if(strength < 0 && this.leftStick.left.push) {
						this.leftStick.left.push.call(this, new PadAxisEvent(axes));
					} else if(strength > 0 && this.leftStick.right.push) {
						this.leftStick.right.push.call(this, new PadAxisEvent(axes));
					}
					break;
				case 2:
					if(strength < 0 && this.rightStick.up.push) {
						this.rightStick.up.push.call(this, new PadAxisEvent(axes));
					} else if(strength > 0 && this.rightStick.down.push) {
						this.rightStick.down.push.call(this, new PadAxisEvent(axes));
					}
					break;
				case 3:
					if(strength < 0 && this.rightStick.left.push) {
						this.rightStick.left.push.call(this, new PadAxisEvent(axes));
					} else if(strength > 0 && this.rightStick.right.push) {
						this.rightStick.right.push.call(this, new PadAxisEvent(axes));
					}
					break;
				default:
					break;
			}
		},

		parseButtons = function(strength, i, buttons) {
			if(Math.abs(strength) <= this.options.deadzone) {
				return false;
			}

			case 0:
				if(strength < 0 && this.leftStick.up.push) {
					this.leftStick.up.push.call(this, new PadAxisEvent(axes));
				} else if(strength > 0 && this.leftStick.down.push) {
					this.leftStick.down.push.call(this, new PadAxisEvent(axes));
				}
				break;
			case 1:
				if(strength < 0 && this.leftStick.left.push) {
					this.leftStick.left.push.call(this, new PadAxisEvent(axes));
				} else if(strength > 0 && this.leftStick.right.push) {
					this.leftStick.right.push.call(this, new PadAxisEvent(axes));
				}
				break;
			case 2:
				if(strength < 0 && this.rightStick.up.push) {
					this.rightStick.up.push.call(this, new PadAxisEvent(axes));
				} else if(strength > 0 && this.rightStick.down.push) {
					this.rightStick.down.push.call(this, new PadAxisEvent(axes));
				}
				break;
			case 3:
				if(strength < 0 && this.rightStick.left.push) {
					this.rightStick.left.push.call(this, new PadAxisEvent(axes));
				} else if(strength > 0 && this.rightStick.right.push) {
					this.rightStick.right.push.call(this, new PadAxisEvent(axes));
				}
				break;
			default:
				break;
		};
})();

var player1 = new Pad({
		name: 'player1'
	}),
	player2 = new Pad({
		deadzone: 0.75
	});

function digHole(event, speed, angle) {
	if(speed === 'fast') {
		console.log('hole digging fast!', angle);
	} else {
		console.log('this hole is making me thirsty!', angle);
	}
}
player1.leftStick.up.push(digHole, 'fast', 0);
player2.leftStick.up.push(digHole, 'slow', 90);