const gql = require('graphql-tag');

exports.types = gql`
	type Plugin {
		id: ID!
		version: Version!
		official: Boolean
		installed: Boolean
		website: String
		description: String
		githubStats: GitHubStats
		logo: String
	}
`;
