import Vue from 'vue';
import Responsive from '@/utils/responsive';

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
