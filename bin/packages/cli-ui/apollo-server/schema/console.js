const gql = require('graphql-tag');

// extend type Mutation {
//   consoleLogsClear: [ConsoleLog]
// }

// extend type Subscription {
//   consoleLogAdded: ConsoleLog!
// }

exports.types = gql`
	extend type Query {
		consoleLogs: [ConsoleLog]
		consoleLogLast: ConsoleLog
	}

	type ConsoleLog {
		id: ID!
		message: String!
		tag: String
		type: ConsoleLogType!
		date: String
	}

	enum ConsoleLogType {
		log
		warn
		error
		info
		done
	}
`;

exports.resolvers = {
	Query: {
		consoleLogs: (root, args, context) => console.log('test'),
	},

	// Mutation: {},

	// Subscription: {},
};
