exports.getPromptModules = () => {
	return ['babel', 'router', 'vuex'].map((file) => require(`./promptModules/${file}`));
};
