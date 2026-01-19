/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const planOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['plan'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new plan',
				action: 'Create a plan',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove a plan',
				action: 'Delete a plan',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a plan by ID or code',
				action: 'Get a plan',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many plans',
				action: 'Get many plans',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update plan details',
				action: 'Update a plan',
			},
		],
		default: 'get',
	},
];

export const planFields: INodeProperties[] = [
	// ----------------------------------
	//         plan: get, update, delete
	// ----------------------------------
	{
		displayName: 'Plan ID',
		name: 'planId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The unique plan identifier or plan code',
	},

	// ----------------------------------
	//         plan: create
	// ----------------------------------
	{
		displayName: 'Plan Code',
		name: 'planCode',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['create'],
			},
		},
		description: 'Unique code to identify the plan',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['create'],
			},
		},
		description: 'Display name for the plan',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		default: 'USD',
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['create'],
			},
		},
		description: 'Currency code (ISO 4217)',
	},
	{
		displayName: 'Unit Amount',
		name: 'unitAmount',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['create'],
			},
		},
		description: 'Price per unit in the specified currency',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Accounting Code',
				name: 'accountingCode',
				type: 'string',
				default: '',
				description: 'Accounting code for the plan',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Plan description',
			},
			{
				displayName: 'Interval Length',
				name: 'intervalLength',
				type: 'number',
				default: 1,
				description: 'Number of intervals between billing cycles',
			},
			{
				displayName: 'Interval Unit',
				name: 'intervalUnit',
				type: 'options',
				options: [
					{ name: 'Days', value: 'days' },
					{ name: 'Months', value: 'months' },
				],
				default: 'months',
				description: 'Unit for billing interval',
			},
			{
				displayName: 'Setup Fee',
				name: 'setupFee',
				type: 'number',
				default: 0,
				description: 'One-time setup fee',
			},
			{
				displayName: 'Setup Fee Accounting Code',
				name: 'setupFeeAccountingCode',
				type: 'string',
				default: '',
				description: 'Accounting code for setup fee',
			},
			{
				displayName: 'Tax Code',
				name: 'taxCode',
				type: 'string',
				default: '',
				description: 'Avalara tax code',
			},
			{
				displayName: 'Tax Exempt',
				name: 'taxExempt',
				type: 'boolean',
				default: false,
				description: 'Whether the plan is tax exempt',
			},
			{
				displayName: 'Trial Length',
				name: 'trialLength',
				type: 'number',
				default: 0,
				description: 'Length of trial period',
			},
			{
				displayName: 'Trial Unit',
				name: 'trialUnit',
				type: 'options',
				options: [
					{ name: 'Days', value: 'days' },
					{ name: 'Months', value: 'months' },
				],
				default: 'days',
				description: 'Unit for trial period',
			},
		],
	},

	// ----------------------------------
	//         plan: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Accounting Code',
				name: 'accountingCode',
				type: 'string',
				default: '',
				description: 'Accounting code for the plan',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Plan description',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Display name for the plan',
			},
			{
				displayName: 'Tax Code',
				name: 'taxCode',
				type: 'string',
				default: '',
				description: 'Avalara tax code',
			},
			{
				displayName: 'Tax Exempt',
				name: 'taxExempt',
				type: 'boolean',
				default: false,
				description: 'Whether the plan is tax exempt',
			},
		],
	},

	// ----------------------------------
	//         plan: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['plan'],
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
				resource: ['plan'],
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
				resource: ['plan'],
				operation: ['getAll'],
			},
		},
		options: [
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
					{ name: 'Inactive', value: 'inactive' },
				],
				default: 'active',
				description: 'Filter plans by state',
			},
		],
	},
];
