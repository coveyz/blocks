const chalk = require('chalk');

const { FolderTask } = require('../index');
const FileTask = require('../FileTask');
const CopyTask = require('../CopyTask');

const log = console.log;

module.exports = class TaskManage {
	constructor() {
		this.taskList = [];
	}
	add(task) {
		// console.log('add🐒🐒🐒🐒🐒before=>', task);
		if (Array.isArray(task)) {
			this.taskList.push(...task);
		} else {
			this.taskList.push(task);
		}
		// console.log('add🐒🐒🐒🐒🐒after=>', this.taskList);
	}
	size() {
		return this.taskList.length;
	}
	getTaskBytype(type) {
		// console.log('getTaskBytype====>', this.taskList);
		return this.taskList.filter((task) => {
			return task.getType() === type;
		});
	}
	async execute() {
		//* 文件夹
		await this.executeTaskByType(FolderTask.type);
		await this.executeTaskByType(FileTask.type);
		await this.executeTaskByType(CopyTask.type);
	}

	async executeTaskByType(commandType) {
		const commandTasks = this.getTaskBytype(commandType);

		for (const task of commandTasks) {
			log(chalk['blue'](`当前执行的任务: ${chalk['red'](`${task.name}`)}`));
			await task.execute();
		}
	}
};
