const fs = require('fs');
const { chalk } = require('../../utils/tools');

let currentProject = null;

const log = (...args) => {
	if (!process.env.VUE_APP_CLI_UI_DEBUG) return;
	const date = new Date();
	const timestamp = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}.${date
		.getSeconds()
		.toString()
		.padStart(2, '0')}`;
	const first = args.shift();
	console.log(`${chalk.blue('UI')} ${chalk.dim(timestamp)}`, chalk.bold(first), ...args);
};

function getCurrent(context) {
	if (currentProject && !fs.existsSync(currentProject.path)) {
		log('Project folder not found', currentProject.id, currentProject.path);
		return null;
	}

	return currentProject;
}

module.exports = {
	getCurrent,
};
