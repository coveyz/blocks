const chalk = require('chalk');
const clear = require('clear');
const path = require('path');

const getOptions = require('../options');
const { downloadTemplate } = require('../utils/tools');
const { FolderTask, TaskManager } = require('../task');
const createCompnentFile = require('../function/create-component-file');

const log = (content) => console.log(chalk['green'](content));
let options = null;

// (async () => {
// 	clear();
// 	//* 获取配置文件
// 	options = await getOptions();

// 	log(JSON.stringify(options));

// 	const { middlewares, maxMiddles } = options;

// 	const len = middlewares.length;
// 	//* 1.0.0 如果 middlewares 为空 拉取模版项目
// 	if (len === 0) {
// 		await downloadTemplate(options, 'template');
// 	}
// 	//* 2.0.0如果 middlewares 长度 === 所有配置项的长度   直接拉取完整项目
// 	else if (len === maxMiddles) {
// 		await downloadTemplate(options);
// 	}
// 	//* 3.0.0其他 先拉取模版项目，
// 	//* 3.1.0再进行改造
// 	else {
// 		try {
// 			// await downloadTemplate(options, 'template');
// 			const task = new TaskManager();
// 			task.add(createComponentsPackageTask()); //✅ 创建 components 文件夹
// 			task.add(createCompnentFile(options, getRoot())); //✅ 创建勾选组件 -> 现在只是简单的组件文件 -> //todo 递归创建 整个文件夹下的所有文件

// 			await task.execute();
// 			log(chalk.hex('#7FFF00').bold(`cd ./${options.packageName} && nodemon index.js`));
// 			log(chalk.hex('#DEADED').bold('happy every day -_-#'));
// 		} catch (error) {
// 			log(error);
// 		}
// 	}
// })();

//* 获取项目根路径
const getRoot = () => {
	return path.resolve(__dirname, process.cwd(), options.packageName);
};

//* 创建 components 文件夹
const createComponentsPackageTask = () => {
	return new FolderTask({
		name: 'create components folder',
		filename: 'components',
		path: `${getRoot()}/src`,
	});
};

module.exports = async function create(name) {
	clear();
	//* 获取配置文件
	options = await getOptions();

	console.log('cliname=>', name);
	options.packageName = name;
	log(JSON.stringify(options));

	const { middlewares, maxMiddles } = options;

	const len = middlewares.length;
	//* 1.0.0 如果 middlewares 为空 拉取模版项目
	if (len === 0) {
		await downloadTemplate(options, 'template');
	}
	//* 2.0.0如果 middlewares 长度 === 所有配置项的长度   直接拉取完整项目
	else if (len === maxMiddles) {
		await downloadTemplate(options);
	}
	//* 3.0.0其他 先拉取模版项目，
	//* 3.1.0再进行改造
	else {
		try {
			await downloadTemplate(options, 'template');
			const task = new TaskManager();
			task.add(createComponentsPackageTask()); //✅ 创建 components 文件夹
			task.add(createCompnentFile(options, getRoot())); //✅ 创建勾选组件 -> 现在只是简单的组件文件 -> //todo 递归创建 整个文件夹下的所有文件

			await task.execute();
			log(chalk.hex('#7FFF00').bold(`cd ./${options.packageName} `));
			log(chalk.hex('#DEADED').bold('happy every day -_-#'));
		} catch (error) {
			log(error);
		}
	}
};
