const fs = require('fs');
// Context
const getContext = require('../context');
const { chalk } = require('../../utils/tools');
const { Creator } = require('../../utils/Creator');
const { getPromptModules } = require('../../utils/createTools');

//* Connectors
const cwd = require('./cwd');
const progress = require('./progress');
const prompts = require('./prompts');

const PROGRESS_ID = 'project-create';
const pluginRE = /^(@vue\/|vue-|@[\w-]+(\.)?[\w-]+\/vue-)cli-plugin-/;
const toShortPluginId = (id) => id.replace(pluginRE, '');
const getFeatures = (preset) => {
	const features = [];
	if (preset.router) {
		features.push('router');
	}
	if (preset.vuex) {
		features.push('vuex');
	}
	if (preset.cssPreprocessor) {
		features.push(preset.cssPreprocessor);
	}
	const plugins = Object.keys(preset.plugins).filter((dep) => {
		return dep !== '@vue/cli-service';
	});
	features.push.apply(features, plugins);
	return features;
};

let currentProject = null;
let creator = null;
let onCreationEvent = null;
let presets = [];
let features = [];

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

function generateProjectCreation() {
	return {
		presets,
		features,
	};
}

function generatePresetDescription(preset) {
	let description = `[Vue ${preset.raw.vueVersion || 2}] `;

	description += preset.features.join(', ');
	if (preset.raw.useConfigFiles) {
		description += ' (Use config files)';
	}
	return description;
}

// 手动 preset
const manualPreset = {
	id: '__manual__',
	name: '手动',
	description: '手动配置项',
	link: null,
	features: [],
};

async function initCreator(context) {
	// const creator = new Creator('', cwd.get(), getPromptModules())
	// console.log('init');
	const creator = new Creator('', cwd.get(), getPromptModules());
	// console.log('initCreator=>', creator);

	// 发出创建事件
	onCreationEvent = ({ event }) => {
		console.log('onCreationEvent=>');
		progress.set({ id: PROGRESS_ID, status: event, info: null }, context);
	};

	creator.on('create', onCreationEvent);

	const presetsData = creator.getPresets();
	// console.log('presetsData=?', presetsData);
	// console.log('keys=>?', Object.keys(presetsData));
	presets = [
		...Object.keys(presetsData).map((key) => {
			const preset = presetsData[key];
			const features = getFeatures(preset).map((f) => toShortPluginId(f));
			let name = key;
			if (key === 'default') {
				name = 'org.vue.views.project-create.tabs.presets.default-preset';
			} else if (key === '__default_vue_3__') {
				name = 'org.vue.views.project-create.tabs.presets.default-preset-vue-3';
			}
			const info = {
				id: key,
				name,
				features,
				link: null,
				raw: preset,
			};
			info.description = generatePresetDescription(info);
			return info;
		}),
		manualPreset,
	];
	// console.log('presets=>', presets);
	// await prompts.reset()

	// Features
	const featuresData = creator.featurePrompt.choices;

	features = [
		...featuresData.map((data) => ({
			id: data.value,
			name: data.name,
			description: data.description || null,
			link: data.link || null,
			plugins: data.plugins || null,
			enabled: !!data.checked,
		})),
		{
			id: 'use-config-files',
			name: '使用配置文件',
			description: `将插件的配置保存在各自的配置文件 (比如 '.babelrc') 中。`,
			link: null,
			plugins: null,
			enabled: false,
		},
	];

	manualPreset.features = features.filter((f) => f.enabled).map((f) => f.id);
	// console.log('featuresData=>', featuresData);
	// console.log('features=>', features);

	await prompts.reset();
	creator.injectedPrompts.forEach(prompts.add);
	await updatePromptsFeatures();
	prompts.start();

	return creator;
}

async function updatePromptsFeatures() {
	await prompts.changeAnswers((answers) => {
		answers.features = features.filter((f) => f.enabled).map((f) => f.id);
	});
}

async function getCreation(context) {
	if (!creator) {
		creator = await initCreator(context);
	}

	return generateProjectCreation(creator);
}

autoOpenLastProject();

module.exports = {
	getCurrent,
	list,
	getCreation,
};
