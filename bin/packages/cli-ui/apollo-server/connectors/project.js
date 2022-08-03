const fs = require('fs');
// Context
const getContext = require('../context');
const { chalk } = require('../../utils/tools');

let currentProject = null;
let creator = null;

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

function autoClean(projects, context) {
	const result = [];

	for (const project of projects) {
		if (fs.existsSync(project.path)) {
			result.push(project);
			console.log('project-push=>', result);
		}
	}

	if (result.length !== projects.length) {
		console.log(`Auto cleaned ${projects.length - result.length} projects (folder not found).`);
		context.db.set('projects', result).write();
	}

	return result;
}

function list(context) {
	let projects = context.db.get('projects').value();
	projects = autoClean(projects, context);
	// console.log('apollo-list=>', projects);
	return projects;
}

// Open last project
async function autoOpenLastProject() {
	const context = getContext();
	const id = context.db.get('config.lastOpenProject').value();
	if (id) {
		try {
			console.log('todo-autoOpenLastProject-open');
		} catch (error) {
			log("Project can't be auto-opened", error);
		}
	}
}

function initCreator() {}

async function getCreation(context) {
	return console.log('todo-getCreation', context);
	if (!creator) {
		creator = await initCreator();
	}
	// return generateProjectCreation(creator)
}

autoOpenLastProject();

module.exports = {
	getCurrent,
	list,
	getCreation,
};
