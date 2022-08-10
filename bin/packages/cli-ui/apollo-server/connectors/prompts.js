let answers = {},
	prompts = [];

async function getEnabled(value) {
	console.log('getEnabled=>', value);
	const type = typeof value;
	// console.group('getEnabled-answer', answers);
	// console.group('getEnabled-type', type);
	if (type === 'function') {
		const result = await value(answers);
		// console.log('getEnabled-result=>', result);
		return !!result;
	} else if (type === 'boolean') {
		return value;
	} else {
		return true;
	}
}

async function getChoices(prompt) {
	const data = prompt.raw.choices;
	console.log('getChoices=>', data);
	if (!data) return null;
	console.log('todo=>getChoices=>data', data);
}

async function updatePrompts() {
	for (const prompt of prompts) {
		console.log('updatePrompts-before-prompt->>', prompt);
		const oldVisible = prompt.visible;
		prompt.visible = await getEnabled(prompt.raw.when);
		prompt.choices = await getChoices(prompt);
		console.log('updatePrompts-after-prompt', prompt);

		if (oldVisible !== prompt.visible && !prompt.visible) {
			console.log('todo-remove', prompt.id);
		} else if (prompt.visible && !prompt.valueChanged) {
			console.log('todo??updatePrompts??', prompt);
		}
	}

	console.log('Prompt answers=>', answers);
}

function generatePrompt(data) {
	return {
		id: data.name,
		type: data.type,
		visible: true,
		enabled: true,
		name: data.short || null,
		message: data.message,
		group: data.group || null,
		description: data.description || null,
		link: data.link || null,
		choices: null,
		value: null,
		valueChanged: false,
		error: null,
		tabId: data.tabId || null,
		raw: data,
	};
}

// Public Api
async function start() {
	await updatePrompts();
}

async function reset(answer = {}) {
	prompts = [];
	await setAnswers(answer);
}

async function setAnswers(newAnswers) {
	answer = newAnswers;
	await updatePrompts();
}

function add(data) {
	console.log('prompt-add->data=>', data);
	const prompt = generatePrompt(data);
	prompts.push(prompt);
	return prompt;
}

async function changeAnswers(cb) {
	cb(answers);
	await updatePrompts();
}

module.exports = {
	start,
	reset,
	setAnswers,
	add,
	changeAnswers,
};
