const path = require('path');
const fs = require('fs-extra');

const cwd = require('./cwd');
const hiddenPrefix = '.';
const isPlatformWindows = process.platform.indexOf('win') === 0;

// 生成文件夹
function generateFolder(file, context) {
	console.log('generateFolder🍕', file);

	return {
		name: path.basename(file),
		path: file,
	};
}

// 打开文件夹
function open(file, context) {
	cwd.set(file, context);
	return generateFolder(cwd.get(), context);
}
// 打开父级文件夹
function openParent(file, context) {
	// console.log('openParent-file=>', file); 
	const newFile = path.dirname(file); // 获取 当前文件 所在的文件夹路径
	// console.log('openParent-newFile=>', newFile);
	cwd.set(newFile, context);
	return generateFolder(cwd.get(), context);
}

// 获取当前文件
function getCurrent(args, context) {
	const base = cwd.get();
	// console.log('folder-current->', base);
	return generateFolder(base, context);
}

// 当前文件内容 Folder.children
async function list(base, context) {
	// console.log('Folder-list=>', base);
	let dir = base;
	if (isPlatformWindows) {
		console.log('todo window baseEdit');
	}
	const files = await fs.readdir(dir, 'utf8');
	// console.log('curdir=>', files);

	const f = await Promise.all(
		files.map(async (file) => {
			const folderPath = path.join(base, file);
			// console.log('folderPath=>', folderPath);

			const [directory, hidden] = await Promise.all([isDirectory(folderPath), isHidden(folderPath)]);

			// console.log(folderPath, 'directory=>', directory);
			// console.log(folderPath, 'hidden=>', hidden);
			if (!directory) return null;

			return {
				path: folderPath,
				name: file,
				hidden,
			};
		})
	);

	const result = f.filter((x) => !!x);

	// console.log('result=>', result);
	return result;
}

function isDirectory(file) {
	// console.log('isDirectory=>', file);
	file = file.replace(/\\/g, path.sep);
	// console.log('isDirectory-filereplace=>', file);

	try {
		return fs.stat(file).then((x) => x.isDirectory());
	} catch (error) {
		if (process.env.VUE_APP_CLI_UI_DEBUG) console.warn(error.message);
	}

	return false;
}

function isHidden(file) {
	try {
		const prefixed = path.basename(file).charAt(0) === hiddenPrefix;
		// console.log('isHidden-prefixed=>', path.basename(file));
		const result = {
			unix: prefixed,
			windows: false,
		};
		if (isPlatformWindows) {
			console.log('todo window isHidden');
		}
		return (!isPlatformWindows && result.unix) || (isPlatformWindows && result.windows);
	} catch (error) {
		if (process.env.VUE_APP_CLI_UI_DEBUG) {
			console.log('file:', file);
			console.error(error);
		}
	}
}

function isPackage(file) {
	try {
		return fs.existsSync(path.join(file, 'package.json'));
	} catch (error) {
		console.warn(error.message);
	}

	return false;
}

module.exports = {
	open,
	openParent,
	getCurrent,
	list,
	isDirectory,
	isHidden,
	isPackage,
};
