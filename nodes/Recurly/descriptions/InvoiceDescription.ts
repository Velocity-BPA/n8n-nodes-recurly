/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const invoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
			},
		},
		options: [
			{
				name: 'Collect',
				value: 'collect',
				description: 'Attempt to collect payment on an invoice',
				action: 'Collect an invoice',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new invoice (charge invoice)',
				action: 'Create an invoice',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve an invoice by ID or number',
				action: 'Get an invoice',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve many invoices',
				action: 'Get many invoices',
			},
			{
				name: 'Get PDF',
				value: 'getPdf',
				description: 'Download invoice as PDF',
				action: 'Get invoice PDF',
			},
			{
				name: 'Mark Failed',
				value: 'markFailed',
				description: 'Mark collection as failed',
				action: 'Mark invoice as failed',
			},
			{
				name: 'Mark Paid',
				value: 'markPaid',
				description: 'Mark invoice as paid',
				action: 'Mark invoice as paid',
			},
			{
				name: 'Refund',
				value: 'refund',
				description: 'Refund an invoice',
				action: 'Refund an invoice',
			},
			{
				name: 'Void',
				value: 'void',
				description: 'Void an invoice',
				action: 'Void an invoice',
			},
		],
		default: 'get',
	},
];

export const invoiceFields: INodeProperties[] = [
	// ----------------------------------
	//         invoice: get, collect, void, etc.
	// ----------------------------------
	{
		displayName: 'Invoice ID',
		name: 'invoiceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['get', 'collect', 'markFailed', 'markPaid', 'void', 'refund', 'getPdf'],
			},
		},
		description: 'The unique invoice identifier or invoice number',
	},

	// ----------------------------------
	//         invoice: create
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['create'],
			},
		},
		description: 'The account ID to create the invoice for',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		required: true,
		default: 'USD',
		displayOptions: {
			show: {
				resource: ['invoice'],
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
				resource: ['invoice'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Collection Method',
				name: 'collectionMethod',
				type: 'options',
				options: [
					{ name: 'Automatic', value: 'automatic' },
					{ name: 'Manual', value: 'manual' },
				],
				default: 'automatic',
				description: 'How payment should be collected',
			},
			{
				displayName: 'Net Terms',
				name: 'netTerms',
				type: 'number',
				default: 0,
				description: 'Net terms in days',
			},
			{
				displayName: 'PO Number',
				name: 'poNumber',
				type: 'string',
				default: '',
				description: 'Purchase order number',
			},
			{
				displayName: 'Terms And Conditions',
				name: 'termsAndConditions',
				type: 'string',
				default: '',
				description: 'Terms and conditions for the invoice',
			},
			{
				displayName: 'VAT Reverse Charge Notes',
				name: 'vatReverseChargeNotes',
				type: 'string',
				default: '',
				description: 'VAT reverse charge notes',
			},
		],
	},

	// ----------------------------------
	//         invoice: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['invoice'],
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
				resource: ['invoice'],
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
				resource: ['invoice'],
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
				displayName: 'Origin',
				name: 'origin',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Credit', value: 'credit' },
					{ name: 'Gift Card', value: 'gift_card' },
					{ name: 'Immediate Change', value: 'immediate_change' },
					{ name: 'Line Item Refund', value: 'line_item_refund' },
					{ name: 'Open Amount Refund', value: 'open_amount_refund' },
					{ name: 'Purchase', value: 'purchase' },
					{ name: 'Renewal', value: 'renewal' },
					{ name: 'Termination', value: 'termination' },
					{ name: 'Write Off', value: 'write_off' },
				],
				default: '',
				description: 'Filter by invoice origin',
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
					{ name: 'All', value: '' },
					{ name: 'Collected', value: 'collected' },
					{ name: 'Failed', value: 'failed' },
					{ name: 'Open', value: 'open' },
					{ name: 'Past Due', value: 'past_due' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Processing', value: 'processing' },
					{ name: 'Voided', value: 'voided' },
				],
				default: '',
				description: 'Filter invoices by state',
			},
			{
				displayName: 'Subscription ID',
				name: 'subscriptionId',
				type: 'string',
				default: '',
				description: 'Filter by subscription ID',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Charge', value: 'charge' },
					{ name: 'Credit', value: 'credit' },
					{ name: 'Legacy', value: 'legacy' },
				],
				default: '',
				description: 'Filter by invoice type',
			},
		],
	},

	// ----------------------------------
	//         invoice: refund
	// ----------------------------------
	{
		displayName: 'Refund Type',
		name: 'refundType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['refund'],
			},
		},
		options: [
			{
				name: 'Amount',
				value: 'amount',
				description: 'Refund a specific amount',
			},
			{
				name: 'Line Items',
				value: 'line_items',
				description: 'Refund specific line items',
			},
		],
		default: 'amount',
		description: 'Type of refund to issue',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['invoice'],
				operation: ['refund'],
				refundType: ['amount'],
			},
		},
		default: 0,
		description: 'Amount to refund',
	},
];
