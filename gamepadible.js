(function() {
	"use strict";

	window.Pads = [];

	var eventInit = function(pad) {
			var events = [
					{
						group: 'connection',
						events: [
							'on',
							'off'
						]
					},
					{
						group: 'leftStick',
						events: [
							'move',
							'up',
							'right',
							'down',
							'left',
							'button'
						]
					},
					{
						group: 'rightStick',
						events: [
							'move',
							'up',
							'right',
							'down',
							'left',
							'button'
						]
					},
					{
						group: 'dpad',
						events: [
							'up',
							'right',
							'down',
							'left'
						]
					},
					{
						group: 'button',
						events: [
							'north',
							'east',
							'south',
							'west',
							'start',
							'select'
						]
					},
					{
						group: 'leftShoulder',
						events: [
							'front',
							'back'
						]
					},
					{
						group: 'rightShoulder',
						events: [
							'front',
							'back'
						]
					}
				],
				assignGroups = function(event) {
					pad[event.group] = {};
					event.events.forEach(assignEvents, event);
				},
				assignEvents = function(event) {
					// Handle boolean connection events as a special case.
					if(this.group === 'connection') {
						pad[this.group][event] = function() {
							var callback = arguments[0];
						};
					}
					// All other events are assumed button inputs.
					else {
						pad[this.group][event] = {
							push: function() {
								var callback = arguments[0];

							},
							hold: function(){},
							lift: function(){}
						};
					}
				},
				triageEvent = function(event) {

				};

			events.forEach(assignGroups);
		};

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

		self.options = options;
		self.name = options.name;
		self.index = Pads.length;
		self.connected = false;

		eventInit(self);

		self.remove = function() {
			Pads.splice(self.index, 1);
		};

		Pads.push(self);

		// Start polling for gamepad input.
		if(Pads.length === 1) {
			requestAnimationFrame(padPoll);
		}

		return Pads[self.index];
	}

	// Loop that polls for gamepad input.

	// Loop params.
	var connPads = {}, // Reported connections.
		realPads = []; // Real connections.

	// Go through Pads, send them data from poll.
	var padInfo = {};

	var sendAxesInfo = function(strength, i, axes) {
			if(Math.abs(strength) <= this.options.deadzone) {
				return false;
			}

			switch(i) {
				case 0:
					if(strength > 0) {
						this.leftStick.up.push;
					}
					break;
				default:
					break;
			}
		},
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
			padInfo.axes.forEach(sendAxesInfo, pad);
		};

	var padCnt = 0;

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