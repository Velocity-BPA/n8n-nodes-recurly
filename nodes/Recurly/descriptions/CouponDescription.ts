/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const couponOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['coupon'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new coupon',
				action: 'Create a coupon',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Deactivate a coupon',
				action: 'Delete a coupon',
			},
			{
				name: 'Generate Codes',
				value: 'generateCodes',
				description: 'Generate unique coupon codes',
				action: 'Generate coupon codes',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a coupon by ID or code',
				action: 'Get a coupon',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many coupons',
				action: 'Get many coupons',
			},
			{
				name: 'Restore',
				value: 'restore',
				description: 'Restore a deactivated coupon',
				action: 'Restore a coupon',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update coupon details',
				action: 'Update a coupon',
			},
		],
		default: 'get',
	},
];

export const couponFields: INodeProperties[] = [
	// ----------------------------------
	//         coupon: get, update, delete, restore, generateCodes
	// ----------------------------------
	{
		displayName: 'Coupon ID',
		name: 'couponId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['coupon'],
				operation: ['get', 'update', 'delete', 'restore', 'generateCodes'],
			},
		},
		description: 'The unique coupon identifier or coupon code',
	},

	// ----------------------------------
	//         coupon: create
	// ----------------------------------
	{
		displayName: 'Coupon Code',
		name: 'couponCode',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['coupon'],
				operation: ['create'],
			},
		},
		description: 'Unique code for the coupon',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['coupon'],
				operation: ['create'],
			},
		},
		description: 'Display name for the coupon',
	},
	{
		displayName: 'Discount Type',
		name: 'discountType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['coupon'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Fixed Amount', value: 'fixed' },
			{ name: 'Free Trial', value: 'free_trial' },
			{ name: 'Percent', value: 'percent' },
		],
		default: 'percent',
		description: 'Type of discount',
	},
	{
		displayName: 'Discount Percent',
		name: 'discountPercent',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['coupon'],
				operation: ['create'],
				discountType: ['percent'],
			},
		},
		default: 10,
		description: 'Percentage discount (1-100)',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['coupon'],
				operation: ['create'],
				discountType: ['fixed'],
			},
		},
		default: 'USD',
		description: 'Currency for fixed discount',
	},
	{
		displayName: 'Discount Amount',
		name: 'discountAmount',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['coupon'],
				operation: ['create'],
				discountType: ['fixed'],
			},
		},
		default: 0,
		description: 'Fixed discount amount',
	},
	{
		displayName: 'Free Trial Unit',
		name: 'freeTrialUnit',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['coupon'],
				operation: ['create'],
				discountType: ['free_trial'],
			},
		},
		options: [
			{ name: 'Days', value: 'day' },
			{ name: 'Months', value: 'month' },
			{ name: 'Weeks', value: 'week' },
		],
		default: 'day',
		description: 'Unit for free trial period',
	},
	{
		displayName: 'Free Trial Amount',
		name: 'freeTrialAmount',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['coupon'],
				operation: ['create'],
				discountType: ['free_trial'],
			},
		},
		default: 7,
		description: 'Length of free trial',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['coupon'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Applies to All Items',
				name: 'appliesToAllItems',
				type: 'boolean',
				default: true,
				description: 'Whether the coupon applies to all items',
			},
			{
				displayName: 'Applies to All Plans',
				name: 'appliesToAllPlans',
				type: 'boolean',
				default: true,
				description: 'Whether the coupon applies to all plans',
			},
			{
				displayName: 'Duration',
				name: 'duration',
				type: 'options',
				options: [
					{ name: 'Forever', value: 'forever' },
					{ name: 'Single Use', value: 'single_use' },
					{ name: 'Temporal', value: 'temporal' },
				],
				default: 'single_use',
				description: 'How long the coupon discount applies',
			},
			{
				displayName: 'Max Redemptions',
				name: 'maxRedemptions',
				type: 'number',
				default: 0,
				description: 'Maximum total redemptions (0 = unlimited)',
			},
			{
				displayName: 'Max Redemptions Per Account',
				name: 'maxRedemptionsPerAccount',
				type: 'number',
				default: 1,
				description: 'Maximum redemptions per account',
			},
			{
				displayName: 'Plan Codes',
				name: 'planCodes',
				type: 'string',
				default: '',
				description: 'Comma-separated list of plan codes (if not applying to all plans)',
			},
			{
				displayName: 'Redeem By Date',
				name: 'redeemByDate',
				type: 'dateTime',
				default: '',
				description: 'Expiration date for the coupon',
			},
			{
				displayName: 'Temporal Amount',
				name: 'temporalAmount',
				type: 'number',
				default: 1,
				description: 'Number of temporal units the discount applies',
			},
			{
				displayName: 'Temporal Unit',
				name: 'temporalUnit',
				type: 'options',
				options: [
					{ name: 'Days', value: 'day' },
					{ name: 'Months', value: 'month' },
					{ name: 'Weeks', value: 'week' },
					{ name: 'Years', value: 'year' },
				],
				default: 'month',
				description: 'Unit for temporal duration',
			},
		],
	},

	// ----------------------------------
	//         coupon: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['coupon'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Max Redemptions',
				name: 'maxRedemptions',
				type: 'number',
				default: 0,
				description: 'Maximum total redemptions',
			},
			{
				displayName: 'Max Redemptions Per Account',
				name: 'maxRedemptionsPerAccount',
				type: 'number',
				default: 1,
				description: 'Maximum redemptions per account',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Display name for the coupon',
			},
			{
				displayName: 'Redeem By Date',
				name: 'redeemByDate',
				type: 'dateTime',
				default: '',
				description: 'Expiration date for the coupon',
			},
		],
	},

	// ----------------------------------
	//         coupon: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['coupon'],
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
				resource: ['coupon'],
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
				resource: ['coupon'],
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
					{ name: 'Expired', value: 'expired' },
					{ name: 'Inactive', value: 'inactive' },
					{ name: 'Maxed Out', value: 'maxed_out' },
					{ name: 'Redeemable', value: 'redeemable' },
				],
				default: '',
				description: 'Filter coupons by state',
			},
		],
	},

	// ----------------------------------
	//         coupon: generateCodes
	// ----------------------------------
	{
		displayName: 'Number of Codes',
		name: 'numberOfCodes',
		type: 'number',
		required: true,
		default: 10,
		displayOptions: {
			show: {
				resource: ['coupon'],
				operation: ['generateCodes'],
			},
		},
		description: 'Number of unique codes to generate',
	},
];
