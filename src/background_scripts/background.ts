import { WakatimeClient } from './wakatimeclient'
import { retrieveApiKey, saveApiKey, sendHeartbeat } from './utils'

let timeAtLastHeartbeat = 0;
let isIdle = false;
let client: WakatimeClient;

const init = async () => {
	const savedCredentials = await retrieveApiKey();
	if (!savedCredentials.key || !savedCredentials.url) return;
	client = new WakatimeClient(savedCredentials.key, savedCredentials.url);
	console.log("Wakatime API initialised");
}
init();

// event handlers
const checkIfHeartbeatShouldBeSent = (newState: browser.idle.IdleState) => {
	console.log("browser state change:" + newState);
	if (newState !== "active" || newState !== null) {
		isIdle = true;
		browser.idle.setDetectionInterval(15);
	} else {
		isIdle = false;
		browser.idle.setDetectionInterval(60);
	};
}

const onCreate = async (tab: browser.tabs.Tab) => {
	if (!client) return;
	if (isIdle) return;
	if (!tab.active) return;
	sendHeartbeat(client, tab);
	timeAtLastHeartbeat = Date.now();
}

const onUpdate = async (_: any, __: any, tab: browser.tabs.Tab) => {
	if (!client) return;
	if (isIdle) return;
	if (!tab.active) return;
	sendHeartbeat(client, tab);
	timeAtLastHeartbeat = Date.now();
}

setInterval(async () => {
	try {
		if (!client) return;
		if (isIdle) return;
		if ((Date.now() - timeAtLastHeartbeat) / 1000 < 120) return;
		const currentTabs = await browser.tabs.query({ currentWindow: true, active: true });
		if (!currentTabs) return;
		currentTabs.forEach((tab) => {
			sendHeartbeat(client, tab);
		});
		timeAtLastHeartbeat = Date.now();
	} catch (e) {
		init();
	}
}, 30_000);

browser.idle.onStateChanged.addListener(checkIfHeartbeatShouldBeSent);
browser.idle.setDetectionInterval(60);
browser.tabs.onCreated.addListener(onCreate);
browser.tabs.onUpdated.addListener(onUpdate);

browser.runtime.onMessage.addListener(async (message, _, __) => {
	if (message.eventType == 'setSettings') {
		saveApiKey(message.key, message.url);
		init();
	} else if (message.eventType == 'getSettings') {
		return retrieveApiKey();
	}
});
