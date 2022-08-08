const EventEmitter = require('events');
const { loadOptions } = require('./Options');

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
		this.injectedPrompts = [];
		this.run = this.run.bind(this);
	}
	async create(cliOptions = {}, preset = null) {
		console.log('create=>');
	}
	getPresets() {
		const saveOptions = loadOptions();
		console.log('getPresets=>', saveOptions);
		return Object.assign({}, saveOptions.presets, defaults.presets);
	}
	run(command, args) {
		console.log('Createpr-run=>', command, args);
	}
}

module.exports = {
	Creator,
	defaults,
	defaultPreset,
};
