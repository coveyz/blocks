async function ui(options, context = process.cwd()) {
	console.log('ui', options, context);
}

module.exports = (...args) => {
	return ui(...args).catch((err) => {
		console.log('ui-error=>', err);
	});
};
