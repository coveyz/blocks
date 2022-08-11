const fs = require('fs');
const cloneDeep = require('lodash.clonedeep');
const { getRcPath } = require('./rcPath');
const { validata } = require('../utils/tools');

// const rcPath = getRcPath('.vuerc'); //todo
const rcPath = getRcPath('.blockrc'); //todo
let cacheOptions;

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

function loadOptions() {
	console.log('loadOptions-cacheOptions=>', cacheOptions);
	if (cacheOptions) return cacheOptions;
	console.log('loadOptions-rcPath=>', rcPath);
	if (fs.existsSync(rcPath)) {
		try {
			cachedOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
			console.log('loadOptions-fscontent-cachedOptions=>', cachedOptions);
		} catch (error) {
			console.log('xxxxx bobob');
		}
		return cachedOptions;
	} else {
		console.log('没有这个文件 ' + rcPath);
		return {};
	}
}

function validatePreset(preset) {
	//todo
	console.log('todo validatePreset', preset);
}

function saveOptions(toSave) {
	const options = Object.assign(cloneDeep(loadOptions()), toSave);
	console.log('Options-saveOptions-options=>', options);

	for (const key in options) {
		console.log('key=>', key);
		if (!(key in defaults)) {
			delete options[key];
		}
		console.log('delete-after', options);
		cacheOptions = options;

		try {
			const code = JSON.stringify(options, null, 2);
			// console.log('saveOptions-code=>', code);
			// console.log('write-path=>', rcPath);
			fs.writeFileSync(rcPath, code);
			return true;
		} catch (e) {
			console.error(`Error saving preferences: ` + `make sure you have write access to ${rcPath}.\n` + `(${e.message})`);
		}
	}
}

function savePreset(name, preset) {
	// console.log('Options-savePreset->name', name);
	// console.log('Options-savePreset->preset', preset);

	// console.log('loadOptions.presets===>', loadOptions().presets);
	const presets = cloneDeep(loadOptions().presets || {});
	// console.log('savePreset-preset=>', presets);
	presets[name] = preset;

	return saveOptions({ presets });
}

module.exports = {
	rcPath,
	loadOptions,
	defaultPreset,
	defaults,
	validatePreset,
	savePreset,
};
