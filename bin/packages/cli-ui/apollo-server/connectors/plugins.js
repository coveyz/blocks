const serve = (req, res) => {
	console.log('plugins-serve');
};

const serveLogo = (req, res) => {
	console.log('plugins-serveLogo');
};

module.exports = {
	serve,
	serveLogo,
};
