/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const addOnOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['addOn'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new add-on for a plan',
				action: 'Create an add-on',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove an add-on from a plan',
				action: 'Delete an add-on',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve an add-on by ID',
				action: 'Get an add-on',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve add-ons for a plan',
				action: 'Get many add-ons',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an add-on',
				action: 'Update an add-on',
			},
		],
		default: 'get',
	},
];

export const addOnFields: INodeProperties[] = [
	// ----------------------------------
	//         addOn: get, update, delete
	// ----------------------------------
	{
		displayName: 'Plan ID',
		name: 'planId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['addOn'],
				operation: ['get', 'update', 'delete', 'getAll', 'create'],
			},
		},
		description: 'The plan ID or plan code',
	},
	{
		displayName: 'Add-On ID',
		name: 'addOnId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['addOn'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The add-on ID or add-on code',
	},

	// ----------------------------------
	//         addOn: create
	// ----------------------------------
	{
		displayName: 'Add-On Code',
		name: 'addOnCode',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['addOn'],
				operation: ['create'],
			},
		},
		description: 'Unique code for the add-on',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['addOn'],
				operation: ['create'],
			},
		},
		description: 'Display name for the add-on',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		default: 'USD',
		displayOptions: {
			show: {
				resource: ['addOn'],
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
				resource: ['addOn'],
				operation: ['create'],
			},
		},
		description: 'Price per unit',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['addOn'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Accounting Code',
				name: 'accountingCode',
				type: 'string',
				default: '',
				description: 'Accounting code for the add-on',
			},
			{
				displayName: 'Add-On Type',
				name: 'addOnType',
				type: 'options',
				options: [
					{ name: 'Fixed', value: 'fixed' },
					{ name: 'Usage', value: 'usage' },
				],
				default: 'fixed',
				description: 'Type of add-on',
			},
			{
				displayName: 'Default Quantity',
				name: 'defaultQuantity',
				type: 'number',
				default: 1,
				description: 'Default quantity for the add-on',
			},
			{
				displayName: 'Display Quantity',
				name: 'displayQuantity',
				type: 'boolean',
				default: true,
				description: 'Whether to show quantity on hosted pages',
			},
			{
				displayName: 'Measured Unit ID',
				name: 'measuredUnitId',
				type: 'string',
				default: '',
				description: 'Measured unit ID for usage-based add-ons',
			},
			{
				displayName: 'Optional',
				name: 'optional',
				type: 'boolean',
				default: true,
				description: 'Whether the add-on is optional',
			},
			{
				displayName: 'Revenue Schedule Type',
				name: 'revenueScheduleType',
				type: 'options',
				options: [
					{ name: 'At Invoice', value: 'at_invoice' },
					{ name: 'At Range End', value: 'at_range_end' },
					{ name: 'At Range Start', value: 'at_range_start' },
					{ name: 'Evenly', value: 'evenly' },
					{ name: 'Never', value: 'never' },
				],
				default: 'at_invoice',
				description: 'How revenue should be recognized',
			},
			{
				displayName: 'Tax Code',
				name: 'taxCode',
				type: 'string',
				default: '',
				description: 'Tax code for the add-on',
			},
			{
				displayName: 'Usage Percentage',
				name: 'usagePercentage',
				type: 'number',
				default: 0,
				description: 'Percentage for usage-based pricing',
			},
			{
				displayName: 'Usage Type',
				name: 'usageType',
				type: 'options',
				options: [
					{ name: 'Percentage', value: 'percentage' },
					{ name: 'Price', value: 'price' },
				],
				default: 'price',
				description: 'How usage is calculated',
			},
		],
	},

	// ----------------------------------
	//         addOn: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['addOn'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Accounting Code',
				name: 'accountingCode',
				type: 'string',
				default: '',
				description: 'Accounting code for the add-on',
			},
			{
				displayName: 'Default Quantity',
				name: 'defaultQuantity',
				type: 'number',
				default: 1,
				description: 'Default quantity for the add-on',
			},
			{
				displayName: 'Display Quantity',
				name: 'displayQuantity',
				type: 'boolean',
				default: true,
				description: 'Whether to show quantity on hosted pages',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Display name for the add-on',
			},
			{
				displayName: 'Optional',
				name: 'optional',
				type: 'boolean',
				default: true,
				description: 'Whether the add-on is optional',
			},
			{
				displayName: 'Tax Code',
				name: 'taxCode',
				type: 'string',
				default: '',
				description: 'Tax code for the add-on',
			},
		],
	},

	// ----------------------------------
	//         addOn: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['addOn'],
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
				resource: ['addOn'],
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
				resource: ['addOn'],
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
				description: 'Filter add-ons by state',
			},
		],
	},
];
