const gql = require('graphql-tag');
// Connectors
const folders = require('../connectors/folders');
const cwd = require('../connectors/cwd');

exports.types = gql`
	type Folder {
		name: String!
		path: String!
		favorite: Boolean
		isPackage: Boolean
		isVueProject: Boolean
		children: [Folder]
		hidden: Boolean
	}

	extend type Query {
		folderCurrent: Folder
	}
`;

// extend type Mutation {
//   folderOpen(path: String!): Folder
// }

exports.resolvers = {
	Folder: {
		children: (folder, args, context) => folders.list(folder.path, context),
		isPackage: (folder, args, context) => folders.isPackage(folder.path, context),
	},
	Query: {
		folderCurrent: (root, args, context) => folders.getCurrent(args, context),
	},
	Mutation: {
		folderOpen: (rooet, { path }, context) => folders.open(path, context),
		folderOpenParent: (root, args, context) => folders.openParent(cwd.get(), context),
	},
};
