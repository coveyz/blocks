import Vue from 'vue';
import router from '@/router';
import ProjectHome from '@/views/app/project-home';

export const toComponentId = (id) => {
	id = id.replace(/\./g, '-');
	return `client-addon-${id}`;
};

export default class ClientAddonApi {
	constructor() {
		this.components = new Map();
		this.componentListeners = new Map();
	}
	/**
	 * 注册全局 组件
	 * @param {string} id
	 * @param {object} definition
	 */
	component(id, definition) {
		this.components.set(id, definition);
		const componentId = toComponentId(id);
		Vue.component(componentId, definition);
		// eslint-disable-next-line no-console
		console.log(`[ClientAddonApi] Registered ${componentId} component`);
		// 侦听器
		const listeners = this.componentListeners.get(id);
		if (listeners) {
			listeners.forEach((listen) => listen(definition));
			this.componentListeners.delete(id);
		}
	}
	/**
	 * 将路由添加到 /add/<id> 父路由下.
	 * 例如，addRoutes（'foo'，[{path:'}，{path:'bar}]）
	 * 将/addon/foo/和/addon/foo/bar路由添加到vue路由器。
	 *
	 * @param {string} id
	 * @param {any} routes
	 */
	addRoutes(id, routes) {
		router.addRoutes([
			{
				path: `/addon/${id}`,
				component: ProjectHome,
				meta: {
					needProject: true,
					restore: true,
				},
				children: routes,
			},
		]);
		// eslint-disable-next-line no-console
		console.log(`[ClientAddonApi] Registered new routes under the /addon/${id} route`);
	}
	getComponent(id) {
		return this.components.get(id);
	}
	listenForComponent(id, cb) {
		let listeners = this.componentListeners.get(id);
		if (!listeners) {
			listeners = [];
			this.componentListeners.set(id, listeners);
		}
		listeners.push(cb);
	}
	awaitComponent(id) {
		return new Promise((resolve) => {
			const result = this.addRoutes.getComponent(id);
			if (result) {
				resolve(result);
			} else {
				this.listenForComponent(id, resolve);
			}
		});
	}
}
