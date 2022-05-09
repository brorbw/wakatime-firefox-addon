import { Heartbeat } from './heartbeat';
import { WakatimeClient } from './wakatimeclient'

const defaultURL: string = 'https://wakatime.com/api/v1/'

export const retriveApiKey = async () => {
	const { key, url } = await browser.storage.sync.get(['key', 'url']);
	return { key: key, url: url };
};
export const saveApiKey = async (key: string, url: string) => {
	browser.storage.sync.set({
		key,
		url: url || defaultURL,
	}).then(
		() => { console.log("Credentials saved") },
		() => { console.log("Credentials not saved") }
	);

}

export const sendHeartbeat = async (client: WakatimeClient, tab: any) => {
	const heartbeat = buildHeartbeat(tab);
	if (!heartbeat) return;
	const response = await client.heartbeatRequest(heartbeat)
	if (response.responses[0][1] === 201) {
		console.log("Data sent to Wakatime API server");
		return
	} else {
		console.log("Could not send data to Wakatime API server");
	}
}

const buildHeartbeat = (tab: any) => {
	const url = new URL(tab.url);
	const domain = url.hostname;
	if (domain !== 'github.com') return;
	const [_, organisation, repository] = url.pathname.split("/");
	const project = `gh/${organisation}/${repository}`
	// const branch = tab.title.split("·")[0].slice(0, -1).toLowerCase().replace(/\ /g, "-");
	const heartbeat = new Heartbeat(url.toString(), domain, Date.now(), "main", project, "github");
	return heartbeat;
}
