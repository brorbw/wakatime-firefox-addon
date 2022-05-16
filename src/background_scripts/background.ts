import { WakatimeClient } from './wakatimeclient'
import { retriveApiKey, saveApiKey, sendHeartbeat } from './utils'

let timeAtLastHeartBeat = 0;
let isIdle = false;
let client: WakatimeClient;

const init = async () => {
	const savedCredentials = await retriveApiKey();
	if (!savedCredentials.key || !savedCredentials.url) return;
	client = new WakatimeClient(savedCredentials.key, savedCredentials.url);
	console.log("Wakatime API initialised");
}
init();

// event handlers
const checkIfHeartBeatShouldBeSent = (newState: any) => {
	isIdle = newState === "active" || false;
}

const checkTab = async (tabID: any) => {
	if (!client) return;
	if (isIdle) return;
	const tabs = await browser.tabs.query({});
	let tab: any;
	tabs.forEach((t) => {
		if (tabID == t.id) {
			tab = t;
			return;
		}
	});
	if (!tab && !tab.active) return;
	sendHeartbeat(client, tab);
	timeAtLastHeartBeat = Date.now();
}
setInterval(async () => {
	if (!client) return;
	if (isIdle) return;
	if ((Date.now() - timeAtLastHeartBeat) / 1000 < 120) return;
	const currentTabs = await browser.tabs.query({ currentWindow: true, active: true });
	if (!currentTabs) return;
	currentTabs.forEach((tab) => {
		sendHeartbeat(client, tab);
	});
	timeAtLastHeartBeat = Date.now();
}, 30000);

browser.idle.setDetectionInterval(240);
browser.idle.onStateChanged.addListener(checkIfHeartBeatShouldBeSent);
browser.tabs.onCreated.addListener(checkTab);
browser.tabs.onUpdated.addListener(checkTab);


browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	if (message.eventType == 'setSettings') {
		saveApiKey(message.key, message.url);
		init();
	} else if (message.eventType == 'getSettings') {
		return retriveApiKey();
	}
});
