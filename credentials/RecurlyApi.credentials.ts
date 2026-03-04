import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RecurlyApi implements ICredentialType {
	name = 'recurlyApi';
	displayName = 'Recurly API';
	documentationUrl = 'https://developers.recurly.com/api/v2021-02-25/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Recurly API key. Found in Recurly Admin Console under API Credentials.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://v3.recurly.com',
			required: true,
			description: 'The base URL for the Recurly API',
		},
	];
}