export const folder = (value, maxLength = -1) => {
	console.log('filter-folder', maxLength);
	value = value.replace(/\\/g, '/');

	if (value.charAt(value.length - 1) !== '/') {
		value += '/';
	}

	if (maxLength !== -1 && value.length > maxLength) {
		const exceeded = value.length - maxLength + 3,
			firstEnd = Math.floor(maxLength / 2 - exceeded / 2),
			lastStart = Math.floor(maxLength / 2 + exceeded / 2);

		value = value.substring(0, firstEnd) + '...' + value.substring(lastStart);
	}

	return value;
};
