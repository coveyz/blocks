const {
	CONSOLE_LOG_ADDED,
} = require('../../../../../../../../../../NodeJS/开课吧027/project/vue-cli/packages/@vue/cli-ui/apollo-server/channels');

module.exports = (cli) => {
	cli.injectFeature({
		name: 'Babel',
		value: 'babel',
		short: 'Babel',
		description: 'Transpile modern JavaScript to older versions (for compatibility)',
		link: 'https://babeljs.io/',
		checked: true,
	});

	cli.onPromptComplete((answers, options) => {
		if (answers.features.includes('ts')) {
			if (!answers.useTsWithBabel) {
				return;
			}
		} else if (!answers.features.includes('babel')) {
			return;
		}
		// console.log('babel->onPromptComplete->answer', answers);
		// console.log('babel->onPromptComplete->options', options);
		options.plugins['@vue/cli-plugin-babel'] = {};
	});
};
