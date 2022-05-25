import { Heartbeat } from './heartbeat';
import { WakatimeClient } from './wakatimeclient'

const defaultURL = 'https://wakatime.com/api/v1/'

export const retrieveApiKey = async () => {
	const { key, url } = await browser.storage.sync.get(['key', 'url']);
	return { key, url };
}

export const saveApiKey = async (key: string, url: string) => {
	browser.storage.sync.set({
		key,
		url: url || defaultURL,
	}).then(
		() => { console.log("Credentials saved") },
		() => { console.log("Credentials not saved") }
	);

}

export const sendHeartbeat = async (client: WakatimeClient, tab: browser.tabs.Tab) => {
	const heartbeat = buildHeartbeat(tab);
	if (!heartbeat) return;
	const success = await client.heartbeatRequest(heartbeat)
	if (success) {
		console.log(new Date, "Data sent to Wakatime API server");
		return
	} else {
		console.log(new Date, "Could not send data to Wakatime API server");
	}
}

const buildHeartbeat = (tab: browser.tabs.Tab) => {
	const url = new URL(tab.url);
	const domain = url.hostname;
	if (domain !== 'github.com') return;
	const [_, organisation, repository] = url.pathname.split("/");
	const project = `${organisation}/${repository}`
	// const branch = tab.title.split("·")[0].slice(0, -1).toLowerCase().replace(/\ /g, "-");
	const heartbeat = new Heartbeat(url.toString(), domain, Date.now(), project, 'github.com', "github");
	return heartbeat;
}
