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

export const sendHeartbeat = async (client: WakatimeClient) => {
	const currentTabs = await browser.tabs.query({ currentWindow: true, active: true });
	if (!currentTabs) return;
	await Promise.all(currentTabs.map(async (tab) => {
		const heartbeat = buildHeartbeat(tab);
		if (!heartbeat) return;
		const success = await client.heartbeatRequest(heartbeat)
		if (success) {
			console.log(new Date, "Data sent to Wakatime API server");
			return
		} else {
			console.log(new Date, "Could not send data to Wakatime API server");
		}
	}));
}

const parseURL = (url: URL) => {
	let path = url.pathname;
	// let search = url.search;
	let entity = url.toString()
	let branch = "github.com"
	let [_, organisation, repository] = url.pathname.split("/");
	let project = repository
	if (organisation == 'notification') {
		project = 'github.com'
	}
	//TODO: Include category based on tree/blob/pulls etc
	if (path.includes('blob')) {
		const matchedGroups = path.match(/blob\/(?<branch>\w*)\/(?<filePath>.*)/);
		branch = matchedGroups?.groups.branch;
		const filePath = matchedGroups?.groups.filePath;
		entity = `${project}/${filePath}`;
	}
	if (path.includes('tree')) {
		const matchedGroups = path.match(/tree\/(?<branch>\w*)/);
		branch = matchedGroups?.groups.branch;
		entity = url.toString()
	}
	return {
		entity,
		branch,
		project
	}
}

const buildHeartbeat = (tab: browser.tabs.Tab) => {
	const url = new URL(tab.url);
	const domain = url.hostname;
	if (domain !== 'github.com') return;
	const { entity, branch, project } = parseURL(url)
	const heartbeat = new Heartbeat(entity, domain, Date.now(), branch, project, 'github');
	return heartbeat;
}
