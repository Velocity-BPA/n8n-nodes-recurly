/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new account',
				action: 'Create an account',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Deactivate an account',
				action: 'Delete an account',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve an account by ID or code',
				action: 'Get an account',
			},
			{
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get account balance',
				action: 'Get account balance',
			},
			{
				name: 'Get Billing Info',
				value: 'getBillingInfo',
				description: 'Get billing information for an account',
				action: 'Get billing info',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many accounts',
				action: 'Get many accounts',
			},
			{
				name: 'Reopen',
				value: 'reopen',
				description: 'Reactivate a closed account',
				action: 'Reopen an account',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update account information',
				action: 'Update an account',
			},
			{
				name: 'Update Billing Info',
				value: 'updateBillingInfo',
				description: 'Update billing information for an account',
				action: 'Update billing info',
			},
		],
		default: 'get',
	},
];

export const accountFields: INodeProperties[] = [
	// ----------------------------------
	//         account: get
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['get', 'update', 'delete', 'reopen', 'getBalance', 'getBillingInfo', 'updateBillingInfo'],
			},
		},
		description: 'The unique account identifier (acct_xxxxx) or account code',
	},

	// ----------------------------------
	//         account: create
	// ----------------------------------
	{
		displayName: 'Account Code',
		name: 'accountCode',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		description: 'Unique code to identify the account (user-defined)',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		default: '',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		description: 'Email address for the account',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Bill To',
				name: 'billTo',
				type: 'options',
				options: [
					{ name: 'Self', value: 'self' },
					{ name: 'Parent', value: 'parent' },
				],
				default: 'self',
				description: 'Who to bill for this account',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City for the account address',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: 'Company name',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Two-letter ISO country code',
			},
			{
				displayName: 'Exemption Certificate',
				name: 'exemptionCertificate',
				type: 'string',
				default: '',
				description: 'Tax exemption certificate number',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name of the account holder',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Last name of the account holder',
			},
			{
				displayName: 'Parent Account ID',
				name: 'parentAccountId',
				type: 'string',
				default: '',
				description: 'Parent account ID for hierarchical billing',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number',
			},
			{
				displayName: 'Postal Code',
				name: 'postalCode',
				type: 'string',
				default: '',
				description: 'Postal or ZIP code',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				description: 'State or province',
			},
			{
				displayName: 'Street 1',
				name: 'street1',
				type: 'string',
				default: '',
				description: 'Street address line 1',
			},
			{
				displayName: 'Street 2',
				name: 'street2',
				type: 'string',
				default: '',
				description: 'Street address line 2',
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				description: 'Username for the account',
			},
			{
				displayName: 'VAT Number',
				name: 'vatNumber',
				type: 'string',
				default: '',
				description: 'VAT identification number',
			},
		],
	},

	// ----------------------------------
	//         account: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Bill To',
				name: 'billTo',
				type: 'options',
				options: [
					{ name: 'Self', value: 'self' },
					{ name: 'Parent', value: 'parent' },
				],
				default: 'self',
				description: 'Who to bill for this account',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City for the account address',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: 'Company name',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Two-letter ISO country code',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Email address for the account',
			},
			{
				displayName: 'Exemption Certificate',
				name: 'exemptionCertificate',
				type: 'string',
				default: '',
				description: 'Tax exemption certificate number',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name of the account holder',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Last name of the account holder',
			},
			{
				displayName: 'Parent Account ID',
				name: 'parentAccountId',
				type: 'string',
				default: '',
				description: 'Parent account ID for hierarchical billing',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number',
			},
			{
				displayName: 'Postal Code',
				name: 'postalCode',
				type: 'string',
				default: '',
				description: 'Postal or ZIP code',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				description: 'State or province',
			},
			{
				displayName: 'Street 1',
				name: 'street1',
				type: 'string',
				default: '',
				description: 'Street address line 1',
			},
			{
				displayName: 'Street 2',
				name: 'street2',
				type: 'string',
				default: '',
				description: 'Street address line 2',
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				description: 'Username for the account',
			},
			{
				displayName: 'VAT Number',
				name: 'vatNumber',
				type: 'string',
				default: '',
				description: 'VAT identification number',
			},
		],
	},

	// ----------------------------------
	//         account: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Filter accounts by email address',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				options: [
					{ name: 'Created At', value: 'created_at' },
					{ name: 'Updated At', value: 'updated_at' },
				],
				default: 'created_at',
				description: 'Field to sort results by',
			},
			{
				displayName: 'Sort Order',
				name: 'order',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				default: 'desc',
				description: 'Order to sort results',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Closed', value: 'closed' },
				],
				default: 'active',
				description: 'Filter accounts by state',
			},
		],
	},

	// ----------------------------------
	//         account: updateBillingInfo
	// ----------------------------------
	{
		displayName: 'Billing Fields',
		name: 'billingFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['updateBillingInfo'],
			},
		},
		options: [
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City for the billing address',
			},
			{
				displayName: 'Company',
				name: 'company',
				type: 'string',
				default: '',
				description: 'Company name on billing info',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Two-letter ISO country code',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name on billing info',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Last name on billing info',
			},
			{
				displayName: 'Postal Code',
				name: 'postalCode',
				type: 'string',
				default: '',
				description: 'Postal or ZIP code',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				description: 'State or province',
			},
			{
				displayName: 'Street 1',
				name: 'street1',
				type: 'string',
				default: '',
				description: 'Street address line 1',
			},
			{
				displayName: 'Street 2',
				name: 'street2',
				type: 'string',
				default: '',
				description: 'Street address line 2',
			},
			{
				displayName: 'Token ID',
				name: 'tokenId',
				type: 'string',
				default: '',
				description: 'Payment token from Recurly.js',
			},
			{
				displayName: 'VAT Number',
				name: 'vatNumber',
				type: 'string',
				default: '',
				description: 'VAT identification number',
			},
		],
	},
];
