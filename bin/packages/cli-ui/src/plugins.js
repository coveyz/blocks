import Vue from 'vue';
import VueUi from '@vue/ui';
import Responsive from '@/utils/responsive';
import * as Filters from './filters';

Vue.use(Responsive, {
	computed: {
		mobile() {
			return this.width <= 760;
		},
		tablet() {
			return this.width <= 900;
		},
		desktop() {
			return !this.tablet;
		},
		wide() {
			return this.width >= 1300;
		},
	},
});

for (const filter in Filters) {
	Vue.filter(filter, Filters[filter]);
}

Vue.use(VueUi);
