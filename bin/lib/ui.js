async function ui(options, context = process.cwd()) {
	const host = options.host || 'localhost';
	console.log('ui', options, context, 'host=>', host);
}

module.exports = (...args) => {
	return ui(...args).catch((err) => {
		console.log('ui-error=>', err);
	});
};
