const gql = require('graphql-tag');

exports.types = gql`
	type Task implements DescribedEntity {
		id: ID!
		status: TaskStatus!
		command: String!
		name: String
		description: String
		link: String
		icon: String
		logs: [TaskLog]
		prompts: [Prompt]
		views: [TaskView]
		defaultView: String
		plugin: Plugin
		project: Project
	}

	enum TaskStatus {
		idle
		running
		done
		error
		terminated
	}

	type TaskLog {
		taskId: ID!
		type: TaskLogType!
		text: String
	}
	type TaskView {
		id: ID!
		label: String!
		component: String!
		icon: String
	}

	type TaskLogType {
		id: ID!
		label: String!
		component: String!
		icon: String
	}
`;
