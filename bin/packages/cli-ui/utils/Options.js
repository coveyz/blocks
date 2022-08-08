const fs = require('fs');
const { getRcPath } = require('./rcPath');

// const rcPath = getRcPath('.vuerc'); //todo
const rcPath = getRcPath('.blockrc'); //todo
let cacheOptions;

function loadOptions() {
	console.log('cacheOptions=>', cacheOptions);
	if (cacheOptions) return cacheOptions;
	console.log('rcPath=>', rcPath);
	if (fs.existsSync(rcPath)) {
		try {
			cachedOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
			console.log('cachedOptions=>', cachedOptions);
		} catch (error) {
			console.log('xxxxx bobob');
		}
		return cachedOptions;
	} else {
    console.log('bobobsha dou meiyu')
		return {};
	}
}

module.exports = {
	loadOptions,
};
