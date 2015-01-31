(function() {
	"use strict";

	window.Pads = [];

	window.Pad = function(options) {
		var self = this;

		// Normalize options.
		options = options || {};
		var optionsDefault = {
				name: 'Pad '+(Pads.length+1),
				deadzone: 0.20,
				type: 'traditional'
			};
		for(var option in optionsDefault) {
			options[option] = options[option] || optionsDefault[option];
		}

		// Pad properties.
		self.options = options;
		self.name = options.name;
		self.index = Pads.length;
		self.connected = false;

		self.raw = null;

		self.events = {};
		self.on = function(event, handler, key) {
			self.events[event] = {
				handler: handler,
				key: key
			};
		};
		self.off = function(event, handler) {
			if(!event) {
				self.events = {};
			} else {
				delete self.events[event];
			}
		};
		self.state = '';

		self.type = options.type;
		self.mapping = {};
		for(var prop in window.Pad.mappings[self.type]) {
			self.mapping[prop] = window.Pad.mappings[self.type][prop];
		}
		self.remap = function(oldEvent, newEvent, swapThem) {
			self.mapping[oldEvent] = window.Pad.mappings[self.type][newEvent];

			if(swapThem) {
				self.mapping[newEvent] = window.Pad.mappings[self.type][oldEvent];
			}
		};

		self.remove = function() {
			Pads.splice(self.index, 1);
		};

		Pads.push(self);

		// Start polling for gamepad input.
		if(Pads.length === 1) {
			requestAnimationFrame(padPoll);

			window.addEventListener('keydown', keyPad);
			window.addEventListener('keyup', keyPad);
		}

		return self;
	};

	var supports = (function() {
			if('getGamepads' in navigator) {
				return 'standard';
			}

			else if(device !== undefined && device.platform === 'iOS') {
				return 'ios';
			}

			else if(device !== undefined && device.platform === 'Android') {
				return 'android';
			}

			else {
				return false;
			}
		})();

	// Event objects.
	function PadInputEvent(pad, type, options) {
		var self = this;

		self.target = pad;
		self.type = type;

		for(var option in options) {
			self[option] = options[option];
		}
	}
	function PadConnectionEvent() {
		var self = this;
	}

	// A per-frame loop that polls for gamepad input.

	// Loop commons.
	var connPads = {}, // Reported connections.
		connPadLen = 0,
		realPads = [], // Real connections.
		padInfo = {}, // Direct data from API.
		keyInfo = false,
		padCnt = 0, // Reported connection count.
		padEvt = 0, // Each event that the pad currently handles.
		evtRslt = {}, // Result of event test.
		retEvt = new PadInputEvent(), // Event given to callback.
		evtProp = {}; // Each property returned by the event test.

	// Main loop function.
	var padPoll = function() {
			if(!Pads.length) {
				window.removeEventListener('keydown', keyPad);
				window.removeEventListener('keyup', keyPad);

				return false;
			}

			// Populate realPads array with raw hardware data.
			padDetection[supports]();

			if(!realPads.length) {
				return false;
			}

			// Test data from poll.
			Pads.forEach(testPadEvents);

			// Poll again at next frame.
			requestAnimationFrame(padPoll);
		},

		// Platform-specific gamepad detection. Populates the realPads array.
		padDetection = {
			'standard': function() {
				connPads = navigator.getGamepads();
				realPads = [];

				// Dig out actual gamepads.
				for(padCnt=0, connPadLen=connPads.length; padCnt<connPadLen; ++padCnt) {
					if(
						connPads[padCnt] !== undefined
						&& (
							connPads[padCnt].axes.length === 4
							|| connPads[padCnt].buttons.length
						)
					) {
						realPads.push(connPads[padCnt]);
					}
				}
			},

			'ios': function() {
				realPads = [];
			},

			'android': function() {
				realPads = [];
			}
		},

		// Go through Pads, test for and possibly fire subscribed events.
		testPadEvents = function(pad, i) {
			// Use gamepad hardware data.
			pad.raw = realPads[i];

			// Or check for and use keyboard.
			if(
				!pad.raw
				&& this !== undefined
				&& 'keyCode' in this
			) {
				pad.raw = this;
				keyInfo = true;
			} else {
				keyInfo = false;
			}

			// No input device exists.
			if(!pad.raw) {
				if(pad.connected) {
					pad.connected = false;
					// ... Lift buttons.
				}

				return false;
			}

			if(!pad.connected) {
				pad.connected = true;
			}

			// Test each subscribed event to see if it fired.
			for(padEvt in pad.events) {
				if(
					keyInfo
					&& this.keyCode !== pad.events[padEvt].key
				) {
					continue;
				}

				// Execute test.
				evtRslt = pad.mapping[padEvt][supports](pad);

				// The event returned a truthy result, which means it fired.
				if(evtRslt) {
					retEvt = new PadInputEvent(pad, padEvt, evtRslt);

					// Event handler was given as a callback function.
					if(typeof pad.events[padEvt] === 'function') {
						pad.events[padEvt].handler.call(pad, retEvt);
					}
					// Event handler has states, and one of those is active.
					else if(pad.state in pad.events[padEvt]) {
						pad.events[padEvt].handler[pad.state].call(pad, retEvt);
					}
					// Event handler has states, but none are active.
					else {
						pad.events[padEvt].handler['default'].call(pad, retEvt);
					}
				}
			}
		},

		keyPad = function(e) {
			Pads.forEach(testPadEvents, e);
		};
})();