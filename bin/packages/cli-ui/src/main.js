import './plugins';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import gql from 'graphql-tag';
import { apolloProvider } from './vue-apollo';
import ClientAddonApi from '@/utils/ClientAddonApi.js';

window.gql = gql;
Vue.config.productionTip = false;
Vue.config.devtools = true;

window.Vue = Vue;
window.ClientAddonApi = ClientAddonApi;

new Vue({
	router,
	store,
	apolloProvider,
	render: (h) => h(App),
}).$mount('#app');
