module.exports = class PromptModuleAPI {
	constructor(creator) {
		console.log('PromptModuleAPI=>', creator);
		this.creator = creator;
	}
	injectFeature(feature) {
		console.log('PromptModuleAPI-injectFeature-feature=>', feature);
		this.creator.featurePrompt.choices.push(feature);
	}
	injectPrompt(prompt) {
		console.log('PromptModuleAPI-injectPrompt-prompt=>', prompt);
		this.creator.injectedPrompts.push(prompt);
	}
	injectOptionForPrompt(name, option) {
		console.log('PromptModuleAPI-injectOptionForPrompt-name=>', name);
		console.log('PromptModuleAPI-injectOptionForPrompt-option=>', option);
		this.creator.injectedPrompts.find((f) => f.name === name).choices.push(option);
	}
	onPromptComplete(cb) {
		console.log('PromptModuleAPI-onPromptComplete-cb=>', cb);

		this.creator.promptCompleteCbs.push(cb);
	}
};
