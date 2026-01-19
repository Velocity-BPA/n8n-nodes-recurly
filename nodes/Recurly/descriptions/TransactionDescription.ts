/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const transactionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a manual transaction',
				action: 'Create a transaction',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a transaction by ID',
				action: 'Get a transaction',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many transactions',
				action: 'Get many transactions',
			},
			{
				name: 'Refund',
				value: 'refund',
				description: 'Refund a transaction',
				action: 'Refund a transaction',
			},
			{
				name: 'Void',
				value: 'void',
				description: 'Void a transaction',
				action: 'Void a transaction',
			},
		],
		default: 'get',
	},
];

export const transactionFields: INodeProperties[] = [
	// ----------------------------------
	//         transaction: get, refund, void
	// ----------------------------------
	{
		displayName: 'Transaction ID',
		name: 'transactionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['get', 'refund', 'void'],
			},
		},
		description: 'The unique transaction identifier',
	},

	// ----------------------------------
	//         transaction: create
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['create'],
			},
		},
		description: 'The account ID for the transaction',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['create'],
			},
		},
		description: 'Transaction amount in the account currency',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		default: 'USD',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['create'],
			},
		},
		description: 'Currency code (ISO 4217)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the transaction',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Moto', value: 'moto' },
					{ name: 'Purchase', value: 'purchase' },
					{ name: 'Verify', value: 'verify' },
				],
				default: 'purchase',
				description: 'Type of transaction',
			},
		],
	},

	// ----------------------------------
	//         transaction: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['transaction'],
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
				resource: ['transaction'],
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
				resource: ['transaction'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				default: '',
				description: 'Filter by account ID',
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
				displayName: 'Success',
				name: 'success',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Failed', value: 'false' },
					{ name: 'Successful', value: 'true' },
				],
				default: '',
				description: 'Filter by transaction success status',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Authorization', value: 'authorization' },
					{ name: 'Capture', value: 'capture' },
					{ name: 'Purchase', value: 'purchase' },
					{ name: 'Refund', value: 'refund' },
					{ name: 'Verify', value: 'verify' },
				],
				default: '',
				description: 'Filter by transaction type',
			},
		],
	},

	// ----------------------------------
	//         transaction: refund
	// ----------------------------------
	{
		displayName: 'Amount',
		name: 'refundAmount',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['refund'],
			},
		},
		default: 0,
		description: 'Amount to refund (leave empty for full refund)',
	},
];
