const fs = require('fs-extra');
const path = require('path');
const BaseTask = require('../BaseTask');

module.exports = class CopyTask extends BaseTask {
	static type = 'copy';
	constructor({ path, name, templatePath }) {
		super(CopyTask.type, name);
		this.templatePath = templatePath;
		this.path = path;
	}

	getFullPath(address) {
		return path.resolve(address);
	}

	execute() {
		return fs.copySync(this.getFullPath(this.templatePath), this.getFullPath(this.path));
	}
};
