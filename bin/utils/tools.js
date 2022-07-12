const path = require('path');
const chalk = require('chalk');

const clone = require('./download');

const log = (content) => console.log(chalk['green'](content));
const getRoot = (options) => {
	return path.resolve(__dirname, process.cwd(), options.packageName);
};

module.exports = {
	downloadTemplate: async (options, type) => {
		log(`🚀创建项目:${options.packageName}`);
		if (type === 'template') {
			await clone('github:su37josephxia/vue-template', getRoot(options));
		} else {
			await clone('github:PanJiaChen/vue-admin-template', getRoot(options));
		}
		log(`下载成功 💪`);
	},
	titleCase: (str) => {
		return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
	},
};
