/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const subscriptionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['subscription'],
			},
		},
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a subscription',
				action: 'Cancel a subscription',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new subscription',
				action: 'Create a subscription',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a subscription by ID',
				action: 'Get a subscription',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many subscriptions',
				action: 'Get many subscriptions',
			},
			{
				name: 'Pause',
				value: 'pause',
				description: 'Pause a subscription',
				action: 'Pause a subscription',
			},
			{
				name: 'Postpone',
				value: 'postpone',
				description: 'Postpone next renewal date',
				action: 'Postpone a subscription',
			},
			{
				name: 'Reactivate',
				value: 'reactivate',
				description: 'Reactivate a canceled subscription',
				action: 'Reactivate a subscription',
			},
			{
				name: 'Resume',
				value: 'resume',
				description: 'Resume a paused subscription',
				action: 'Resume a subscription',
			},
			{
				name: 'Terminate',
				value: 'terminate',
				description: 'Immediately terminate a subscription',
				action: 'Terminate a subscription',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update subscription settings',
				action: 'Update a subscription',
			},
		],
		default: 'get',
	},
];

export const subscriptionFields: INodeProperties[] = [
	// ----------------------------------
	//         subscription: get, update, cancel, etc.
	// ----------------------------------
	{
		displayName: 'Subscription ID',
		name: 'subscriptionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['get', 'update', 'cancel', 'reactivate', 'pause', 'resume', 'terminate', 'postpone'],
			},
		},
		description: 'The unique subscription identifier (uuid)',
	},

	// ----------------------------------
	//         subscription: create
	// ----------------------------------
	{
		displayName: 'Plan Code',
		name: 'planCode',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create'],
			},
		},
		description: 'The plan code to subscribe to',
	},
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['create'],
			},
		},
		description: 'The account ID or code for the subscription',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		default: 'USD',
		displayOptions: {
			show: {
				resource: ['subscription'],
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
				resource: ['subscription'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Auto Renew',
				name: 'autoRenew',
				type: 'boolean',
				default: true,
				description: 'Whether the subscription should auto-renew',
			},
			{
				displayName: 'Collection Method',
				name: 'collectionMethod',
				type: 'options',
				options: [
					{ name: 'Automatic', value: 'automatic' },
					{ name: 'Manual', value: 'manual' },
				],
				default: 'automatic',
				description: 'How payment is collected',
			},
			{
				displayName: 'Coupon Codes',
				name: 'couponCodes',
				type: 'string',
				default: '',
				description: 'Comma-separated list of coupon codes to apply',
			},
			{
				displayName: 'Net Terms',
				name: 'netTerms',
				type: 'number',
				default: 0,
				description: 'Net terms in days for manual invoicing',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 1,
				description: 'Subscription quantity (for quantity-based plans)',
			},
			{
				displayName: 'Renewal Billing Cycles',
				name: 'renewalBillingCycles',
				type: 'number',
				default: 0,
				description: 'Number of renewal billing cycles (0 = unlimited)',
			},
			{
				displayName: 'Starts At',
				name: 'startsAt',
				type: 'dateTime',
				default: '',
				description: 'When the subscription should start',
			},
			{
				displayName: 'Total Billing Cycles',
				name: 'totalBillingCycles',
				type: 'number',
				default: 0,
				description: 'Total number of billing cycles (0 = unlimited)',
			},
			{
				displayName: 'Trial Ends At',
				name: 'trialEndsAt',
				type: 'dateTime',
				default: '',
				description: 'When the trial period should end',
			},
			{
				displayName: 'Unit Amount',
				name: 'unitAmount',
				type: 'number',
				default: 0,
				description: 'Custom unit amount (overrides plan price)',
			},
		],
	},

	// ----------------------------------
	//         subscription: update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Auto Renew',
				name: 'autoRenew',
				type: 'boolean',
				default: true,
				description: 'Whether the subscription should auto-renew',
			},
			{
				displayName: 'Collection Method',
				name: 'collectionMethod',
				type: 'options',
				options: [
					{ name: 'Automatic', value: 'automatic' },
					{ name: 'Manual', value: 'manual' },
				],
				default: 'automatic',
				description: 'How payment is collected',
			},
			{
				displayName: 'Net Terms',
				name: 'netTerms',
				type: 'number',
				default: 0,
				description: 'Net terms in days for manual invoicing',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				default: 1,
				description: 'Subscription quantity',
			},
			{
				displayName: 'Renewal Billing Cycles',
				name: 'renewalBillingCycles',
				type: 'number',
				default: 0,
				description: 'Number of renewal billing cycles',
			},
			{
				displayName: 'Unit Amount',
				name: 'unitAmount',
				type: 'number',
				default: 0,
				description: 'Custom unit amount',
			},
		],
	},

	// ----------------------------------
	//         subscription: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['subscription'],
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
				resource: ['subscription'],
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
				resource: ['subscription'],
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
				displayName: 'Plan Code',
				name: 'planCode',
				type: 'string',
				default: '',
				description: 'Filter by plan code',
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
					{ name: 'Canceled', value: 'canceled' },
					{ name: 'Expired', value: 'expired' },
					{ name: 'Failed', value: 'failed' },
					{ name: 'Future', value: 'future' },
					{ name: 'Paused', value: 'paused' },
				],
				default: 'active',
				description: 'Filter subscriptions by state',
			},
		],
	},

	// ----------------------------------
	//         subscription: cancel
	// ----------------------------------
	{
		displayName: 'Timeframe',
		name: 'timeframe',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['cancel'],
			},
		},
		options: [
			{
				name: 'At Term End',
				value: 'term_end',
				description: 'Cancel at end of current billing period',
			},
			{
				name: 'Immediately',
				value: 'immediately',
				description: 'Cancel immediately',
			},
		],
		default: 'term_end',
		description: 'When to cancel the subscription',
	},

	// ----------------------------------
	//         subscription: terminate
	// ----------------------------------
	{
		displayName: 'Refund Type',
		name: 'refundType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['terminate'],
			},
		},
		options: [
			{
				name: 'Full',
				value: 'full',
				description: 'Issue a full refund',
			},
			{
				name: 'None',
				value: 'none',
				description: 'Do not issue a refund',
			},
			{
				name: 'Partial',
				value: 'partial',
				description: 'Issue a prorated refund',
			},
		],
		default: 'none',
		description: 'Type of refund to issue',
	},

	// ----------------------------------
	//         subscription: postpone
	// ----------------------------------
	{
		displayName: 'Next Renewal Date',
		name: 'nextRenewalDate',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['postpone'],
			},
		},
		description: 'The new date for the next renewal',
	},

	// ----------------------------------
	//         subscription: pause
	// ----------------------------------
	{
		displayName: 'Remaining Pause Cycles',
		name: 'remainingPauseCycles',
		type: 'number',
		required: true,
		default: 1,
		displayOptions: {
			show: {
				resource: ['subscription'],
				operation: ['pause'],
			},
		},
		description: 'Number of billing cycles to pause',
	},
];
