/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const usageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['usage'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Record usage for a subscription',
				action: 'Create a usage record',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a usage record',
				action: 'Delete a usage record',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a usage record',
				action: 'Get a usage record',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve usage records',
				action: 'Get many usage records',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a usage record',
				action: 'Update a usage record',
			},
		],
		default: 'get',
	},
];

export const usageFields: INodeProperties[] = [
	// ----------------------------------
	//         usage: get, update, delete
	// ----------------------------------
	{
		displayName: 'Usage ID',
		name: 'usageId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['usage'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The unique usage record identifier',
	},

	// ----------------------------------
	//         usage: create
	// ----------------------------------
	{
		displayName: 'Subscription ID',
		name: 'subscriptionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['usage'],
				operation: ['create', 'getAll'],
			},
		},
		description: 'The subscription ID',
	},
	{
		displayName: 'Add-On ID',
		name: 'addOnId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['usage'],
				operation: ['create', 'getAll'],
			},
		},
		description: 'The add-on ID for usage-based billing',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['usage'],
				operation: ['create'],
			},
		},
		description: 'Usage amount to record',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['usage'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Merchant Tag',
				name: 'merchantTag',
				type: 'string',
				default: '',
				description: 'Custom identifier for the usage record',
			},
			{
				displayName: 'Recording Timestamp',
				name: 'recordingTimestamp',
				type: 'dateTime',
				default: '',
				description: 'When the usage was recorded',
			},
			{
				displayName: 'Usage Timestamp',
				name: 'usageTimestamp',
				type: 'dateTime',
				default: '',
				description: 'When the usage occurred',
			},
		],
	},

	// ----------------------------------
	//         usage: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['usage'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				description: 'Usage amount',
			},
			{
				displayName: 'Merchant Tag',
				name: 'merchantTag',
				type: 'string',
				default: '',
				description: 'Custom identifier for the usage record',
			},
			{
				displayName: 'Recording Timestamp',
				name: 'recordingTimestamp',
				type: 'dateTime',
				default: '',
				description: 'When the usage was recorded',
			},
			{
				displayName: 'Usage Timestamp',
				name: 'usageTimestamp',
				type: 'dateTime',
				default: '',
				description: 'When the usage occurred',
			},
		],
	},

	// ----------------------------------
	//         usage: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['usage'],
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
				resource: ['usage'],
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
				resource: ['usage'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Billing Status',
				name: 'billingStatus',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Billed', value: 'billed' },
					{ name: 'Unbilled', value: 'unbilled' },
				],
				default: '',
				description: 'Filter by billing status',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				options: [
					{ name: 'Recording Timestamp', value: 'recording_timestamp' },
					{ name: 'Usage Timestamp', value: 'usage_timestamp' },
				],
				default: 'recording_timestamp',
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
		],
	},
];
