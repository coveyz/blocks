const path = require('path');
const fs = require('fs-extra');
const ejs = require('ejs');
const chalk = require('chalk');

const { FileTask, CopyTask } = require('../task');

/**
 ** 获取当前 component 文件
 * @param {string} root
 * @returns {{[key:string]: []}}
 */
const getMiddlewaretaskMap = (root) => {
	const compPath = `${root}/src/components`; //* 注入 模版项目地址 🙊
	const tmpPath = `../template/Vue`; //* 项目模版地址 🐽

	const createComponentEntryFile = (compname) => {
		const curCompTemplatePath = path.resolve(__dirname, `${tmpPath}/${compname}`);
		const isExit = fs.pathExistsSync(curCompTemplatePath);

		if (isExit) {
			return new CopyTask({
				templatePath: curCompTemplatePath,
				name: `create ${compname}`,
				path: `${compPath}/${compname}`,
			});
		} else {
			console.log(chalk.red(`当前模版文件 ${compname} 不存在😢`));
		}
	};

	return {
		search: [createComponentEntryFile('Search')],
		table: [createComponentEntryFile('Table')],
		formdata: [createComponentEntryFile('Formdata')],
	};
};

//* 🦆 components/index.js -> components入口 🦆
const createComponentsEntry = (root, op) => {
	const templatePath = path.resolve(__dirname, '../template/JavaScript/componentEntry.ejs');
	const templateCode = fs.readFileSync(templatePath);
	const processCode = ejs.render(templateCode.toString(), op);

	return new FileTask({
		content: processCode,
		filename: 'index.js',
		name: `create components entry ponit index.js`,
		path: `${root}/src/components`,
	});
};

const ceateComponentsFile = (op, root) => {
	const map = getMiddlewaretaskMap(root);

	//* 组件
	const list = op.middlewares.reduce((acc, cur) => {
		const task = map[cur];

		if (task) {
			acc.push(...task);
		} else {
			console.log(chalk.red(`当前模版文件 ${cur} 不存在😭`));
		}
    
		return acc;
	}, []);

	//* 如见 components 文件夹 入口文件 index.js
	const componentEntry = createComponentsEntry(root, op);

	// console.log('🐻🐻🐻🐻🐻🐻🐻', componentEntry);
	list.push(componentEntry);
	// console.log('list=>', list);
	return list;
};

module.exports = ceateComponentsFile;
