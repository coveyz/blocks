const open = require('open');
const execSync = require('child_process').execSync;

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
const startBrowserProcess = (browser, url) => {
	// 如果是苹果的操作系统，用户没有明确的表示
	// 请求其他的浏览器 我们尝试打开
	// 带Appscript的chrome, 可以重开
	// 尽可能使用现有的选项卡 而不是重新打开浏览器
	const shouldTryOpenChrmoeWithAppleScript = process.platform === 'darwin' && (typeof browser !== 'string' || browser === OSX_CHROME);

	if (shouldTryOpenChrmoeWithAppleScript) {
		// console.log('todo=>startBrowserProcess=>shouldTryOpenChrmoeWithAppleScript', browser, shouldTryOpenChrmoeWithAppleScript);
		//尽量重用现有选项卡
		//在带有AppleScript的OS X Google Chrome上
		try {
			execSync('ps cax | grep "Google Chrome"');
			execSync('osascript openChrome.applescript "' + encodeURI(url) + '"', {
				cwd: __dirname,
				stdio: 'ignore',
			});
			return true;
		} catch (error) {
			// Ignore errors
		}
	}

	// 另一种特殊情况 OSX上 检查浏览器是否已经设置打开
	// 只需忽略它（从而确保预期行为，即打开系统浏览器）：
	if (process.env === 'darwin' && browser === 'open') {
		browser = undefined;
	}

	//回退到打开
	//（它将始终打开新选项卡）
	try {
		const options = { app: { name: browser }, url: true };
		// console.log('options=>', options);
		open(url, options).catch(() => {}); // 防止“unhandledRejection”错误。
		return true;
	} catch (error) {
		return false;
	}
};

module.exports = (url) => {
	const { value, action } = getBrowserEnv();
	// console.log(action);
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
