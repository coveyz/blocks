let forcedTheme = null;

{
	const result = /\?theme=(\w+)/.exec(window.location.href);
	console.log('theme-result=>', result);
	if (result) forcedTheme = result[1];
}

console.log('forced theme', forcedTheme);

export const getForcedTheme = () => {
	return forcedTheme;
};
