import Vue from 'vue';
import VueApollo from 'vue-apollo';
// import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client';
import { createApolloClient } from './vue-apollo-config';

import clientStateDefaults from '@/state/defaults';
import clientStateResolvers from '@/state/resolvers';
import clientStateTypeDefs from '@/state/typeDefs';

import LOADING_CHANGE from '@/graphql/loading/loadingChange.gql';
import DARK_MODE_SET from '@/graphql/dark-mode/darkModeSet.gql';
// import PROJECT_CURRENT from '@/graphql/project/projectCurrent.gql';
import CONNECTED_SET from '@/graphql/connected/connectedSet.gql';

import { getForcedTheme } from '@/utils/theme';

Vue.use(VueApollo);

//todo
let endpoint = process.env.VUE_APP_CLI_UI_URL;
if (typeof endpoint === 'undefined') {
	endpoint = `ws://localhost:${process.env.VUE_APP_GRAPHQL_PORT}/graphql`;
	console.log('unde2=>', endpoint);
} else if (endpoint === '') {
	endpoint = window.location.origin.replace('http', 'ws') + '/graphql';
	console.log('string=>', endpoint);
}

// console.log(endpoint);

// config
const options = {
	inMemoryCacheOptions: {},
	wsEndpoint: endpoint,
	persisting: false,
	websocketsOnly: true,
	typeDefs: clientStateTypeDefs,
	resolvers: clientStateResolvers,
	onCacheInit: (cache) => {
		cache.writeData({ data: clientStateDefaults() });
	},
};

// create apollo client
export const { apolloClient, wsClient } = new createApolloClient(options);

export const apolloProvider = new VueApollo({
	defaultClient: apolloClient,
	// 'apollo' 对象的默认定义
	defaultOptions: {
		$query: {
			fetchPolicy: 'cache-and-network',
			errorPolicy: 'all',
		},
	},
	// 查看所有查询的加载状态
	watchLoading(state, mod) {
		apolloClient.mutate({
			mutation: LOADING_CHANGE,
			variables: {
				mod,
			},
		});
	},
	// 所有智能查询和订阅的全局错误处理函数
	errorHandler(error) {
		console.log('%cAn error occurred', 'background: red; color: white; padding: 4px; border-radius: 4px;font-weight: bold;');
		console.log(error.message);
		if (error.graphQLErrors) {
			console.log(error.graphQLErrors);
		}
		if (error.networkError) {
			console.log(error.networkError);
		}
	},
});

// 链接状态
const sendConneted = (value) => {
	console.log('sendConneted=>', value);
	apolloClient.mutate({
		mutation: CONNECTED_SET,
		variables: [value],
	});
};

const resetApollo = async () => {
	console.log('[UI] Apollo store reset');
	// const {
	// 	data: { projectCurrent },
	// } = await apolloClient.query({
	// 	query: PROJECT_CURRENT,
	// 	fetchPolicy: 'network-only',
	// });

	// const projectId = projectCurrent.id;
};

wsClient.on('connected', () => {
	console.log('connected');
	return sendConneted(true);
});
wsClient.on('reconnected', async () => {
	console.log('ws-reconnected=>');
	await resetApollo();
	sendConneted(true);
});
// Offline
wsClient.on('disconnected', () => {
	console.log('disconnected=>');
	sendConneted(false);
});
wsClient.on('error', () => {
	console.log('error=>');
	return sendConneted(false);
});

// Dark mode
const loadDarkMode = () => {
	let enabled, forcedTheme;
	if ((forcedTheme = getForcedTheme())) {
		enabled = forcedTheme === 'dark';
	} else {
		const raw = localStorage.getItem('block-ui-dark-mode');
		console.log('elese=>', raw);
		enabled = raw === 'true';
	}

	apolloClient.mutate({
		mutation: DARK_MODE_SET,
		variables: {
			enabled,
		},
	});
};

loadDarkMode();
