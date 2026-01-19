/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const shippingMethodOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['shippingMethod'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new shipping method',
				action: 'Create a shipping method',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Deactivate a shipping method',
				action: 'Delete a shipping method',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a shipping method',
				action: 'Get a shipping method',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many shipping methods',
				action: 'Get many shipping methods',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a shipping method',
				action: 'Update a shipping method',
			},
		],
		default: 'get',
	},
];

export const shippingMethodFields: INodeProperties[] = [
	// ----------------------------------
	//         shippingMethod: get, update, delete
	// ----------------------------------
	{
		displayName: 'Shipping Method ID',
		name: 'shippingMethodId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['shippingMethod'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The unique shipping method identifier',
	},

	// ----------------------------------
	//         shippingMethod: create
	// ----------------------------------
	{
		displayName: 'Code',
		name: 'code',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['shippingMethod'],
				operation: ['create'],
			},
		},
		description: 'Unique code for the shipping method',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['shippingMethod'],
				operation: ['create'],
			},
		},
		description: 'Display name for the shipping method',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['shippingMethod'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Accounting Code',
				name: 'accountingCode',
				type: 'string',
				default: '',
				description: 'Accounting code for the shipping method',
			},
			{
				displayName: 'Tax Code',
				name: 'taxCode',
				type: 'string',
				default: '',
				description: 'Tax code for the shipping method',
			},
		],
	},

	// ----------------------------------
	//         shippingMethod: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['shippingMethod'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Accounting Code',
				name: 'accountingCode',
				type: 'string',
				default: '',
				description: 'Accounting code for the shipping method',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Display name for the shipping method',
			},
			{
				displayName: 'Tax Code',
				name: 'taxCode',
				type: 'string',
				default: '',
				description: 'Tax code for the shipping method',
			},
		],
	},

	// ----------------------------------
	//         shippingMethod: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['shippingMethod'],
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
				resource: ['shippingMethod'],
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
				resource: ['shippingMethod'],
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
		],
	},
];
