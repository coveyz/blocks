export const isValidName = (name) => {
	return !name.match(/[/@\s+%:]|^[_.]/) && encodeURIComponent(name) === name && name.length <= 24;
};

export const isValidMultiName = (name) => {
	name = name.replace(/\\/g, '/');
	return name.split('/').every(isValidName);
};
