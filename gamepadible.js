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

		self.type = options.type;
		self.mapping = padMapping[options.type];
		self.remap = function(oldInput, newInput) {

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
	var padMapping = {
			traditional: {
				'left.stick.move': {
					'standard': function(pad, options) {
						var v = pad.axes[1],
							h = pad.axes[0],
							strength =
								Math.sqrt(
									Math.pow(v,2)
									+ Math.pow(h,2)
								),
							heading = 0;

						if(strength > options.deadzone) {
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
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'left.stick.up': {
					'standard': function(pad, options) {
						if(pad.axes[1] < -options.deadzone) {
							return {
								strength: Math.abs(pad.axes[1])
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'left.stick.down': {
					'standard': function(pad, options) {
						if(pad.axes[1] > options.deadzone) {
							return {
								strength: Math.abs(pad.axes[1])
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'left.stick.left': {
					'standard': function(pad, options) {
						if(pad.axes[0] < -options.deadzone) {
							return {
								strength: Math.abs(pad.axes[0])
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'left.stick.right': {
					'standard': function(pad, options) {
						if(pad.axes[0] > options.deadzone) {
							return {
								strength: Math.abs(pad.axes[0])
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'right.stick.move': {
					'standard': function(pad, options) {
						var v = pad.axes[3],
							h = pad.axes[2],
							strength =
								Math.sqrt(
									Math.pow(v,2)
									+ Math.pow(h,2)
								),
							heading = 0;

						if(strength > options.deadzone) {
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
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'right.stick.up': {
					'standard': function(pad, options) {
						if(pad.axes[3] < -options.deadzone) {
							return {
								strength: Math.abs(pad.axes[3])
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'right.stick.down': {
					'standard': function(pad, options) {
						if(pad.axes[3] > options.deadzone) {
							return {
								strength: Math.abs(pad.axes[3])
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'right.stick.left': {
					'standard': function(pad, options) {
						if(pad.axes[2] < -options.deadzone) {
							return {
								strength: Math.abs(pad.axes[2])
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'right.stick.right': {
					'standard': function(pad, options) {
						if(pad.axes[2] > options.deadzone) {
							return {
								strength: Math.abs(pad.axes[2])
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'dpad.up': {
					'standard': function(pad, options) {
						if(pad.buttons[12].value > options.deadzone) {
							return {
								strength: pad.buttons[12].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'dpad.down': {
					'standard': function(pad, options) {
						if(pad.buttons[13].value > options.deadzone) {
							return {
								strength: pad.buttons[13].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'dpad.left': {
					'standard': function(pad, options) {
						if(pad.buttons[14].value > options.deadzone) {
							return {
								strength: pad.buttons[14].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'dpad.right': {
					'standard': function(pad, options) {
						if(pad.buttons[15].value > options.deadzone) {
							return {
								strength: pad.buttons[15].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'button.north': {
					'standard': function(pad, options) {
						if(pad.buttons[3].value > options.deadzone) {
							return {
								strength: pad.buttons[3].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'button.south': {
					'standard': function(pad, options) {
						if(pad.buttons[0].value > options.deadzone) {
							return {
								strength: pad.buttons[0].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'button.west': {
					'standard': function(pad, options) {
						if(pad.buttons[2].value > options.deadzone) {
							return {
								strength: pad.buttons[2].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'button.east': {
					'standard': function(pad, options) {
						if(pad.buttons[1].value > options.deadzone) {
							return {
								strength: pad.buttons[1].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'button.start': {
					'standard': function(pad, options) {
						if(pad.buttons[9].value > options.deadzone) {
							return {
								strength: pad.buttons[9].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'button.select': {
					'standard': function(pad, options) {
						if(pad.buttons[8].value > options.deadzone) {
							return {
								strength: pad.buttons[8].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'button.guide': {
					'standard': function(pad, options) {
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'left.shoulder.front': {
					'standard': function(pad, options) {
						if(pad.buttons[4].value > options.deadzone) {
							return {
								strength: pad.buttons[4].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'left.shoulder.back': {
					'standard': function(pad, options) {
						if(pad.buttons[6].value > options.deadzone) {
							return {
								strength: pad.buttons[6].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'right.shoulder.front': {
					'standard': function(pad, options) {
						if(pad.buttons[5].value > options.deadzone) {
							return {
								strength: pad.buttons[5].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
						return false;
					}
				},
				'right.shoulder.back': {
					'standard': function(pad, options) {
						if(pad.buttons[7].value > options.deadzone) {
							return {
								strength: pad.buttons[7].value
							};
						}
						return false;
					},
					'ios': function(pad, options) {
						return false;
					},
					'android': function(pad, options) {
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
						connPads[padCnt].axes.length
						|| connPads[padCnt].buttons.length
					)
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

			// Test each subscribed event to see if it fired.
			for(padEvt in pad.events) {
				evtRslt = padMapping[pad.mapping][padEvt][supports](padInfo, pad.options);

				// The event returned a truthy result, which means it fired.
				if(evtRslt) {
					retEvt = new PadInputEvent();

					// Add event properties to event object.
					for(evtProp in evtRslt) {
						retEvt[evtProp] = evtRslt[evtProp];
					}
					retEvt.type = padEvt;

					pad.events[padEvt].call(pad, retEvt);
				}
			}
		};
})();