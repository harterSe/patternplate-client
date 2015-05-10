#!/usr/bin/env node --harmony
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('babel-core/polyfill');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _ = require('../');

var _2 = _interopRequireDefault(_);

'use strict';

var args = _minimist2['default'](process.argv.slice(1));

function start() {
	var options = arguments[0] === undefined ? {} : arguments[0];
	var application, stop;
	return regeneratorRuntime.async(function start$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				stop = function stop() {
					return regeneratorRuntime.async(function stop$(context$2$0) {
						while (1) switch (context$2$0.prev = context$2$0.next) {
							case 0:
								context$2$0.prev = 0;
								context$2$0.next = 3;
								return application.stop();

							case 3:
								process.exit(0);
								context$2$0.next = 10;
								break;

							case 6:
								context$2$0.prev = 6;
								context$2$0.t14 = context$2$0['catch'](0);

								application.log.error(context$2$0.t14);
								process.exit(1);

							case 10:
							case 'end':
								return context$2$0.stop();
						}
					}, null, this, [[0, 6]]);
				};

				application = undefined;
				context$1$0.prev = 2;
				context$1$0.next = 5;
				return _2['default'](options);

			case 5:
				application = context$1$0.sent;
				context$1$0.next = 12;
				break;

			case 8:
				context$1$0.prev = 8;
				context$1$0.t15 = context$1$0['catch'](2);

				console.trace(context$1$0.t15);
				throw new Error(context$1$0.t15);

			case 12:
				context$1$0.prev = 12;
				context$1$0.next = 15;
				return application.start();

			case 15:
				context$1$0.next = 21;
				break;

			case 17:
				context$1$0.prev = 17;
				context$1$0.t16 = context$1$0['catch'](12);

				application.log.error(context$1$0.t16);
				throw new Error(context$1$0.t16);

			case 21:

				process.on('SIGINT', function () {
					return stop('SIGINT');
				});
				process.on('SIGHUP', function () {
					return stop('SIGHUP');
				});
				process.on('SIGQUIT', function () {
					return stop('SIGQUIT');
				});
				process.on('SIGABRT', function () {
					return stop('SIGABRT');
				});
				process.on('SIGTERM', function () {
					return stop('SIGTERM');
				});

			case 26:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this, [[2, 8], [12, 17]]);
}

start(args);