const chalk = require('chalk');

const exitProcess = !process.env.VUE_CLI_API_MODE && !process.env.VUE_CLI_TEST;

const exit = (code) => {
	if (exitProcess) {
		process.exit(code);
	} else if (code > 0) {
		throw new Error(`Process exited with code ${code}`);
	}
};

const validata = (obj, schema, cb) => {
	const { error } = schema.validata(obj);

	if (error) {
		cb(error.details[0].message);
		if (process.env.VUE_CLI_TEST) {
			throw error;
		} else {
			exit(1);
		}
	}
};

module.exports = {
	chalk: chalk,
	validata,
	exit,
};
