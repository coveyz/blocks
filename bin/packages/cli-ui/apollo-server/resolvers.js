const globby = require('globby');
const merge = require('lodash.merge');
const { GraphQLJSON } = require('graphql-type-json');

const channels = require('./channels')

process.env.BLOCK_CLI_API_MODE = true;

const resolvers = [
	{
		JSON: GraphQLJSON,
		// ClientAddon: {
		// url: () =>
		// }
		Query: {
			cwd: () => cwd.get(),
		},
		Subscription: {
			routeRequested: {
				subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator(channels.ROUTE_REQUESTED),
			},
		},
	},
];

const paths = globby.sync(['./schema/*.js'], { cwd: __dirname, absolute: true });
// console.log('paths=>', paths);

paths.forEach((file) => {
	const { resolvers: r } = require(file);
	r && resolvers.push(r);
});

module.exports = merge.apply(null, resolvers);
