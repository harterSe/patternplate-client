#!/usr/bin/env node

import 'babel-polyfill';
import minimist from 'minimist';

import patternClient from '../';

async function main(options = {}) {
	let application;

	try {
		application = await patternClient(options);
	} catch (err) {
		console.trace(err);
		throw new Error(err);
	}

	try {
		await application.start();
	} catch (err) {
		application.log.error(err);
		throw new Error(err);
	}
}

const args = minimist(process.argv.slice(1));

main(args)
	.catch(err => {
		setTimeout(() => {
			throw err;
		});
	});

// Catch unhandled rejections globally
process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at: Promise ', promise, ' reason: ', reason);
	throw reason;
});
