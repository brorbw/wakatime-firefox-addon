import axios from 'axios';

export class WakatimeClient {
	serverUrl: string;
	apiKey: string;
	serverConfig: any;

	constructor(apiKey: any, serverUrl: any) {
		this.apiKey = apiKey;
		this.serverUrl = serverUrl;
		this.serverConfig = axios.create({
			baseURL: this.serverUrl,
			headers: { Authorization: `Basic ${Buffer.from(this.apiKey).toString('base64')}` },
		});
	}
	async heartbeatRequest(data: any) {
		const url = '/users/bbw/heartbeats'
		let response = await this.serverConfig.post(url, data).then((response: any) => response.data);
		return response;
	}
}
