
export class WakatimeClient {
	serverUrl: string;
	apiKey: string;
	headers: any;


	constructor(apiKey: any, serverUrl: any) {
		this.apiKey = apiKey;
		this.serverUrl = serverUrl;
		this.headers = new Headers();
		this.headers.append('Authorization', `Basic ${Buffer.from(this.apiKey).toString('base64')}`);
	}

	async heartbeatRequest(data: any) {
		const url = '/users/current/heartbeats'
		const response = await fetch(this.serverUrl + url, {
			method: 'post',
			headers: this.headers,
			body: JSON.stringify(data),
		});
		return response.status === 201
	}
}
