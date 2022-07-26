let notifCallback = null;
const setNotificationCallback = (cb) => {
	notifCallback = cb 
    ? (_err, action) => (action === 'activate') && cb()
    : null;
};

module.exports = {
	setNotificationCallback: (cb) => setNotificationCallback(cb),
};
