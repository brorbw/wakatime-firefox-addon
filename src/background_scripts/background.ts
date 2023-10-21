import { WakatimeClient } from './wakatimeclient'
import { retrieveApiKey, saveApiKey, sendHeartbeat } from './utils'

let timeAtLastHeartbeat = 0;
let client: WakatimeClient;

const init = async () => {
	const savedCredentials = await retrieveApiKey();
	if (!savedCredentials.key || !savedCredentials.url) return;
	client = new WakatimeClient(savedCredentials.key, savedCredentials.url);
	console.log('Wakatime API initialised');
}
init();

// event handlers

const handleIdleStateChange = (newState: browser.idle.IdleState) => {
	// Idle state change
	checkIfHeartbeatShouldbeSent();
	timeAtLastHeartbeat = Date.now();
}

const checkIfHeartbeatShouldbeSent = async () => {
	if (!client) return;

	// If the browser have been idle for more than 60 seconds
	// we skip this heatbeat.
	const browserIdleState = await browser.idle.queryState(15);
	if (browserIdleState !== 'active') return;

	sendHeartbeat(client);
}

const onCreate = async (tab: browser.tabs.Tab) => {
	//A new tab is created
	checkIfHeartbeatShouldbeSent();
	timeAtLastHeartbeat = Date.now();
}

const onUpdate = async (_: any, __: any, tab: browser.tabs.Tab) => {
	// A tab changes

	// onUpdate is called multiple times when refreshing a tab
	// to spare the server we only call it again if it has been
	// more than asecond since last time we sent a heartbeat
	if ((Date.now() - timeAtLastHeartbeat) / 1000 > 1) {
		checkIfHeartbeatShouldbeSent();
	};
	timeAtLastHeartbeat = Date.now();
	return
}

setInterval(async () => {
	try {
		// Only send heartbeats if it has been less than two minutes
		// while we are continuously viewing a file.
		// https://wakatime.com/faq#accuracy
		if ((Date.now() - timeAtLastHeartbeat) / 1000 < 120) return;

		checkIfHeartbeatShouldbeSent();

		timeAtLastHeartbeat = Date.now();
	} catch (e) {
		init();
	}
}, 30_00);

browser.idle.onStateChanged.addListener(handleIdleStateChange);
browser.idle.setDetectionInterval(15);
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
