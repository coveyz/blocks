module.exports = () => ({
	type: 'input',
	name: 'packageName',
	message: 'set package name',
	validate(val) {
		if (val) return true;
		return 'please enter package name';
	},
});
