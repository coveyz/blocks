import LOADING from '@/graphql/loading/loading.gql';

export default {
	Mutaion: {
		connectedSet: (root, { value }, { cache }) => {
			console.log('state-resolvers-connectedSet');
			const data = {
				connected: value,
			};
			cache.writeData({ data });
			return null;
		},
		loadingChange: (root, { mod }, { cache }) => {
			console.log('state-resolvers-loadingChange');
			const { loading } = cache.readQuery({ query: LOADING });
			const data = {
				loading: loading + mod,
			};
			cache.writeData({ data });
			return null;
		},
	},

	darkModeSet: (root, { enabled }, { cache }) => {
		console.log('state-resolvers-darkModeSet');
		const data = {
			darkMode: enabled,
		};
		cache.writeData({ data });
		const el = document.getElementsByTagName('html')[0];
		if (enabled) {
			el.classList.add('block-ui-dark-mode');
		} else {
			el.classList.remove('block-ui-dark-mode');
		}
		return null;
	},
	currentProjectIdSet: (root, { projectId }, { cache }) => {
		const data = {
			currentProjectId: projectId,
		};
		cache.writeData({ data });

		return null;
	},
};
