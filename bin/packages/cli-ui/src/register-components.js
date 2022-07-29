//* 注册所有了组件 以便以后使用
import Vue from 'vue';

const requireCompnents = require.context('./components', true, /[a-z0-9]+\.(jsx?|vue)$/i);

requireCompnents.keys().forEach((fileName) => {
	const componentConfig = requireCompnents(fileName);
	// console.log('fileName=>', fileName);
	// console.log('componentConfig=>', componentConfig);

	const componentName = fileName.substr(fileName.lastIndexOf('/') + 1).replace(/\.\w+$/, '');

	// console.log('💣💣💣💣💣💣', componentName);

	Vue.component(componentName, componentConfig.default || componentConfig);
});
