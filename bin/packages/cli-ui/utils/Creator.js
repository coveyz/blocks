const EventEmitter = require('events');
const { loadOptions } = require('./Options');
const PromptModuleAPI = require('./PromptModuleAPI');

const isManualMode = (answers) => answers.preset === '__manual__';

const defaultPreset = {
	useConfigFiles: false,
	cssPreprocessor: undefined,
	plugins: {
		'@vue/cli-plugin-babel': {},
		'@vue/cli-plugin-eslint': {
			config: 'base',
			lintOn: ['save'],
		},
	},
};

const defaults = {
	lastChecked: undefined,
	latestVersion: undefined,

	packageManager: undefined,
	useTaobaoRegistry: undefined,
	presets: {
		'Default (Vue 3)': Object.assign({ vueVersion: '3' }, defaultPreset),
		'Default (Vue 2)': Object.assign({ vueVersion: '2' }, defaultPreset),
	},
};

class Creator extends EventEmitter {
	constructor(name, context, promptModules) {
		super();
		this.name = name;
		this.context = process.env.VUE_CLI_CONTEXT = context;
		const { presetPrompt, featurePrompt } = this.resolveIntroPrompts();

		this.presetPrompt = presetPrompt;
		this.featurePrompt = featurePrompt;

		this.injectedPrompts = [];
		this.promptCompleteCbs = [];
		this.run = this.run.bind(this);

		const promptAPI = new PromptModuleAPI(this);
		console.log('promptModules=>', promptModules);
		promptModules.forEach((m) => {
			console.log('m=>', m);
			console.log('promptAPI=>', promptAPI);
			return m(promptAPI);
		});
	}
	async create(cliOptions = {}, preset = null) {
		console.log('Creator-create=>');
	}
	getPresets() {
		const saveOptions = loadOptions();
		console.log('getPresets=>', saveOptions);
		return Object.assign({}, saveOptions.presets, defaults.presets);
	}
	run(command, args) {
		console.log('Createpr-run=>', command, args);
	}
	resolveIntroPrompts() {
		const presetPrompt = {};
		const featurePrompt = {
			name: 'features',
			when: isManualMode,
			type: 'checkbox',
			message: 'Check the features needed for your project',
			choices: [],
			pageSize: 10,
		};

		return {
			presetPrompt,
			featurePrompt,
		};
	}
}

module.exports = {
	Creator,
	defaults,
	defaultPreset,
};
