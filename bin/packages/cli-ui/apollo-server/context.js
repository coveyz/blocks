const { db } = require('./util/db');
const pubsub = require('./pubsub');
const cwd = require('./connectors/cwd');

module.exports = ({ req } = {}) => {
	return {
		db,
		pubsub,
		cwd: cwd.get(),
	};
};
