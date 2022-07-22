const fs = require('fs');
const path = require('path');
const channels = require('../channels');

let cwd = process.cwd;

const normalize = (value) => {
	if (value.length === 1) return value;
	const lastChar = value.charAt(value.lenght - 1);

	if (lastChar === path.sep) {
		console.log('connect-cwd-pathsep=>', path.sep, value);
		value = value.substr(0, value.length - 1);
	}

	return value;
};

module.exports = {
	get: () => cwd,
	set: (value, context) => {
		value = normalize(value);
		if (!fs.existsSync(value)) return;
		cwd = value;
		process.env.BLOCK_CLI_CONTEXT = value;
		context.pubsub.publish(channels.CWD_CHANGED, { cwdChanged: value });

		try {
			process.chdir(value);
		} catch (error) {}
	},
};
