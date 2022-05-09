import axios from 'axios';
import Heartbeat from './heartbeat'

const serverUrl = 'https://wakapi.nobad.coffee/api';
const apiKey = 'ac83aeb2-36dc-4b6f-9e42-13680d97a889';

class WakatimeClient {
	constructor(serverUrl, apiKey) {
		this.serverUrl = serverUrl;
		this.apiKey = apiKey;
		this.axiosConfiguration = axios.create({
			baseURL: serverUrl,
			headers: { Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}` },
		});
	}
	async sendHeartbeat(heartbeat) {
		return this.axiosConfiguration.post(`/users/bbw/heartbeats`, heartbeat).then((response) => response.data);
	}
}

class Heartbeat {
	constructor(entity, type, time) {
		this.entity = entity;
		this.type = type;
		this.time = time;
		this.project = 'github';
	}
}

const client = new WakatimeClient(serverUrl, apiKey);

// const res = await client.sendHeartbeat(new Heartbeat("test", "test", Date.now() / 1000));

// console.log(res);

// browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     const result = leftPad(message.text, message.amount, message.with);
//     sendResponse(result);
// });

// Notes. Only use for GH. Parse project and branch from URL. Activity as well.

	// constructor(entity, type, category, time, project, branch, language, dependencies, lines, lineno, cursorpos, is_write) {
	// 	this.entity = entity;
	// 	this.type = type;
	// 	this.category = category;
	// 	this.time = time;
	// 	this.project = project;
	// 	this.branch = branch;
	// 	this.language = language;
	// 	this.dependencies = dependencies;
	// 	this.lines = lines;
	// 	this.lineno = lineno;
	// 	this.cursorpos = cursorpos;
	// 	this.is_write = is_write;
	// }
