const http = require('http');
const express = require('express');
const merge = require('deepmerge');
const { PubSub } = require('graphql-subscriptions');
const { gql, ApolloServer } = require('apollo-server-express');
const { chalk } = require('./utils/tools');

const load = (file) => {
	const module = require(file);
	if (module.default) {
		return module.default;
	}
	return module;
};

const processSchema = (typeDefs) => {
	// console.log('proceeSchema->typeDefs=>', typeDefs);
	if (Array.isArray(typeDefs)) {
		return typeDefs.map(processSchema);
	}
	if (typeof typeDefs === 'string') {
		typeDefs = gql(typeDefs);
	}
	//删除upload scalar（它已经包含在Apollo服务器中）
	removeFromSchema(typeDefs, 'ScalarTypeDefinition', 'Upload');
	return typeDefs;
};

const removeFromSchema = (document, kind, name) => {
	const definitions = document.definitions;
	const index = definitions.findIndex((def) => def.kind === kind && def.name.kind === 'Name' && def.name.value === name);
	if (index !== -1) definitions.splice(index, 1);
};

const autoCall = (fn, ...context) => {
	// console.log('autoCall=>', fn);
	if (typeof fn === 'function') {
		return fn(...context);
	}
	return fn;
};

module.exports = async (options, cb = null) => {
	options = merge({ integratedEngine: false }, options);
	// console.log('graphql-server.js=>', options);

	// express app;
	const app = new express();
	const httpServer = http.createServer(app);
	// 自定义 这些 文件
	let typeDefs = load(options.paths.typeDefs);
	const resolvers = load(options.paths.resolvers);
	const context = load(options.paths.context);
	const schemaDirectives = load(options.paths.directives);

	let pubsub;
	try {
		pubsub = load(options.paths.pubsub);
	} catch (error) {
		if (process.env.NODE_ENV !== 'production' && !options.quiet) {
			console.log(chalk.yellow('对订阅使用默认的PubSub实现'));
			console.log(chalk.grey("您应该在'apollo-server/pubsub.js'中导出它,从而在生产中提供不同的实现(例如使用Redis)."));
		}
	}

	let dataSources;
	try {
		dataSources = load(options.paths.dataSources);
	} catch (error) {}

	// console.log('typeDefs=>', typeDefs);
	// console.log('resolvers=>', resolvers);
	// console.log('context=>', context);
	// console.log('schemaDirectives=>', schemaDirectives);
	// console.log('pubsub=>', pubsub);
	// console.log('dataSources=>', dataSources);

	// GraphQL API Server

	// 实时订阅
	if (!pubsub) pubsub = new PubSub();

	// 自定义 服务
	try {
		const serverModule = load(options.paths.server);
		serverModule(app);
	} catch (error) {
		//* 未找到文件
	}

	// Apollo server options
	typeDefs = processSchema(typeDefs);

	// eslint禁用next line prefer const
	let subscriptionServer;

	let apolloServerOptions = {
		typeDefs,
		resolvers,
		schemaDirectives,
		dataSources,
		tracing: true,
		cache: 'bounded',
		cacheControl: true,
		engine: !options.integratedEngine,
		// 来自POST的解析器上下文
		context: async ({ req, connection }) => {
			let contextData;
			try {
				if (connection) {
					contextData = await autoCall(context, { connection });
				} else {
					contextData = await autoCall(context, { req });
				}
			} catch (error) {
				console.error(error);
				throw error;
			}
			contextData = Object.assign({}, contextData, { pubsub });
			return contextData;
		},
		plugins: [
			{
				async serverWillStart() {
					return {
						async drainServer() {
							subscriptionServer.close();
						},
					};
				},
			},
		],
	};

	return {
		httpServer,
	};
};
