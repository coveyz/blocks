#!/usr/bin/env node
const program = require('commander');
const pkg = require('../package.json');
const createProject = require('./lib/create');
//* 查看版本号
program.version(pkg.version, '-V, --version').usage('<command> [options]');
//* 命令行创建
program
	.command('create <name>')
	.description('start build project 🚀')
	.action((name) => {
		// console.log('cli-name', name);
		createProject(name);
	});

program
	.command('ui')
	.description('GUI Project🖌️')
	.option('-f --other <other>', 'meiyong')
	.action((options) => {
		require('./lib/ui')(options);
	});

program.parse();

return;
//* 作废代码
program
	.command('start <qq>')
	.option('-f --qq <name>', 'Fruit to be added')
	.option('-x --xx <name>', 'Fruit to beb added')
	.description('Start cooking food')
	.action((food, options) => {
		console.log(`run start command`);
		console.log(`argument ${food}`);
		console.log(`option fruit=${JSON.stringify(options)}`);
	});
