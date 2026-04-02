import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RecurlyApi implements ICredentialType {
	name = 'recurlyApi';
	displayName = 'Recurly API';
	documentationUrl = 'https://docs.recurly.com/docs/authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The API key for your Recurly account',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://v3.recurly.com',
			description: 'The base URL for the Recurly API',
		},
	];
}