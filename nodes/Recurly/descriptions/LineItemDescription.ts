/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const lineItemOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lineItem'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a pending line item',
				action: 'Create a line item',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Remove a pending line item',
				action: 'Delete a line item',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a line item by ID',
				action: 'Get a line item',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve line items for an account',
				action: 'Get many line items',
			},
		],
		default: 'get',
	},
];

export const lineItemFields: INodeProperties[] = [
	// ----------------------------------
	//         lineItem: get, delete
	// ----------------------------------
	{
		displayName: 'Line Item ID',
		name: 'lineItemId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['get', 'delete'],
			},
		},
		description: 'The unique line item identifier',
	},

	// ----------------------------------
	//         lineItem: create
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['create'],
			},
		},
		description: 'The account ID for the line item',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		default: 'USD',
		displayOptions: {
			show: {
				resource: ['lineItem'],
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
				resource: ['lineItem'],
				operation: ['create'],
			},
		},
		description: 'Unit amount for the line item',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Charge', value: 'charge' },
			{ name: 'Credit', value: 'credit' },
		],
		default: 'charge',
		description: 'Type of line item',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Accounting Code',
				name: 'accountingCode',
				type: 'string',
				default: '',
				description: 'Accounting code for the line item',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the line item',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for the service period',
			},
			{
				displayName: 'Product Code',
				name: 'productCode',
				type: 'string',
				default: '',
				description: 'Product code for the line item',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 1,
				description: 'Quantity of items',
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
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for the service period',
			},
			{
				displayName: 'Tax Code',
				name: 'taxCode',
				type: 'string',
				default: '',
				description: 'Tax code for the line item',
			},
			{
				displayName: 'Tax Exempt',
				name: 'taxExempt',
				type: 'boolean',
				default: false,
				description: 'Whether the line item is tax exempt',
			},
		],
	},

	// ----------------------------------
	//         lineItem: getAll
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['lineItem'],
				operation: ['getAll'],
			},
		},
		description: 'The account ID to retrieve line items for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['lineItem'],
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
				resource: ['lineItem'],
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
				resource: ['lineItem'],
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
					{ name: 'All', value: '' },
					{ name: 'Invoiced', value: 'invoiced' },
					{ name: 'Pending', value: 'pending' },
				],
				default: '',
				description: 'Filter line items by state',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Charge', value: 'charge' },
					{ name: 'Credit', value: 'credit' },
				],
				default: '',
				description: 'Filter by line item type',
			},
		],
	},
];
