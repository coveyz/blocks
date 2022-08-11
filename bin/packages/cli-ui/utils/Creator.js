const debug = require('debug');
const EventEmitter = require('events');
const { loadOptions, defaults, validatePreset, savePreset, rcPath } = require('./Options');
const PromptModuleAPI = require('./PromptModuleAPI');
const { chalk } = require('../utils/tools');

const isManualMode = (answers) => answers.preset === '__manual__';

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
		1;
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
	// 提示 和 解析预设
	promptAndResolvePreset(answers = null) {
		console.log('Creator-promptAndResolvePreset-answers=>', answers);
		// prompt
		if (!answers) {
			console.log('todo-promptAndResolvePreset-!answers=> false');
		}
		debug('vue-cli:answers')(answers);
		if (answers.packageManager) {
			console.log('todo-promptAndResolvePreset-packageManager-saveOptions');
		}

		let preset;
		if (answers.preset && answers.preset !== '__manual__') {
			console.log('todo-promptAndResolvePreset-resolvePreset--answers[preset]', answers[preset]);
		} else {
			preset = {
				useConfigFiles: answers.useConfigFiles === 'files',
				plugins: {},
			};
			answers.features = answers.features || [];
			// 运行提示模块注册的cb以完成预设
			console.log('gogogogo->__manual__->promptCompleteCbs', this.promptCompleteCbs);
			this.promptCompleteCbs.forEach((cb) => cb(answers, preset));
		}
		console.log('promptAndResolvePreset-preset=>', preset);

		// validate
		validatePreset(preset); //todo

		// save preset
		if (answers.save && answers.saveName && savePreset(answers.saveName, preset)) {
			console.log();
			console.log(`🎉  Preset ${chalk.yellow(answers.saveName)} saved in ${chalk.yellow(rcPath)}`);
		}
	}
}

module.exports = {
	Creator,
};
