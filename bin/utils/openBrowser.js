const OSX_CHROME = 'google chrome';
const Actions = Object.freeze({
	NONE: 0,
	BROWSER: 1,
	SCRIPT: 2,
});

const getBrowserEnv = () => {
	//尝试遵守此环境变量。
	//它特定于操作系统。
	const value = process.env.BROWSER;
	let action;
	if (!value) {
		// 默认
		action = Actions.BROWSER;
	} else if (value.toLocaleLowerCase().endsWith('.js')) {
		action = Actions.SCRIPT;
	} else if (value.toLocaleLowerCase() === 'none') {
		action = Actions.NONE;
	} else {
		action = Actions.BROWSER;
	}

	return { value, action };
};

//todo
const startBrowserProcess = (browser, url) => {};

module.exports = (url) => {
	const { value, action } = getBrowserEnv();
	console.log(action);
	switch (action) {
		case Actions.NONE:
			// 特殊情况：浏览器=“无”将阻止完全打开。
			return false;
		case Actions.SCRIPT:
			return console.log('todo openBrowser-SCript');
		case Actions.BROWSER:
			return startBrowserProcess(value, url);
		default:
			throw new Error('Not implemeopnted 😫');
	}
};
