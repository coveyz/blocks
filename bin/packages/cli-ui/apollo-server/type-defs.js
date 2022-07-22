const globby = require('globby');
const gql = require('graphql-tag');

const typeDefs = [
	gql`
		enum PackageManager {
			npm
			yarn
			pnpm
		}
	`,
];

const paths = globby.sync(['./schema/*.js'], { cwd: __dirname, absolute: true });

paths.forEach((file) => {
	const { types } = require(file);
	types && typeDefs.push(types);
});

module.exports = typeDefs;
