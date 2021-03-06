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
		// console.log('addπππππbefore=>', task);
		if (Array.isArray(task)) {
			this.taskList.push(...task);
		} else {
			this.taskList.push(task);
		}
		// console.log('addπππππafter=>', this.taskList);
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
		//* ζδ»Άε€Ή
		await this.executeTaskByType(FolderTask.type);
		await this.executeTaskByType(FileTask.type);
		await this.executeTaskByType(CopyTask.type);
	}

	async executeTaskByType(commandType) {
		const commandTasks = this.getTaskBytype(commandType);

		for (const task of commandTasks) {
			log(chalk['blue'](`ε½εζ§θ‘ηδ»»ε‘: ${chalk['red'](`${task.name}`)}`));
			await task.execute();
		}
	}
};
