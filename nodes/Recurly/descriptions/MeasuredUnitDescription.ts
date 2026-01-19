/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const measuredUnitOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['measuredUnit'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new measured unit',
				action: 'Create a measured unit',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Deactivate a measured unit',
				action: 'Delete a measured unit',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a measured unit',
				action: 'Get a measured unit',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many measured units',
				action: 'Get many measured units',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a measured unit',
				action: 'Update a measured unit',
			},
		],
		default: 'get',
	},
];

export const measuredUnitFields: INodeProperties[] = [
	// ----------------------------------
	//         measuredUnit: get, update, delete
	// ----------------------------------
	{
		displayName: 'Measured Unit ID',
		name: 'measuredUnitId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['measuredUnit'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The unique measured unit identifier',
	},

	// ----------------------------------
	//         measuredUnit: create
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['measuredUnit'],
				operation: ['create'],
			},
		},
		description: 'Internal name for the measured unit',
	},
	{
		displayName: 'Display Name',
		name: 'displayName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['measuredUnit'],
				operation: ['create'],
			},
		},
		description: 'Display name for the measured unit',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['measuredUnit'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the measured unit',
			},
		],
	},

	// ----------------------------------
	//         measuredUnit: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['measuredUnit'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the measured unit',
			},
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				description: 'Display name for the measured unit',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Internal name for the measured unit',
			},
		],
	},

	// ----------------------------------
	//         measuredUnit: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['measuredUnit'],
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
				resource: ['measuredUnit'],
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
				resource: ['measuredUnit'],
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
				description: 'Filter measured units by state',
			},
		],
	},
];
