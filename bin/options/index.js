const inquirer = require('inquirer');
const packageName = require('./questions/package-name');
const middlewares = require('./questions/select-middles');

//* 根据传进来的配置文件中middlewares 生成Map
const handleOptions = (options) => {
	const result = Object.assign({}, options);

	result.middlewareMap = result.middlewares.reduce((acc, cur) => {
		acc[cur] = true;
		return acc;
	}, {});

	result.maxMiddles = middlewares()['choices'].length;

	return result;
};

//* 获取配置文件
module.exports = async () => {
	const answer = await inquirer.prompt([packageName(), middlewares()]);
	return handleOptions(answer);
};
