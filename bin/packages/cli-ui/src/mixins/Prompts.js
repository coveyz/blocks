export default function ({ field, query, variables = null, updateQuery = null, update = null }) {
	return {
		computed: {
			visiblePrompts() {
				if (!this[field]) {
					return [];
				}
				return this[field].prompts.filter((item) => item.visible);
			},
			configurationValid() {
				console.log('todo-configurationValid');
				return [];
			},
			hasPromptsChanged() {
				console.log('todo-hasPromptsChanged');
				return {};
			},
		},
		watch: {
			hasPromptsChanged: {
				handle(value) {
					console.log('todo-hasChange-Event', value);
					return;
					this.$emit('has-changes', value);
				},
				immediate: true,
			},
		},
		methods: {
			async answerPrompt({ prompt, value }) {
				console.log('todo=>answerPrompt->', prompt, value);
			},
		},
	};
}
