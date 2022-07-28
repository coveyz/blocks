const gql = require('graphql-tag');
const projects = require('../connectors/project');
// const plugins = require('../connectors/plugins');

exports.types = gql`
	extend type Query {
		projectCurrent: Project
	}

	type Project {
		id: ID!
		name: String!
		type: ProjectType
		path: String!
		favorite: Int
		plugins: [Plugin]
		tasks: [Task]
		homepage: String
		openDate: JSON
	}

  enum ProjectType {
    vue
    unknown
  }
`;

exports.resolvers = {
	Query: {
		projectCurrent: (root, args, context) => projects.getCurrent(context),
	},
};
