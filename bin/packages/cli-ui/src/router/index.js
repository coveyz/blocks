import Vue from 'vue';
import VueRouter from 'vue-router';
//! delete 删除
import Home from '../views/Home.vue';

import ProjectSelect from '@/views/project-manager/project-select.vue';
import ProjectCreate from '@/views/project-manager/project-create.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
	},
	{
		path: '/project/select',
		name: 'project-select',
		component: ProjectSelect,
	},
	{
		path: '/project/create',
		name: 'project-create',
		component: ProjectCreate,
	},
];

const router = new VueRouter({
	mode: 'history',
	routes,
});

router.beforeEach(async (to, form, next) => {
	if (to.matched.some((m) => m.meta.needProject)) {
		console.log('>>>');
	}

	next();
});

export default router;
