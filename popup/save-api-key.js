const keyNode = document.getElementById("key");
const urlNode = document.getElementById("url");

document.getElementById("pad-bg").addEventListener("click", (e) => {
	const sendingMessage = browser.runtime.sendMessage({
		eventType: 'setSettings',
		key: keyNode.value,
		url: urlNode.value,
	});
	sendingMessage.then(() => {
		const getSettings = browser.runtime.sendMessage({ eventType: 'getSettings' });
		getSettings.then((result) => {
			if (!result) return;
			updateFields(result.key, result.url)
		});
	});
});

const updateFields = (key, url) => {
	if (key) {
		keyNode.value = "********";
	}
	if (url) {
		urlNode.value = url;
	}
}

const getSettings = browser.runtime.sendMessage({ eventType: 'getSettings' });
getSettings.then((result) => {
	updateFields(result.key, result.url)
});
