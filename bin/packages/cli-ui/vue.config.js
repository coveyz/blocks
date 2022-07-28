module.exports = {
	pluginOptions: {
		apollo: {
			enableMocks: false,
			enableEngine: false,
			lintGQL: false,
		},
	},

	configureWebpack: {
		resolve: {
			symlinks: false,
		},
	},

	parallel: !process.env.CIRCLECI,
};
