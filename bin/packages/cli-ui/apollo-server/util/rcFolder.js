const fs = require('fs-extra');
const path = require('path');
const os = require('os');

const migrateWindowsConfigPath = (file) => {
	if (process.platform !== 'win32') return;
	//todo win32 情况
	const appData = process.env.APPDATA;
	console.log('todo migrateWindowsConfigPath win32-appData->', appData);
};

const xdgConfigPath = (file) => {
	const xdgConfigHome = process.env.XDG_CONFIG_HOME;
	if (xdgConfigHome) {
		console.log('todo xdgConfigPath-xdgConfigHome->', xdgConfigHome, 'file=>', file);
	}
};

const getRcPath = (file) => {
	migrateWindowsConfigPath(file);
	if (process.env.BLOCK_CLI_CONFIG_PATH) console.log('config-path=>', process.env.BLOCK_CLI_CONFIG_PATH);
	return process.env.BLOCK_CLI_CONFIG_PATH || xdgConfigPath(file) || path.join(os.homedir(), file);
};

let folder;

if (process.env.BLOCK_CLI_UI_TEST) {
	console.log('todo=> BLOCK_CLI_UI_TEST');
} else if (process.env.BLOCK_APP_CLI_UI_DEV) {
	console.log('todo=> BLOCK_APP_CLI_UI_DEV');
} else {
	folder = (process.env.BLOCK_CLI_UI_DB_PATH && path.resolve(__dirname, process.env.BLOCK_CLI_UI_DB_PATH)) || getRcPath('.block-cli-ui');
}

//* 创建文件夹
fs.ensureDirSync(path.resolve(__dirname, folder));

module.exports = {
	rcFolder: folder,
	getRcPath: getRcPath,
};
