const { promisify } = require('util');

module.exports = async (repo, desc) => {
	const download = promisify(require('download-git-repo'));
	const ora = require('ora');

	const process = ora(`下载...${repo}`);
	process.start();

	try {
		await download(repo, desc);
		process.succeed('下载成功');
	} catch (error) {
		process.fail('下载失败 请重新下载');
		throw Error('下载失败 请重新下载');
	}
};
