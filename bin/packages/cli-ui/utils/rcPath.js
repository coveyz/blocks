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
	return process.env.BLOCK_CLI_CONFIG_PATH || xdgConfigPath(file) || path.join(os.homedir(), file);
};

module.exports = {
	getRcPath,
};
