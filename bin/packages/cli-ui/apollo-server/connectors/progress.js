const channels = require('../channels');
const map = new Map();

function get(id, context) {
	return map.get(id);
}

function set(data, context) {
	const { id } = data;
	let progress = get(id, context);
	if (!progress) {
		progress = data;
    map.set(id,Object.assign({},{
      status: null,
      error: null,
      info: null,
      args: null,
      progress: -1
    },progress))
	} else {
		Object.assign(progress, data);
	}

  context.pubsub.publish(channels.PROGRESS_CHANGED,{progressChanged: progress})
  return progress
}

function remove(id, context) {}

function wrap(id, context, operation) {}

module.exports = {
	get,
	set,
	remove,
	wrap,
};
