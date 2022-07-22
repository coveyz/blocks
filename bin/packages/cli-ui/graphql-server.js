const http = require('http');
const express = require('express');
const merge = require('deepmerge');

const load = (file) => {
	const module = require(file);

	if (module.default) {
		return module.default;
	}
	return module;
};

module.exports = async (options, cb = null) => {
	// console.log('graphql-server.js=>', options);
	options = merge({ integratedEngine: false }, options);
	// express app;
	const app = new express();
	const httpServer = http.createServer(app);
	// 自定义 这些 文件
	let typeDefs = load(options.paths.typeDefs);
	const resolvers = load(options.paths.resolvers);
	const context = load(options.paths.context);

	// console.log('typeDefs=>', typeDefs);
	// console.log('resolvers=>', resolvers);
	console.log('context=>', context);

	return {
		httpServer,
	};
};
