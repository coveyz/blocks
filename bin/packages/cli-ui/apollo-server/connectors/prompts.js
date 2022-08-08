let answers = {},
	prompts = [];

async function updatePrompts() {
	for (const prompt of prompts) {
		console.log('todo-updatePrompts>', prompt);
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
	const prompt = generatePrompt(data);
	prompts.push(prompt);
	return prompt;
}

async function changeAnswers(cb) {
  cb(answers);
  await updatePrompts()
}

module.exports = {
	start,
	reset,
	setAnswers,
	add,
  changeAnswers
};
