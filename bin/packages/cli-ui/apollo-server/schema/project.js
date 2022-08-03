const gql = require('graphql-tag');
const projects = require('../connectors/project');
// const plugins = require('../connectors/plugins');

exports.types = gql`
	enum ProjectType {
		vue
		unknown
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

	type Preset implements DescribedEntity {
		id: ID!
		name: String
		description: String
		link: String
		features: [String]
	}

	type Feature implements DescribedEntity {
		id: ID!
		name: String
		description: String
		link: String
		enabled: Boolean
	}

	type ProjectCreation {
		presets: [Preset]
		features: [Feature]
		prompts: [Prompt]
	}

	extend type Query {
		projectCurrent: Project
		projects: [Project]
		projectCreation: ProjectCreation
	}
`;
// projectInitCreation: ProjectCreation

exports.resolvers = {
	Project: {},
	Query: {
		projectCurrent: (root, args, context) => projects.getCurrent(context),
		projects: (root, args, context) => projects.list(context),
		projectCreation: (root, args, context) => projects.getCreation(context),
	},
	Mutation: {
		// projectInitCreation: (root, args, context) => projects.initCreator(context),
	},
};
