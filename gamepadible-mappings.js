(function() {
	"use strict";

	// Input mappings.
	window.Pad.mappings = {
		traditional: {
			'left.stick.move': {
				'standard': function(pad) {
					if(pad.raw.keyCode) {
						return {
							strength: null,
							heading: null
						};
					}

					var v = pad.raw.axes[1],
						h = pad.raw.axes[0],
						strength =
							Math.sqrt(
								Math.pow(v,2)
								+ Math.pow(h,2)
							),
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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
			'left.stick.button': {
				'standard': function(pad) {
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

					if(pad.raw.buttons[10].value > pad.options.deadzone) {
						return {
							strength: pad.raw.buttons[10].value
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
					if(pad.raw.keyCode) {
						return {
							strength: null,
							heading: null
						};
					}

					var v = pad.raw.axes[3],
						h = pad.raw.axes[2],
						strength =
							Math.sqrt(
								Math.pow(v,2)
								+ Math.pow(h,2)
							),
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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
			'right.stick.button': {
				'standard': function(pad) {
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

					if(pad.raw.buttons[11].value > pad.options.deadzone) {
						return {
							strength: pad.raw.buttons[11].value
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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
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
			'left.shoulder.front': {
				'standard': function(pad) {
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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
					if(pad.raw.keyCode) {
						return {
							strength: 1
						};
					}

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

	window.Pad.addEventTest = function(mapping, event, test) {
		if(!(mapping in window.Pad.mappings)) {
			window.Pad.mappings[mapping] = {};
		}

		window.Pad.mappings[mapping][event] = test;
	};
	window.Pad.addMapping = function(name, mapping) {
		window.Pad.mappings[name] = mapping;
	};
})();