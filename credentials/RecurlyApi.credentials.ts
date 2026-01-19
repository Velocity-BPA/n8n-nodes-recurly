/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RecurlyApi implements ICredentialType {
	name = 'recurlyApi';
	displayName = 'Recurly API';
	documentationUrl = 'https://recurly.com/developers/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Recurly Private API Key. Find it in Integrations > API Credentials.',
		},
		{
			displayName: 'Subdomain',
			name: 'subdomain',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'yourcompany',
			description: 'Your Recurly subdomain (e.g., if your URL is yourcompany.recurly.com, enter "yourcompany")',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Basic {{Buffer.from($credentials.apiKey + ":").toString("base64")}}',
				Accept: 'application/vnd.recurly.v2021-02-25+json',
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://v3.recurly.com',
			url: '/accounts',
			method: 'GET',
			qs: {
				limit: 1,
			},
		},
	};
}
