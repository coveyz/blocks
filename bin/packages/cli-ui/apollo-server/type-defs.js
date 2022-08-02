const globby = require('globby');
const gql = require('graphql-tag');

const typeDefs = [
	gql`
		scalar JSON
		enum PackageManager {
			npm
			yarn
			pnpm
		}
		type Query {
			cwd: String!
		}
		type Subscription {
			routeRequested: JSON!
      cwdChanged: String!
		}
    type Mutation {
		  folderOpen(path: String!): Folder
    }
		type GitHubStats {
			stars: Int
		}
		interface DescribedEntity {
			name: String
			description: String
			link: String
		}

		type Version {
			current: String
			latest: String
			wanted: String
			range: String
			localPath: String
		}
	`,
];
const paths = globby.sync(['./schema/*.js'], { cwd: __dirname, absolute: true });

paths.forEach((file) => {
	const { types } = require(file);
	// console.log('file=>', file);
	// console.log('type-defs=>', types);
	types && typeDefs.push(types);
});

module.exports = typeDefs;
