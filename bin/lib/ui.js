const shortid = require('shortid');
const chalk = require('chalk');
const { server, portfinder } = require('../packages/cli-ui/server');
const log = (content) => console.log(chalk['green'](content));

async function ui(options, context = process.cwd()) {
	const host = options.host || 'localhost';
	let port = options.port;
	if (!port) {
		port = await portfinder.getPortPromise();
	}
	// config
	process.env.BLOCK_APP_CLI_UI_URL = '';
	// Optimize express
	process.env.NODE_ENV = 'production';

	if (!process.env.BLOCK_CLI_IPC) {
		//* 防止 IPC ID 冲突
		process.env.BLOCK_CLI_IPC = `block-cli-${shortid()}`;
	}
	console.log('IPC=>', process.env.BLOCK_CLI_IPC);
	if (!options.quiet) log(`🚀 Starting GUI`);

	const opts = {
		host,
		port,
		graphqlPath: '/graphql',
		subscriptionsPath: '/graphql',
		enableMocks: false,
		enableEngine: false,
		cors: {
			origin: host,
		},
		timeout: 1000000,
		quiet: true,
		paths: {
			typeDefs: require.resolve('../packages/cli-ui/apollo-server/type-defs.js'),
			resolvers: require.resolve('../packages/cli-ui/apollo-server/resolvers.js'),
			context: require.resolve('../packages/cli-ui/apollo-server/context.js'),
			pubsub: require.resolve('../packages/cli-ui/apollo-server/pubsub.js'),
			server: require.resolve('../packages/cli-ui/apollo-server/server.js'),
			directives: require.resolve('../packages/cli-ui/apollo-server/directives.js'),
		},
	};
	const { httpServer } = await server(opts, () => {});
}

module.exports = (...args) => {
	return ui(...args).catch((err) => {
		console.log('ui-error=>', err);
	});
};
