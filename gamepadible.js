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
		self.on = function(event, callback) {
			self.events[event] = callback;
		};
		self.off = function(event, callback) {
			if(!event) {
				self.events = {};
			} else {
				delete self.events[event];
			}
		};
		self.state = '';

		self.type = options.type;
		self.mapping = {};
		for(var prop in padMapping[self.type]) {
			self.mapping[prop] = padMapping[self.type][prop];
		}
		self.remap = function(oldEvent, newEvent, swapThem) {
			self.mapping[oldEvent] = padMapping[self.type][newEvent];

			if(swapThem) {
				self.mapping[newEvent] = padMapping[self.type][oldEvent];
			}
		};

		self.remove = function() {
			Pads.splice(self.index, 1);
		};

		Pads.push(self);

		// Start polling for gamepad input.
		if(Pads.length === 1) {
			requestAnimationFrame(padPoll);
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

	// Input mappings.
	var v = 0,
		h = 0,
		strength = 0,
		heading = 0;

	var padMapping = {
			traditional: {
				'left.stick.move': {
					'standard': function(pad) {
						v = pad.raw.axes[1];
						h = pad.raw.axes[0];
						strength =
							Math.sqrt(
								Math.pow(v,2)
								+ Math.pow(h,2)
							);
						heading = 0;

						if(strength > pad.options.deadzone) {
							heading =
								Math.atan2(v,h) // Gives rotation between Pi and -Pi.
								* (180/Math.PI) // Convert to degrees.
								+ 90; // Make "north" the zero-point.

							if(heading < 0) {
								heading = 360 + heading;
							}

							return {
								strength: Math.min(strength,1),
								heading: heading
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'left.stick.up': {
					'standard': function(pad) {
						if(pad.raw.axes[1] < -pad.options.deadzone) {
							return {
								strength: Math.abs(pad.raw.axes[1])
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'left.stick.down': {
					'standard': function(pad) {
						if(pad.raw.axes[1] > pad.options.deadzone) {
							return {
								strength: Math.abs(pad.raw.axes[1])
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'left.stick.left': {
					'standard': function(pad) {
						if(pad.raw.axes[0] < -pad.options.deadzone) {
							return {
								strength: Math.abs(pad.raw.axes[0])
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'left.stick.right': {
					'standard': function(pad) {
						if(pad.raw.axes[0] > pad.options.deadzone) {
							return {
								strength: Math.abs(pad.raw.axes[0])
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'right.stick.move': {
					'standard': function(pad) {
						v = pad.raw.axes[3];
						h = pad.raw.axes[2];
						strength =
							Math.sqrt(
								Math.pow(v,2)
								+ Math.pow(h,2)
							);
						heading = 0;

						if(strength > pad.options.deadzone) {
							heading =
								Math.atan2(v,h) // Gives rotation between Pi and -Pi.
								* (180/Math.PI) // Convert to degrees.
								+ 90; // Make "north" the zero-point.

							if(heading < 0) {
								heading = 360 + heading;
							}

							return {
								strength: Math.min(strength,1),
								heading: heading
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'right.stick.up': {
					'standard': function(pad) {
						if(pad.raw.axes[3] < -pad.options.deadzone) {
							return {
								strength: Math.abs(pad.raw.axes[3])
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'right.stick.down': {
					'standard': function(pad) {
						if(pad.raw.axes[3] > pad.options.deadzone) {
							return {
								strength: Math.abs(pad.raw.axes[3])
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'right.stick.left': {
					'standard': function(pad) {
						if(pad.raw.axes[2] < -pad.options.deadzone) {
							return {
								strength: Math.abs(pad.raw.axes[2])
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'right.stick.right': {
					'standard': function(pad) {
						if(pad.raw.axes[2] > pad.options.deadzone) {
							return {
								strength: Math.abs(pad.raw.axes[2])
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'dpad.up': {
					'standard': function(pad) {
						if(pad.raw.buttons[12].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[12].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'dpad.down': {
					'standard': function(pad) {
						if(pad.raw.buttons[13].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[13].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'dpad.left': {
					'standard': function(pad) {
						if(pad.raw.buttons[14].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[14].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'dpad.right': {
					'standard': function(pad) {
						if(pad.raw.buttons[15].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[15].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'button.north': {
					'standard': function(pad) {
						if(pad.raw.buttons[3].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[3].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'button.south': {
					'standard': function(pad) {
						if(pad.raw.buttons[0].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[0].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'button.west': {
					'standard': function(pad) {
						if(pad.raw.buttons[2].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[2].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'button.east': {
					'standard': function(pad) {
						if(pad.raw.buttons[1].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[1].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'button.start': {
					'standard': function(pad) {
						if(pad.raw.buttons[9].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[9].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'button.select': {
					'standard': function(pad) {
						if(pad.raw.buttons[8].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[8].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'button.guide': {
					'standard': function(pad) {
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'left.shoulder.front': {
					'standard': function(pad) {
						if(pad.raw.buttons[4].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[4].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'left.shoulder.back': {
					'standard': function(pad) {
						if(pad.raw.buttons[6].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[6].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'right.shoulder.front': {
					'standard': function(pad) {
						if(pad.raw.buttons[5].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[5].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				},
				'right.shoulder.back': {
					'standard': function(pad) {
						if(pad.raw.buttons[7].value > pad.options.deadzone) {
							return {
								strength: pad.raw.buttons[7].value
							};
						}
						return false;
					},
					'ios': function(pad) {
						return false;
					},
					'android': function(pad) {
						return false;
					}
				}
			}
		};

	// Event objects.
	function PadInputEvent() {
		var self = this;
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
		padCnt = 0, // Reported connection count.
		padEvt = 0, // Each event that the pad currently handles.
		evtRslt = {}, // Result of event test.
		retEvt = new PadInputEvent(), // Event given to callback.
		evtProp = {}; // Each property returned by the event test.

	// Main loop function.
	var padPoll = function() {
			if(!Pads.length) {
				return false;
			}

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

			// Test data from poll.
			Pads.forEach(testPadEvents);

			// Poll again at next frame.
			requestAnimationFrame(padPoll);
		},

		// Go through Pads, test for and possibly fire subscribed events.
		testPadEvents = function(pad, i) {
			pad.raw = realPads[i] || null;

			// Pad no longer exists.
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
				evtRslt = pad.mapping[padEvt][supports](pad);

				// The event returned a truthy result, which means it fired.
				if(evtRslt) {
					retEvt = new PadInputEvent();

					// Add event properties to event object.
					for(evtProp in evtRslt) {
						retEvt[evtProp] = evtRslt[evtProp];
					}
					retEvt.type = padEvt;

					if(typeof pad.events[padEvt] === 'function') {
						pad.events[padEvt].call(pad, retEvt);
					} else if(pad.state in pad.events[padEvt]) {
						pad.events[padEvt][pad.state].call(pad, retEvt);
					} else {
						pad.events[padEvt]['default'].call(pad, retEvt);
					}
				}
			}
		};
})();