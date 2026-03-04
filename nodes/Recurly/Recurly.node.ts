/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-recurly/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Recurly implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Recurly',
    name: 'recurly',
    icon: 'file:recurly.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Recurly API',
    defaults: {
      name: 'Recurly',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'recurlyApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Accounts',
            value: 'accounts',
          },
          {
            name: 'Subscriptions',
            value: 'subscriptions',
          },
          {
            name: 'Plans',
            value: 'plans',
          },
          {
            name: 'Invoices',
            value: 'invoices',
          },
          {
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'Coupons',
            value: 'coupons',
          },
          {
            name: 'AddOns',
            value: 'addOns',
          },
          {
            name: 'Webhooks',
            value: 'webhooks',
          }
        ],
        default: 'accounts',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
    },
  },
  options: [
    {
      name: 'List Accounts',
      value: 'listAccounts',
      description: 'List all accounts',
      action: 'List accounts',
    },
    {
      name: 'Create Account',
      value: 'createAccount',
      description: 'Create a new account',
      action: 'Create account',
    },
    {
      name: 'Get Account',
      value: 'getAccount',
      description: 'Fetch an account',
      action: 'Get account',
    },
    {
      name: 'Update Account',
      value: 'updateAccount',
      description: 'Update an account',
      action: 'Update account',
    },
    {
      name: 'Delete Account',
      value: 'deleteAccount',
      description: 'Delete an account',
      action: 'Delete account',
    },
    {
      name: 'Reopen Account',
      value: 'reopenAccount',
      description: 'Reopen a closed account',
      action: 'Reopen account',
    },
  ],
  default: 'listAccounts',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['subscriptions'],
    },
  },
  options: [
    {
      name: 'List Subscriptions',
      value: 'listSubscriptions',
      description: 'List subscriptions',
      action: 'List subscriptions',
    },
    {
      name: 'Create Subscription',
      value: 'createSubscription',
      description: 'Create a subscription',
      action: 'Create subscription',
    },
    {
      name: 'Get Subscription',
      value: 'getSubscription',
      description: 'Fetch a subscription',
      action: 'Get subscription',
    },
    {
      name: 'Update Subscription',
      value: 'updateSubscription',
      description: 'Update a subscription',
      action: 'Update subscription',
    },
    {
      name: 'Cancel Subscription',
      value: 'cancelSubscription',
      description: 'Cancel a subscription',
      action: 'Cancel subscription',
    },
    {
      name: 'Reactivate Subscription',
      value: 'reactivateSubscription',
      description: 'Reactivate a canceled subscription',
      action: 'Reactivate subscription',
    },
    {
      name: 'Pause Subscription',
      value: 'pauseSubscription',
      description: 'Pause subscription',
      action: 'Pause subscription',
    },
    {
      name: 'Resume Subscription',
      value: 'resumeSubscription',
      description: 'Resume paused subscription',
      action: 'Resume subscription',
    },
  ],
  default: 'listSubscriptions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['plans'],
    },
  },
  options: [
    {
      name: 'List Plans',
      value: 'listPlans',
      description: 'List subscription plans',
      action: 'List plans',
    },
    {
      name: 'Create Plan',
      value: 'createPlan',
      description: 'Create a new subscription plan',
      action: 'Create plan',
    },
    {
      name: 'Get Plan',
      value: 'getPlan',
      description: 'Fetch a specific plan by ID',
      action: 'Get plan',
    },
    {
      name: 'Update Plan',
      value: 'updatePlan',
      description: 'Update an existing plan',
      action: 'Update plan',
    },
    {
      name: 'Delete Plan',
      value: 'deletePlan',
      description: 'Delete a plan',
      action: 'Delete plan',
    },
  ],
  default: 'listPlans',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['invoices'],
    },
  },
  options: [
    {
      name: 'List Invoices',
      value: 'listInvoices',
      description: 'List invoices',
      action: 'List invoices',
    },
    {
      name: 'Create Invoice',
      value: 'createInvoice',
      description: 'Create an invoice',
      action: 'Create invoice',
    },
    {
      name: 'Get Invoice',
      value: 'getInvoice',
      description: 'Fetch an invoice',
      action: 'Get invoice',
    },
    {
      name: 'Update Invoice',
      value: 'updateInvoice',
      description: 'Update an invoice',
      action: 'Update invoice',
    },
    {
      name: 'Delete Invoice',
      value: 'deleteInvoice',
      description: 'Delete an invoice',
      action: 'Delete invoice',
    },
    {
      name: 'Collect Invoice',
      value: 'collectInvoice',
      description: 'Force collection of an invoice',
      action: 'Collect invoice',
    },
    {
      name: 'Mark Invoice Successful',
      value: 'markInvoiceSuccessful',
      description: 'Mark an open invoice as successful',
      action: 'Mark invoice successful',
    },
    {
      name: 'Mark Invoice Failed',
      value: 'markInvoiceFailed',
      description: 'Mark an open invoice as failed',
      action: 'Mark invoice failed',
    },
    {
      name: 'Refund Invoice',
      value: 'refundInvoice',
      description: 'Refund an invoice',
      action: 'Refund invoice',
    },
  ],
  default: 'listInvoices',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
    },
  },
  options: [
    {
      name: 'List Transactions',
      value: 'listTransactions',
      description: 'List all transactions',
      action: 'List transactions',
    },
    {
      name: 'Create Transaction',
      value: 'createTransaction',
      description: 'Create a new transaction',
      action: 'Create transaction',
    },
    {
      name: 'Get Transaction',
      value: 'getTransaction',
      description: 'Fetch a single transaction',
      action: 'Get transaction',
    },
    {
      name: 'Delete Transaction',
      value: 'deleteTransaction',
      description: 'Delete a transaction',
      action: 'Delete transaction',
    },
    {
      name: 'Refund Transaction',
      value: 'refundTransaction',
      description: 'Refund a transaction',
      action: 'Refund transaction',
    },
  ],
  default: 'listTransactions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['coupons'],
    },
  },
  options: [
    {
      name: 'List Coupons',
      value: 'listCoupons',
      description: 'Get a list of coupons',
      action: 'List coupons',
    },
    {
      name: 'Create Coupon',
      value: 'createCoupon',
      description: 'Create a new coupon',
      action: 'Create coupon',
    },
    {
      name: 'Get Coupon',
      value: 'getCoupon',
      description: 'Fetch a coupon by ID',
      action: 'Get coupon',
    },
    {
      name: 'Update Coupon',
      value: 'updateCoupon',
      description: 'Update an existing coupon',
      action: 'Update coupon',
    },
    {
      name: 'Delete Coupon',
      value: 'deleteCoupon',
      description: 'Delete a coupon',
      action: 'Delete coupon',
    },
    {
      name: 'Restore Coupon',
      value: 'restoreCoupon',
      description: 'Restore a deleted coupon',
      action: 'Restore coupon',
    },
  ],
  default: 'listCoupons',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['addOns'],
    },
  },
  options: [
    {
      name: 'List Plan Add-ons',
      value: 'listPlanAddOns',
      description: 'List a plan\'s add-ons',
      action: 'List plan add-ons',
    },
    {
      name: 'Create Plan Add-on',
      value: 'createPlanAddOn',
      description: 'Create an add-on for a plan',
      action: 'Create plan add-on',
    },
    {
      name: 'Get Plan Add-on',
      value: 'getPlanAddOn',
      description: 'Fetch a plan\'s add-on',
      action: 'Get plan add-on',
    },
    {
      name: 'Update Plan Add-on',
      value: 'updatePlanAddOn',
      description: 'Update an add-on',
      action: 'Update plan add-on',
    },
    {
      name: 'Delete Plan Add-on',
      value: 'deletePlanAddOn',
      description: 'Delete an add-on',
      action: 'Delete plan add-on',
    },
  ],
  default: 'listPlanAddOns',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['webhooks'],
    },
  },
  options: [
    {
      name: 'List Webhook Notifications',
      value: 'listWebhooks',
      description: 'List webhook notifications',
      action: 'List webhook notifications',
    },
    {
      name: 'Get Webhook Notification',
      value: 'getWebhook',
      description: 'Fetch a webhook notification',
      action: 'Get webhook notification',
    },
  ],
  default: 'listWebhooks',
},
      // Parameter definitions
{
  displayName: 'Account IDs',
  name: 'ids',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['listAccounts'],
    },
  },
  default: '',
  description: 'Filter results by a list of IDs (comma-separated)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['listAccounts'],
    },
  },
  default: 20,
  description: 'Number of records to return',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['listAccounts'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'Sort order',
},
{
  displayName: 'Sort By',
  name: 'sort',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['listAccounts'],
    },
  },
  options: [
    {
      name: 'Created At',
      value: 'created_at',
    },
    {
      name: 'Updated At',
      value: 'updated_at',
    },
  ],
  default: 'created_at',
  description: 'Sort field',
},
{
  displayName: 'Begin Time',
  name: 'begin_time',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['listAccounts'],
    },
  },
  default: '',
  description: 'Inclusively filter by begin_time when sort=created_at or sort=updated_at',
},
{
  displayName: 'End Time',
  name: 'end_time',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['listAccounts'],
    },
  },
  default: '',
  description: 'Inclusively filter by end_time when sort=created_at or sort=updated_at',
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['listAccounts'],
    },
  },
  default: '',
  description: 'Filter for accounts with this email address',
},
{
  displayName: 'Subscriber',
  name: 'subscriber',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['listAccounts'],
    },
  },
  default: false,
  description: 'Filter for accounts with or without a subscription in the active, canceled, or future state',
},
{
  displayName: 'Past Due',
  name: 'past_due',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['listAccounts'],
    },
  },
  default: false,
  description: 'Filter for accounts with an invoice in the past_due state',
},
{
  displayName: 'Account Code',
  name: 'code',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['createAccount'],
    },
  },
  default: '',
  description: 'The unique identifier of the account',
},
{
  displayName: 'Username',
  name: 'username',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['createAccount', 'updateAccount'],
    },
  },
  default: '',
  description: 'The username used to log into the hosted account management pages',
},
{
  displayName: 'Email',
  name: 'email',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['createAccount', 'updateAccount'],
    },
  },
  default: '',
  description: 'The email address used for communicating with this customer',
},
{
  displayName: 'First Name',
  name: 'first_name',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['createAccount', 'updateAccount'],
    },
  },
  default: '',
  description: 'The first name of the account holder',
},
{
  displayName: 'Last Name',
  name: 'last_name',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['createAccount', 'updateAccount'],
    },
  },
  default: '',
  description: 'The last name of the account holder',
},
{
  displayName: 'Company',
  name: 'company',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['createAccount', 'updateAccount'],
    },
  },
  default: '',
  description: 'The company name associated with the account',
},
{
  displayName: 'VAT Number',
  name: 'vat_number',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['createAccount', 'updateAccount'],
    },
  },
  default: '',
  description: 'The VAT number of the account (to avoid having the VAT applied)',
},
{
  displayName: 'Tax Exempt',
  name: 'tax_exempt',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['createAccount', 'updateAccount'],
    },
  },
  default: false,
  description: 'The tax status of the account',
},
{
  displayName: 'Exemption Certificate',
  name: 'exemption_certificate',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['createAccount'],
    },
  },
  default: '',
  description: 'The exemption certificate number for the account',
},
{
  displayName: 'Parent Account Code',
  name: 'parent_account_code',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['createAccount'],
    },
  },
  default: '',
  description: 'The account code of the parent account',
},
{
  displayName: 'Bill To',
  name: 'bill_to',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['createAccount'],
    },
  },
  options: [
    {
      name: 'Self',
      value: 'self',
    },
    {
      name: 'Parent',
      value: 'parent',
    },
  ],
  default: 'self',
  description: 'An enumerable describing the billing behavior of the account',
},
{
  displayName: 'Custom Fields',
  name: 'custom_fields',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['createAccount', 'updateAccount'],
    },
  },
  default: {},
  options: [
    {
      name: 'field',
      displayName: 'Custom Field',
      values: [
        {
          displayName: 'Name',
          name: 'name',
          type: 'string',
          default: '',
          description: 'The name of the custom field',
        },
        {
          displayName: 'Value',
          name: 'value',
          type: 'string',
          default: '',
          description: 'The value of the custom field',
        },
      ],
    },
  ],
  description: 'Custom fields for the account',
},
{
  displayName: 'Account ID',
  name: 'account_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccount', 'updateAccount', 'deleteAccount', 'reopenAccount'],
    },
  },
  default: '',
  description: 'Account ID or code',
},
{
  displayName: 'Subscription IDs',
  name: 'ids',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['listSubscriptions'],
    },
  },
  default: '',
  description: 'Filter subscriptions by IDs (comma-separated)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['listSubscriptions'],
    },
  },
  default: 20,
  description: 'Number of items to return',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['listSubscriptions'],
    },
  },
  options: [
    { name: 'Ascending', value: 'asc' },
    { name: 'Descending', value: 'desc' },
  ],
  default: 'desc',
  description: 'Sort order',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['listSubscriptions'],
    },
  },
  options: [
    { name: 'Created At', value: 'created_at' },
    { name: 'Updated At', value: 'updated_at' },
  ],
  default: 'created_at',
  description: 'Sort field',
},
{
  displayName: 'Begin Time',
  name: 'begin_time',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['listSubscriptions'],
    },
  },
  default: '',
  description: 'Filter subscriptions created on or after this date',
},
{
  displayName: 'End Time',
  name: 'end_time',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['listSubscriptions'],
    },
  },
  default: '',
  description: 'Filter subscriptions created on or before this date',
},
{
  displayName: 'State',
  name: 'state',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['listSubscriptions'],
    },
  },
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Canceled', value: 'canceled' },
    { name: 'Expired', value: 'expired' },
    { name: 'Future', value: 'future' },
    { name: 'In Trial', value: 'in_trial' },
    { name: 'Live', value: 'live' },
    { name: 'Paused', value: 'paused' },
  ],
  default: '',
  description: 'Filter by subscription state',
},
{
  displayName: 'Plan Code',
  name: 'plan_code',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['createSubscription'],
    },
  },
  default: '',
  description: 'Plan code for the subscription',
},
{
  displayName: 'Account',
  name: 'account',
  type: 'collection',
  required: true,
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['createSubscription'],
    },
  },
  default: {},
  description: 'Account information',
  options: [
    {
      displayName: 'Code',
      name: 'code',
      type: 'string',
      default: '',
      description: 'Account code',
    },
    {
      displayName: 'First Name',
      name: 'first_name',
      type: 'string',
      default: '',
      description: 'Account first name',
    },
    {
      displayName: 'Last Name',
      name: 'last_name',
      type: 'string',
      default: '',
      description: 'Account last name',
    },
    {
      displayName: 'Email',
      name: 'email',
      type: 'string',
      default: '',
      description: 'Account email',
    },
  ],
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['createSubscription'],
    },
  },
  default: 'USD',
  description: 'Currency code (e.g., USD, EUR)',
},
{
  displayName: 'Unit Amount',
  name: 'unit_amount',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['createSubscription', 'updateSubscription'],
    },
  },
  default: 0,
  description: 'Unit amount in cents',
},
{
  displayName: 'Quantity',
  name: 'quantity',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['createSubscription', 'updateSubscription'],
    },
  },
  default: 1,
  description: 'Subscription quantity',
},
{
  displayName: 'Add-ons',
  name: 'add_ons',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['createSubscription', 'updateSubscription'],
    },
  },
  default: {},
  description: 'Add-ons for the subscription',
  options: [
    {
      name: 'add_on',
      displayName: 'Add-on',
      values: [
        {
          displayName: 'Code',
          name: 'code',
          type: 'string',
          default: '',
          description: 'Add-on code',
        },
        {
          displayName: 'Quantity',
          name: 'quantity',
          type: 'number',
          default: 1,
          description: 'Add-on quantity',
        },
        {
          displayName: 'Unit Amount',
          name: 'unit_amount',
          type: 'number',
          default: 0,
          description: 'Add-on unit amount in cents',
        },
      ],
    },
  ],
},
{
  displayName: 'Coupon Codes',
  name: 'coupon_codes',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['createSubscription'],
    },
  },
  default: '',
  description: 'Coupon codes to apply (comma-separated)',
},
{
  displayName: 'Custom Fields',
  name: 'custom_fields',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['createSubscription', 'updateSubscription'],
    },
  },
  default: {},
  description: 'Custom fields for the subscription',
  options: [
    {
      name: 'field',
      displayName: 'Field',
      values: [
        {
          displayName: 'Name',
          name: 'name',
          type: 'string',
          default: '',
          description: 'Field name',
        },
        {
          displayName: 'Value',
          name: 'value',
          type: 'string',
          default: '',
          description: 'Field value',
        },
      ],
    },
  ],
},
{
  displayName: 'Trial Ends At',
  name: 'trial_ends_at',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['createSubscription'],
    },
  },
  default: '',
  description: 'When the trial ends',
},
{
  displayName: 'Starts At',
  name: 'starts_at',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['createSubscription'],
    },
  },
  default: '',
  description: 'When the subscription starts',
},
{
  displayName: 'Shipping',
  name: 'shipping',
  type: 'collection',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['createSubscription'],
    },
  },
  default: {},
  description: 'Shipping information',
  options: [
    {
      displayName: 'First Name',
      name: 'first_name',
      type: 'string',
      default: '',
      description: 'Shipping first name',
    },
    {
      displayName: 'Last Name',
      name: 'last_name',
      type: 'string',
      default: '',
      description: 'Shipping last name',
    },
    {
      displayName: 'Street 1',
      name: 'street1',
      type: 'string',
      default: '',
      description: 'Shipping street address',
    },
    {
      displayName: 'City',
      name: 'city',
      type: 'string',
      default: '',
      description: 'Shipping city',
    },
    {
      displayName: 'State',
      name: 'region',
      type: 'string',
      default: '',
      description: 'Shipping state/region',
    },
    {
      displayName: 'Postal Code',
      name: 'postal_code',
      type: 'string',
      default: '',
      description: 'Shipping postal code',
    },
    {
      displayName: 'Country',
      name: 'country',
      type: 'string',
      default: '',
      description: 'Shipping country code',
    },
  ],
},
{
  displayName: 'Billing Info',
  name: 'billing_info',
  type: 'collection',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['createSubscription'],
    },
  },
  default: {},
  description: 'Billing information',
  options: [
    {
      displayName: 'First Name',
      name: 'first_name',
      type: 'string',
      default: '',
      description: 'Billing first name',
    },
    {
      displayName: 'Last Name',
      name: 'last_name',
      type: 'string',
      default: '',
      description: 'Billing last name',
    },
    {
      displayName: 'Number',
      name: 'number',
      type: 'string',
      default: '',
      description: 'Credit card number',
    },
    {
      displayName: 'Month',
      name: 'month',
      type: 'number',
      default: 1,
      description: 'Expiration month',
    },
    {
      displayName: 'Year',
      name: 'year',
      type: 'number',
      default: 2025,
      description: 'Expiration year',
    },
    {
      displayName: 'CVV',
      name: 'cvv',
      type: 'string',
      default: '',
      description: 'CVV code',
    },
  ],
},
{
  displayName: 'Subscription ID',
  name: 'subscription_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['getSubscription', 'updateSubscription', 'cancelSubscription', 'reactivateSubscription', 'pauseSubscription', 'resumeSubscription'],
    },
  },
  default: '',
  description: 'The subscription ID',
},
{
  displayName: 'Prorate',
  name: 'prorate',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['updateSubscription', 'cancelSubscription'],
    },
  },
  default: true,
  description: 'Whether to prorate the change',
},
{
  displayName: 'Replace Add-ons',
  name: 'replace_add_ons',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['updateSubscription'],
    },
  },
  default: false,
  description: 'Whether to replace all add-ons',
},
{
  displayName: 'Refund',
  name: 'refund',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['cancelSubscription'],
    },
  },
  options: [
    { name: 'None', value: 'none' },
    { name: 'Partial', value: 'partial' },
    { name: 'Full', value: 'full' },
  ],
  default: 'none',
  description: 'Refund type for cancellation',
},
{
  displayName: 'Remaining Pause Cycles',
  name: 'remaining_pause_cycles',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['subscriptions'],
      operation: ['pauseSubscription'],
    },
  },
  default: 1,
  description: 'Number of billing cycles to pause',
},
{
  displayName: 'Plan ID',
  name: 'planId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['getPlan', 'updatePlan', 'deletePlan'],
    },
  },
  default: '',
  description: 'The unique identifier for the plan',
},
{
  displayName: 'Plan Code',
  name: 'code',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['createPlan'],
    },
  },
  default: '',
  description: 'Unique code to identify the plan',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['createPlan'],
    },
  },
  default: '',
  description: 'This name describes your plan and will appear on the Hosted Payment Page and the subscriber\'s invoice',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['updatePlan'],
    },
  },
  default: '',
  description: 'This name describes your plan and will appear on the Hosted Payment Page and the subscriber\'s invoice',
},
{
  displayName: 'Description',
  name: 'description',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['createPlan', 'updatePlan'],
    },
  },
  default: '',
  description: 'Optional description, not displayed',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['createPlan'],
    },
  },
  default: 'USD',
  description: '3-letter ISO 4217 currency code',
},
{
  displayName: 'Unit Amount (cents)',
  name: 'unitAmount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['createPlan'],
    },
  },
  default: 0,
  description: 'Unit price amount in the smallest currency denomination',
},
{
  displayName: 'Unit Name',
  name: 'unitName',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['createPlan', 'updatePlan'],
    },
  },
  default: '',
  description: 'Optional field used by Avalara, Vertex, and Recurly\'s EU VAT feature',
},
{
  displayName: 'Setup Fee (cents)',
  name: 'setupFee',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['createPlan', 'updatePlan'],
    },
  },
  default: 0,
  description: 'Setup fee revenue is recognized immediately upon a subscription\'s creation',
},
{
  displayName: 'Accounting Code',
  name: 'accountingCode',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['createPlan', 'updatePlan'],
    },
  },
  default: '',
  description: 'Accounting code for invoice line items for the plan\'s charges',
},
{
  displayName: 'Plan Interval Length',
  name: 'planIntervalLength',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['createPlan'],
    },
  },
  default: 1,
  description: 'Length of the subscription\'s billing interval',
},
{
  displayName: 'Plan Interval Unit',
  name: 'planIntervalUnit',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['createPlan'],
    },
  },
  options: [
    {
      name: 'Days',
      value: 'days',
    },
    {
      name: 'Weeks',
      value: 'weeks',
    },
    {
      name: 'Months',
      value: 'months',
    },
    {
      name: 'Years',
      value: 'years',
    },
  ],
  default: 'months',
  description: 'Unit for the subscription\'s billing interval',
},
{
  displayName: 'Trial Period',
  name: 'trialPeriod',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['createPlan'],
    },
  },
  default: 0,
  description: 'Length of plan\'s trial period in trial units',
},
{
  displayName: 'Trial Unit',
  name: 'trialUnit',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['createPlan'],
    },
  },
  options: [
    {
      name: 'Days',
      value: 'days',
    },
    {
      name: 'Weeks',
      value: 'weeks',
    },
    {
      name: 'Months',
      value: 'months',
    },
    {
      name: 'Years',
      value: 'years',
    },
  ],
  default: 'days',
  description: 'Units for the plan\'s trial period',
},
{
  displayName: 'Revenue Schedule Type',
  name: 'revenueScheduleType',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['createPlan', 'updatePlan'],
    },
  },
  options: [
    {
      name: 'Never',
      value: 'never',
    },
    {
      name: 'At Range Start',
      value: 'at_range_start',
    },
    {
      name: 'At Range End',
      value: 'at_range_end',
    },
    {
      name: 'Evenly',
      value: 'evenly',
    },
  ],
  default: 'never',
  description: 'Revenue schedule type for the plan',
},
{
  displayName: 'IDs',
  name: 'ids',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['listPlans'],
    },
  },
  default: '',
  description: 'Filter results by their IDs (comma-separated)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['listPlans'],
    },
  },
  default: 20,
  description: 'Limit number of records returned (max 200)',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['listPlans'],
    },
  },
  options: [
    {
      name: 'ASC',
      value: 'asc',
    },
    {
      name: 'DESC',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'Sort order',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['listPlans'],
    },
  },
  options: [
    {
      name: 'Created At',
      value: 'created_at',
    },
    {
      name: 'Updated At',
      value: 'updated_at',
    },
  ],
  default: 'created_at',
  description: 'Sort field',
},
{
  displayName: 'Begin Time',
  name: 'beginTime',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['listPlans'],
    },
  },
  default: '',
  description: 'Inclusively filter by begin_time when sort=created_at or sort=updated_at',
},
{
  displayName: 'End Time',
  name: 'endTime',
  type: 'dateTime',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['listPlans'],
    },
  },
  default: '',
  description: 'Inclusively filter by end_time when sort=created_at or sort=updated_at',
},
{
  displayName: 'State',
  name: 'state',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['plans'],
      operation: ['listPlans'],
    },
  },
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
  ],
  default: 'active',
  description: 'Filter by plan state',
},
{
  displayName: 'IDs',
  name: 'ids',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['listInvoices'],
    },
  },
  default: '',
  description: 'Filter results by their IDs (comma-separated)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['listInvoices'],
    },
  },
  default: 20,
  description: 'Limit the number of results returned',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['listInvoices'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'Sort order',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['listInvoices'],
    },
  },
  options: [
    {
      name: 'Created At',
      value: 'created_at',
    },
    {
      name: 'Updated At',
      value: 'updated_at',
    },
    {
      name: 'Number',
      value: 'number',
    },
  ],
  default: 'created_at',
  description: 'Sort field',
},
{
  displayName: 'Begin Time',
  name: 'begin_time',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['listInvoices'],
    },
  },
  default: '',
  description: 'Filter by invoices created on or after this date',
},
{
  displayName: 'End Time',
  name: 'end_time',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['listInvoices'],
    },
  },
  default: '',
  description: 'Filter by invoices created on or before this date',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['listInvoices'],
    },
  },
  options: [
    {
      name: 'Charge',
      value: 'charge',
    },
    {
      name: 'Credit',
      value: 'credit',
    },
    {
      name: 'Legacy',
      value: 'legacy',
    },
  ],
  default: '',
  description: 'Filter by invoice type',
},
{
  displayName: 'State',
  name: 'state',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['listInvoices'],
    },
  },
  options: [
    {
      name: 'Pending',
      value: 'pending',
    },
    {
      name: 'Processing',
      value: 'processing',
    },
    {
      name: 'Past Due',
      value: 'past_due',
    },
    {
      name: 'Paid',
      value: 'paid',
    },
    {
      name: 'Failed',
      value: 'failed',
    },
    {
      name: 'Voided',
      value: 'voided',
    },
  ],
  default: '',
  description: 'Filter by invoice state',
},
{
  displayName: 'Account ID',
  name: 'account_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['createInvoice'],
    },
  },
  default: '',
  description: 'Account ID for the invoice',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['createInvoice'],
    },
  },
  default: 'USD',
  description: 'Currency code for the invoice',
},
{
  displayName: 'Charge',
  name: 'charge',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: false,
  },
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['createInvoice'],
    },
  },
  default: {},
  description: 'Charge details',
  options: [
    {
      name: 'chargeDetails',
      displayName: 'Charge Details',
      values: [
        {
          displayName: 'Amount',
          name: 'amount',
          type: 'number',
          default: 0,
          description: 'Charge amount',
        },
        {
          displayName: 'Description',
          name: 'description',
          type: 'string',
          default: '',
          description: 'Charge description',
        },
      ],
    },
  ],
},
{
  displayName: 'Credit',
  name: 'credit',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: false,
  },
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['createInvoice'],
    },
  },
  default: {},
  description: 'Credit details',
  options: [
    {
      name: 'creditDetails',
      displayName: 'Credit Details',
      values: [
        {
          displayName: 'Amount',
          name: 'amount',
          type: 'number',
          default: 0,
          description: 'Credit amount',
        },
        {
          displayName: 'Description',
          name: 'description',
          type: 'string',
          default: '',
          description: 'Credit description',
        },
      ],
    },
  ],
},
{
  displayName: 'PO Number',
  name: 'po_number',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['createInvoice', 'updateInvoice'],
    },
  },
  default: '',
  description: 'Purchase order number',
},
{
  displayName: 'Terms',
  name: 'terms',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['createInvoice', 'updateInvoice'],
    },
  },
  default: '',
  description: 'Terms and conditions for the invoice',
},
{
  displayName: 'VAT Reverse Charge Notes',
  name: 'vat_reverse_charge_notes',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['createInvoice', 'updateInvoice'],
    },
  },
  default: '',
  description: 'VAT reverse charge notes',
},
{
  displayName: 'Collection Method',
  name: 'collection_method',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['createInvoice'],
    },
  },
  options: [
    {
      name: 'Automatic',
      value: 'automatic',
    },
    {
      name: 'Manual',
      value: 'manual',
    },
  ],
  default: 'automatic',
  description: 'Collection method for the invoice',
},
{
  displayName: 'Invoice ID',
  name: 'invoice_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['getInvoice', 'updateInvoice', 'deleteInvoice', 'collectInvoice', 'markInvoiceSuccessful', 'markInvoiceFailed', 'refundInvoice'],
    },
  },
  default: '',
  description: 'The invoice ID',
},
{
  displayName: 'Customer Notes',
  name: 'customer_notes',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['updateInvoice'],
    },
  },
  default: '',
  description: 'Customer notes for the invoice',
},
{
  displayName: 'Transaction Type',
  name: 'transaction_type',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['collectInvoice'],
    },
  },
  options: [
    {
      name: 'Moto',
      value: 'moto',
    },
    {
      name: '3D Secure',
      value: '3d_secure',
    },
  ],
  default: '',
  description: 'Transaction type for collection',
},
{
  displayName: 'Billing Info ID',
  name: 'billing_info_id',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['collectInvoice'],
    },
  },
  default: '',
  description: 'Billing info ID to use for collection',
},
{
  displayName: 'Refund Type',
  name: 'type',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['refundInvoice'],
    },
  },
  options: [
    {
      name: 'Full',
      value: 'full',
    },
    {
      name: 'Partial',
      value: 'partial',
    },
    {
      name: 'None',
      value: 'none',
    },
  ],
  default: 'full',
  description: 'Type of refund',
},
{
  displayName: 'Refund Amount',
  name: 'amount',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['refundInvoice'],
      type: ['partial'],
    },
  },
  default: 0,
  description: 'Amount to refund (required for partial refunds)',
},
{
  displayName: 'Refund Method',
  name: 'refund_method',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['invoices'],
      operation: ['refundInvoice'],
    },
  },
  options: [
    {
      name: 'Credit First',
      value: 'credit_first',
    },
    {
      name: 'Transaction First',
      value: 'transaction_first',
    },
  ],
  default: 'credit_first',
  description: 'Method for processing the refund',
},
{
  displayName: 'Transaction IDs',
  name: 'ids',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions'],
    },
  },
  default: '',
  description: 'Comma-separated list of transaction IDs to filter by',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions'],
    },
  },
  typeOptions: {
    minValue: 1,
    maxValue: 200,
  },
  default: 20,
  description: 'Number of records to return (max 200)',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'Sort order',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions'],
    },
  },
  options: [
    {
      name: 'Created At',
      value: 'created_at',
    },
    {
      name: 'Updated At',
      value: 'updated_at',
    },
  ],
  default: 'created_at',
  description: 'Sort field',
},
{
  displayName: 'Begin Time',
  name: 'begin_time',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions'],
    },
  },
  default: '',
  description: 'Filter transactions created after this date',
},
{
  displayName: 'End Time',
  name: 'end_time',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions'],
    },
  },
  default: '',
  description: 'Filter transactions created before this date',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions'],
    },
  },
  options: [
    {
      name: 'Authorization',
      value: 'authorization',
    },
    {
      name: 'Capture',
      value: 'capture',
    },
    {
      name: 'Purchase',
      value: 'purchase',
    },
    {
      name: 'Refund',
      value: 'refund',
    },
    {
      name: 'Void',
      value: 'void',
    },
  ],
  default: '',
  description: 'Filter by transaction type',
},
{
  displayName: 'Success',
  name: 'success',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Successful Only',
      value: 'true',
    },
    {
      name: 'Failed Only',
      value: 'false',
    },
  ],
  default: '',
  description: 'Filter by transaction success status',
},
{
  displayName: 'Account ID',
  name: 'account_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['createTransaction'],
    },
  },
  default: '',
  description: 'The account ID for the transaction',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['createTransaction'],
    },
  },
  default: 'USD',
  description: 'Currency code (e.g., USD, EUR)',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['createTransaction'],
    },
  },
  typeOptions: {
    minValue: 0,
  },
  default: 0,
  description: 'Transaction amount in the specified currency',
},
{
  displayName: 'Payment Method',
  name: 'payment_method',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['createTransaction'],
    },
  },
  default: '{}',
  description: 'Payment method details (JSON object)',
},
{
  displayName: 'Billing Info',
  name: 'billing_info',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['createTransaction'],
    },
  },
  default: '{}',
  description: 'Billing information (JSON object)',
},
{
  displayName: 'Custom Fields',
  name: 'custom_fields',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['createTransaction'],
    },
  },
  default: '{}',
  description: 'Custom fields (JSON object)',
},
{
  displayName: 'Transaction ID',
  name: 'transaction_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransaction', 'deleteTransaction', 'refundTransaction'],
    },
  },
  default: '',
  description: 'The ID of the transaction',
},
{
  displayName: 'Refund Amount',
  name: 'amount',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['refundTransaction'],
    },
  },
  typeOptions: {
    minValue: 0,
  },
  default: 0,
  description: 'Amount to refund (leave 0 for full refund)',
},
{
  displayName: 'Coupon IDs',
  name: 'ids',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['listCoupons'],
    },
  },
  default: '',
  description: 'Comma-separated list of coupon IDs to filter by',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['listCoupons'],
    },
  },
  default: 20,
  description: 'Limit number of records to return',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['listCoupons'],
    },
  },
  options: [
    {
      name: 'ASC',
      value: 'asc',
    },
    {
      name: 'DESC',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'Sort order',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['listCoupons'],
    },
  },
  options: [
    {
      name: 'Created At',
      value: 'created_at',
    },
    {
      name: 'Updated At',
      value: 'updated_at',
    },
  ],
  default: 'created_at',
  description: 'Sort field',
},
{
  displayName: 'Begin Time',
  name: 'begin_time',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['listCoupons'],
    },
  },
  default: '',
  description: 'Inclusively filter by begin_time when sort=created_at or sort=updated_at',
},
{
  displayName: 'End Time',
  name: 'end_time',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['listCoupons'],
    },
  },
  default: '',
  description: 'Inclusively filter by end_time when sort=created_at or sort=updated_at',
},
{
  displayName: 'State',
  name: 'state',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['listCoupons'],
    },
  },
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
    {
      name: 'Expired',
      value: 'expired',
    },
  ],
  default: 'active',
  description: 'Filter by coupon state',
},
{
  displayName: 'Code',
  name: 'code',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon'],
    },
  },
  default: '',
  description: 'The code the customer enters to redeem the coupon',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon', 'updateCoupon'],
    },
  },
  default: '',
  description: 'The internal name for the coupon',
},
{
  displayName: 'Discount Type',
  name: 'discount_type',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon'],
    },
  },
  options: [
    {
      name: 'Percent',
      value: 'percent',
    },
    {
      name: 'Fixed',
      value: 'fixed',
    },
  ],
  default: 'percent',
  description: 'The type of discount provided by the coupon',
},
{
  displayName: 'Discount Percent',
  name: 'discount_percent',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon'],
      discount_type: ['percent'],
    },
  },
  default: 0,
  description: 'The percent of the price discounted by the coupon',
},
{
  displayName: 'Discount Fixed',
  name: 'discount_fixed',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon'],
      discount_type: ['fixed'],
    },
  },
  default: 0,
  description: 'The fixed amount discounted by the coupon',
},
{
  displayName: 'Applies to All Plans',
  name: 'applies_to_all_plans',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon'],
    },
  },
  default: true,
  description: 'Whether the coupon applies to all plans',
},
{
  displayName: 'Plans',
  name: 'plans',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon'],
      applies_to_all_plans: [false],
    },
  },
  default: '',
  description: 'Comma-separated list of plan codes the coupon applies to',
},
{
  displayName: 'Applies to Non-Plan Charges',
  name: 'applies_to_non_plan_charges',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon'],
    },
  },
  default: false,
  description: 'Whether the coupon applies to non-plan charges',
},
{
  displayName: 'Redemption Resource',
  name: 'redemption_resource',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon'],
    },
  },
  options: [
    {
      name: 'Account',
      value: 'account',
    },
    {
      name: 'Subscription',
      value: 'subscription',
    },
  ],
  default: 'account',
  description: 'Whether the discount is for the account or a specific subscription',
},
{
  displayName: 'Max Redemptions',
  name: 'max_redemptions',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon', 'updateCoupon'],
    },
  },
  default: 0,
  description: 'Maximum number of redemptions for the coupon (0 for unlimited)',
},
{
  displayName: 'Max Redemptions Per Account',
  name: 'max_redemptions_per_account',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon', 'updateCoupon'],
    },
  },
  default: 1,
  description: 'Maximum number of redemptions per account',
},
{
  displayName: 'Duration',
  name: 'duration',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon'],
    },
  },
  options: [
    {
      name: 'Forever',
      value: 'forever',
    },
    {
      name: 'Single Use',
      value: 'single_use',
    },
    {
      name: 'Temporal',
      value: 'temporal',
    },
  ],
  default: 'forever',
  description: 'Duration type for the coupon',
},
{
  displayName: 'Temporal Unit',
  name: 'temporal_unit',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon'],
      duration: ['temporal'],
    },
  },
  options: [
    {
      name: 'Day',
      value: 'day',
    },
    {
      name: 'Week',
      value: 'week',
    },
    {
      name: 'Month',
      value: 'month',
    },
    {
      name: 'Year',
      value: 'year',
    },
  ],
  default: 'month',
  description: 'Temporal unit for the coupon duration',
},
{
  displayName: 'Temporal Amount',
  name: 'temporal_amount',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon'],
      duration: ['temporal'],
    },
  },
  default: 1,
  description: 'Number of temporal units the coupon is valid for',
},
{
  displayName: 'Unique Coupon Codes Count',
  name: 'unique_coupon_codes_count',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['createCoupon'],
    },
  },
  default: 0,
  description: 'Number of unique coupon codes to generate',
},
{
  displayName: 'Coupon ID',
  name: 'coupon_id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['coupons'],
      operation: ['getCoupon', 'updateCoupon', 'deleteCoupon', 'restoreCoupon'],
    },
  },
  default: '',
  description: 'The unique identifier of the coupon',
},
{
  displayName: 'Plan ID',
  name: 'planId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['listPlanAddOns', 'createPlanAddOn', 'getPlanAddOn', 'updatePlanAddOn', 'deletePlanAddOn'],
    },
  },
  default: '',
  description: 'The plan ID',
},
{
  displayName: 'Add-on ID',
  name: 'addOnId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['getPlanAddOn', 'updatePlanAddOn', 'deletePlanAddOn'],
    },
  },
  default: '',
  description: 'The add-on ID',
},
{
  displayName: 'IDs',
  name: 'ids',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['listPlanAddOns'],
    },
  },
  default: '',
  description: 'Comma-separated list of IDs to filter by',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['listPlanAddOns'],
    },
  },
  default: 20,
  description: 'Limit the number of returned items',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['listPlanAddOns'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'asc',
  description: 'Sort order',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['listPlanAddOns'],
    },
  },
  options: [
    {
      name: 'Created At',
      value: 'created_at',
    },
    {
      name: 'Updated At',
      value: 'updated_at',
    },
  ],
  default: 'created_at',
  description: 'Sort field',
},
{
  displayName: 'Begin Time',
  name: 'beginTime',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['listPlanAddOns'],
    },
  },
  default: '',
  description: 'Filter by records created on or after this date',
},
{
  displayName: 'End Time',
  name: 'endTime',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['listPlanAddOns'],
    },
  },
  default: '',
  description: 'Filter by records created on or before this date',
},
{
  displayName: 'State',
  name: 'state',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['listPlanAddOns'],
    },
  },
  options: [
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'inactive',
    },
  ],
  default: 'active',
  description: 'Filter by add-on state',
},
{
  displayName: 'Code',
  name: 'code',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['createPlanAddOn'],
    },
  },
  default: '',
  description: 'The unique identifier for the add-on',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['createPlanAddOn'],
    },
  },
  default: '',
  description: 'The add-on name',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['updatePlanAddOn'],
    },
  },
  default: '',
  description: 'The add-on name',
},
{
  displayName: 'Add-on Type',
  name: 'addOnType',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['createPlanAddOn'],
    },
  },
  options: [
    {
      name: 'Fixed',
      value: 'fixed',
    },
    {
      name: 'Usage',
      value: 'usage',
    },
  ],
  default: 'fixed',
  description: 'The pricing model for the add-on',
},
{
  displayName: 'Usage Type',
  name: 'usageType',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['createPlanAddOn'],
      addOnType: ['usage'],
    },
  },
  options: [
    {
      name: 'Price',
      value: 'price',
    },
    {
      name: 'Percentage',
      value: 'percentage',
    },
  ],
  default: 'price',
  description: 'The type of usage pricing',
},
{
  displayName: 'Unit Name',
  name: 'unitName',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['createPlanAddOn', 'updatePlanAddOn'],
    },
  },
  default: '',
  description: 'The unit of measurement for the add-on',
},
{
  displayName: 'Unit Amount',
  name: 'unitAmount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['createPlanAddOn'],
    },
  },
  default: 0,
  description: 'The unit amount in cents',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['createPlanAddOn'],
    },
  },
  default: 'USD',
  description: 'The currency code',
},
{
  displayName: 'Accounting Code',
  name: 'accountingCode',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['createPlanAddOn', 'updatePlanAddOn'],
    },
  },
  default: '',
  description: 'Accounting code for invoice line items',
},
{
  displayName: 'Revenue Schedule Type',
  name: 'revenueScheduleType',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['addOns'],
      operation: ['createPlanAddOn', 'updatePlanAddOn'],
    },
  },
  options: [
    {
      name: 'Never',
      value: 'never',
    },
    {
      name: 'At Range Start',
      value: 'at_range_start',
    },
    {
      name: 'At Range End',
      value: 'at_range_end',
    },
    {
      name: 'Evenly',
      value: 'evenly',
    },
  ],
  default: 'never',
  description: 'Revenue schedule type',
},
{
  displayName: 'Webhook ID',
  name: 'webhookId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['getWebhook'],
    },
  },
  default: '',
  description: 'The webhook notification ID',
},
{
  displayName: 'Webhook IDs',
  name: 'ids',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['listWebhooks'],
    },
  },
  default: '',
  description: 'Filter results by comma-separated webhook IDs',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['listWebhooks'],
    },
  },
  default: 20,
  description: 'Limit the number of webhooks returned',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['listWebhooks'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'asc',
    },
    {
      name: 'Descending',
      value: 'desc',
    },
  ],
  default: 'desc',
  description: 'Sort order',
},
{
  displayName: 'Sort',
  name: 'sort',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['listWebhooks'],
    },
  },
  options: [
    {
      name: 'Created At',
      value: 'created_at',
    },
    {
      name: 'Updated At',
      value: 'updated_at',
    },
  ],
  default: 'created_at',
  description: 'Sort field',
},
{
  displayName: 'Begin Time',
  name: 'beginTime',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['listWebhooks'],
    },
  },
  default: '',
  description: 'Inclusively filter by begin_time when sort=created_at or sort=updated_at',
},
{
  displayName: 'End Time',
  name: 'endTime',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['listWebhooks'],
    },
  },
  default: '',
  description: 'Inclusively filter by end_time when sort=created_at or sort=updated_at',
},
{
  displayName: 'State',
  name: 'state',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['listWebhooks'],
    },
  },
  options: [
    {
      name: 'Successful',
      value: 'successful',
    },
    {
      name: 'Failed',
      value: 'failed',
    },
    {
      name: 'Processing',
      value: 'processing',
    },
  ],
  default: 'successful',
  description: 'Filter by webhook state',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'subscriptions':
        return [await executeSubscriptionsOperations.call(this, items)];
      case 'plans':
        return [await executePlansOperations.call(this, items)];
      case 'invoices':
        return [await executeInvoicesOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'coupons':
        return [await executeCouponsOperations.call(this, items)];
      case 'addOns':
        return [await executeAddOnsOperations.call(this, items)];
      case 'webhooks':
        return [await executeWebhooksOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('recurlyApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listAccounts': {
          const queryParams: any = {};
          
          const ids = this.getNodeParameter('ids', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const order = this.getNodeParameter('order', i) as string;
          const sort = this.getNodeParameter('sort', i) as string;
          const beginTime = this.getNodeParameter('begin_time', i) as string;
          const endTime = this.getNodeParameter('end_time', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const subscriber = this.getNodeParameter('subscriber', i) as boolean;
          const pastDue = this.getNodeParameter('past_due', i) as boolean;

          if (ids) queryParams.ids = ids;
          if (limit) queryParams.limit = limit;
          if (order) queryParams.order = order;
          if (sort) queryParams.sort = sort;
          if (beginTime) queryParams.begin_time = beginTime;
          if (endTime) queryParams.end_time = endTime;
          if (email) queryParams.email = email;
          if (subscriber) queryParams.subscriber = subscriber;
          if (pastDue) queryParams.past_due = pastDue;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/accounts`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Content-Type': 'application/json',
            },
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createAccount': {
          const body: any = {};
          
          const code = this.getNodeParameter('code', i) as string;
          const username = this.getNodeParameter('username', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const firstName = this.getNodeParameter('first_name', i) as string;
          const lastName = this.getNodeParameter('last_name', i) as string;
          const company = this.getNodeParameter('company', i) as string;
          const vatNumber = this.getNodeParameter('vat_number', i) as string;
          const taxExempt = this.getNodeParameter('tax_exempt', i) as boolean;
          const exemptionCertificate = this.getNodeParameter('exemption_certificate', i) as string;
          const parentAccountCode = this.getNodeParameter('parent_account_code', i) as string;
          const billTo = this.getNodeParameter('bill_to', i) as string;
          const customFields = this.getNodeParameter('custom_fields', i) as any;

          body.code = code;
          if (username) body.username = username;
          if (email) body.email = email;
          if (firstName) body.first_name = firstName;
          if (lastName) body.last_name = lastName;
          if (company) body.company = company;
          if (vatNumber) body.vat_number = vatNumber;
          if (taxExempt) body.tax_exempt = taxExempt;
          if (exemptionCertificate) body.exemption_certificate = exemptionCertificate;
          if (parentAccountCode) body.parent_account_code = parentAccountCode;
          if (billTo) body.bill_to = billTo;
          if (customFields?.field) {
            body.custom_fields = customFields.field.reduce((acc: any, field: any) => {
              acc[field.name] = field.value;
              return acc;
            }, {});
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/accounts`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Content-Type': 'application/json',
              'Idempotency-Key': `${Date.now()}-${Math.random()}`,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccount': {
          const accountId = this.getNodeParameter('account_id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/accounts/${accountId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateAccount': {
          const accountId = this.getNodeParameter('account_id', i) as string;
          const body: any = {};
          
          const username = this.getNodeParameter('username', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const firstName = this.getNodeParameter('first_name', i) as string;
          const lastName = this.getNodeParameter('last_name', i) as string;
          const company = this.getNodeParameter('company', i) as string;
          const vatNumber = this.getNodeParameter('vat_number', i) as string;
          const taxExempt = this.getNodeParameter('tax_exempt', i) as boolean;
          const customFields = this.getNodeParameter('custom_fields', i) as any;

          if (username) body.username = username;
          if (email) body.email = email;
          if (firstName) body.first_name = firstName;
          if (lastName) body.last_name = lastName;
          if (company) body.company = company;
          if (vatNumber) body.vat_number = vatNumber;
          if (taxExempt) body.tax_exempt = taxExempt;
          if (customFields?.field) {
            body.custom_fields = customFields.field.reduce((acc: any, field: any) => {
              acc[field.name] = field.value;
              return acc;
            }, {});
          }

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/accounts/${accountId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteAccount': {
          const accountId = this.getNodeParameter('account_id', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/accounts/${accountId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'reopenAccount': {
          const accountId = this.getNodeParameter('account_id', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/accounts/${accountId}/reopen`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Content-Type': 'application/json',
              'Idempotency-Key': `${Date.now()}-${Math.random()}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeSubscriptionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('recurlyApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listSubscriptions': {
          const queryParams: any = {};
          const ids = this.getNodeParameter('ids', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const order = this.getNodeParameter('order', i) as string;
          const sort = this.getNodeParameter('sort', i) as string;
          const beginTime = this.getNodeParameter('begin_time', i) as string;
          const endTime = this.getNodeParameter('end_time', i) as string;
          const state = this.getNodeParameter('state', i) as string;

          if (ids) queryParams.ids = ids;
          if (limit) queryParams.limit = limit;
          if (order) queryParams.order = order;
          if (sort) queryParams.sort = sort;
          if (beginTime) queryParams.begin_time = beginTime;
          if (endTime) queryParams.end_time = endTime;
          if (state) queryParams.state = state;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/subscriptions`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createSubscription': {
          const planCode = this.getNodeParameter('plan_code', i) as string;
          const account = this.getNodeParameter('account', i) as any;
          const currency = this.getNodeParameter('currency', i) as string;
          const unitAmount = this.getNodeParameter('unit_amount', i) as number;
          const quantity = this.getNodeParameter('quantity', i) as number;
          const addOns = this.getNodeParameter('add_ons', i) as any;
          const couponCodes = this.getNodeParameter('coupon_codes', i) as string;
          const customFields = this.getNodeParameter('custom_fields', i) as any;
          const trialEndsAt = this.getNodeParameter('trial_ends_at', i) as string;
          const startsAt = this.getNodeParameter('starts_at', i) as string;
          const shipping = this.getNodeParameter('shipping', i) as any;
          const billingInfo = this.getNodeParameter('billing_info', i) as any;

          const body: any = {
            plan_code: planCode,
            account: account,
            currency: currency,
          };

          if (unitAmount) body.unit_amount = unitAmount;
          if (quantity) body.quantity = quantity;
          if (addOns?.add_on?.length) body.add_ons = addOns.add_on;
          if (couponCodes) body.coupon_codes = couponCodes.split(',').map((code: string) => code.trim());
          if (customFields?.field?.length) body.custom_fields = customFields.field;
          if (trialEndsAt) body.trial_ends_at = trialEndsAt;
          if (startsAt) body.starts_at = startsAt;
          if (shipping && Object.keys(shipping).length) body.shipping = shipping;
          if (billingInfo && Object.keys(billingInfo).length) body.billing_info = billingInfo;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/subscriptions`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
              'Idempotency-Key': `${Date.now()}-${i}`,
            },
            body: body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSubscription': {
          const subscriptionId = this.getNodeParameter('subscription_id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/subscriptions/${subscriptionId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateSubscription': {
          const subscriptionId = this.getNodeParameter('subscription_id', i) as string;
          const quantity = this.getNodeParameter('quantity', i) as number;
          const unitAmount = this.getNodeParameter('unit_amount', i) as number;
          const addOns = this.getNodeParameter('add_ons', i) as any;
          const customFields = this.getNodeParameter('custom_fields', i) as any;
          const prorate = this.getNodeParameter('prorate', i) as boolean;
          const replaceAddOns = this.getNodeParameter('replace_add_ons', i) as boolean;

          const body: any = {};

          if (quantity) body.quantity = quantity;
          if (unitAmount) body.unit_amount = unitAmount;
          if (addOns?.add_on?.length) body.add_ons = addOns.add_on;
          if (customFields?.field?.length) body.custom_fields = customFields.field;
          if (typeof prorate === 'boolean') body.prorate = prorate;
          if (typeof replaceAddOns === 'boolean') body.replace_add_ons = replaceAddOns;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/subscriptions/${subscriptionId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            body: body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelSubscription': {
          const subscriptionId = this.getNodeParameter('subscription_id', i) as string;
          const refund = this.getNodeParameter('refund', i) as string;
          const prorate = this.getNodeParameter('prorate', i) as boolean;

          const body: any = {};

          if (refund && refund !== 'none') body.refund = refund;
          if (typeof prorate === 'boolean') body.prorate = prorate;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/subscriptions/${subscriptionId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            body: body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'reactivateSubscription': {
          const subscriptionId = this.getNodeParameter('subscription_id', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/subscriptions/${subscriptionId}/reactivate`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
              'Idempotency-Key': `${Date.now()}-${i}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'pauseSubscription': {
          const subscriptionId = this.getNodeParameter('subscription_id', i) as string;
          const remainingPauseCycles = this.getNodeParameter('remaining_pause_cycles', i) as number;

          const body: any = {};
          if (remainingPauseCycles) body.remaining_pause_cycles = remainingPauseCycles;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/subscriptions/${subscriptionId}/pause`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
              'Idempotency-Key': `${Date.now()}-${i}`,
            },
            body: body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'resumeSubscription': {
          const subscriptionId = this.getNodeParameter('subscription_id', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/subscriptions/${subscriptionId}/resume`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
              'Idempotency-Key': `${Date.now()}-${i}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executePlansOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('recurlyApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listPlans': {
          const queryParams: any = {};
          
          const ids = this.getNodeParameter('ids', i, '') as string;
          if (ids) queryParams.ids = ids;
          
          const limit = this.getNodeParameter('limit', i, 20) as number;
          if (limit) queryParams.limit = limit;
          
          const order = this.getNodeParameter('order', i, 'desc') as string;
          if (order) queryParams.order = order;
          
          const sort = this.getNodeParameter('sort', i, 'created_at') as string;
          if (sort) queryParams.sort = sort;
          
          const beginTime = this.getNodeParameter('beginTime', i, '') as string;
          if (beginTime) queryParams.begin_time = beginTime;
          
          const endTime = this.getNodeParameter('endTime', i, '') as string;
          if (endTime) queryParams.end_time = endTime;
          
          const state = this.getNodeParameter('state', i, 'active') as string;
          if (state) queryParams.state = state;

          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString() 
            : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/plans${queryString}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createPlan': {
          const code = this.getNodeParameter('code', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const currency = this.getNodeParameter('currency', i) as string;
          const unitAmount = this.getNodeParameter('unitAmount', i) as number;
          const planIntervalLength = this.getNodeParameter('planIntervalLength', i) as number;
          const planIntervalUnit = this.getNodeParameter('planIntervalUnit', i) as string;

          const body: any = {
            code,
            name,
            currencies: [{
              currency,
              unit_amount: unitAmount,
            }],
            interval_length: planIntervalLength,
            interval_unit: planIntervalUnit,
          };

          const description = this.getNodeParameter('description', i, '') as string;
          if (description) body.description = description;

          const accountingCode = this.getNodeParameter('accountingCode', i, '') as string;
          if (accountingCode) body.accounting_code = accountingCode;

          const unitName = this.getNodeParameter('unitName', i, '') as string;
          if (unitName) body.currencies[0].unit_name = unitName;

          const setupFee = this.getNodeParameter('setupFee', i, 0) as number;
          if (setupFee > 0) body.currencies[0].setup_fee = setupFee;

          const trialPeriod = this.getNodeParameter('trialPeriod', i, 0) as number;
          if (trialPeriod > 0) {
            body.trial_length = trialPeriod;
            const trialUnit = this.getNodeParameter('trialUnit', i, 'days') as string;
            body.trial_unit = trialUnit;
          }

          const revenueScheduleType = this.getNodeParameter('revenueScheduleType', i, 'never') as string;
          if (revenueScheduleType && revenueScheduleType !== 'never') {
            body.revenue_schedule_type = revenueScheduleType;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/plans`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPlan': {
          const planId = this.getNodeParameter('planId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/plans/${planId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updatePlan': {
          const planId = this.getNodeParameter('planId', i) as string;
          const body: any = {};

          const name = this.getNodeParameter('name', i, '') as string;
          if (name) body.name = name;

          const description = this.getNodeParameter('description', i, '') as string;
          if (description) body.description = description;

          const accountingCode = this.getNodeParameter('accountingCode', i, '') as string;
          if (accountingCode) body.accounting_code = accountingCode;

          const unitName = this.getNodeParameter('unitName', i, '') as string;
          const setupFee = this.getNodeParameter('setupFee', i, 0) as number;
          if (unitName || setupFee > 0) {
            body.currencies = [{}];
            if (unitName) body.currencies[0].unit_name = unitName;
            if (setupFee > 0) body.currencies[0].setup_fee = setupFee;
          }

          const revenueScheduleType = this.getNodeParameter('revenueScheduleType', i, '') as string;
          if (revenueScheduleType && revenueScheduleType !== 'never') {
            body.revenue_schedule_type = revenueScheduleType;
          }

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/plans/${planId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deletePlan': {
          const planId = this.getNodeParameter('planId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/plans/${planId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeInvoicesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('recurlyApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'listInvoices': {
          const queryParams: any = {};
          const ids = this.getNodeParameter('ids', i) as string;
          if (ids) queryParams.ids = ids;
          
          const limit = this.getNodeParameter('limit', i) as number;
          if (limit) queryParams.limit = limit;
          
          const order = this.getNodeParameter('order', i) as string;
          if (order) queryParams.order = order;
          
          const sort = this.getNodeParameter('sort', i) as string;
          if (sort) queryParams.sort = sort;
          
          const beginTime = this.getNodeParameter('begin_time', i) as string;
          if (beginTime) queryParams.begin_time = beginTime;
          
          const endTime = this.getNodeParameter('end_time', i) as string;
          if (endTime) queryParams.end_time = endTime;
          
          const type = this.getNodeParameter('type', i) as string;
          if (type) queryParams.type = type;
          
          const state = this.getNodeParameter('state', i) as string;
          if (state) queryParams.state = state;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://v3.recurly.com'}/invoices`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            qs: queryParams,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createInvoice': {
          const accountId = this.getNodeParameter('account_id', i) as string;
          const currency = this.getNodeParameter('currency', i) as string;
          const charge = this.getNodeParameter('charge', i) as any;
          const credit = this.getNodeParameter('credit', i) as any;
          const poNumber = this.getNodeParameter('po_number', i) as string;
          const terms = this.getNodeParameter('terms', i) as string;
          const vatReverseChargeNotes = this.getNodeParameter('vat_reverse_charge_notes', i) as string;
          const collectionMethod = this.getNodeParameter('collection_method', i) as string;

          const body: any = {
            account: { id: accountId },
            currency,
          };

          if (charge?.chargeDetails) {
            body.charge = charge.chargeDetails;
          }
          
          if (credit?.creditDetails) {
            body.credit = credit.creditDetails;
          }
          
          if (poNumber) body.po_number = poNumber;
          if (terms) body.terms = terms;
          if (vatReverseChargeNotes) body.vat_reverse_charge_notes = vatReverseChargeNotes;
          if (collectionMethod) body.collection_method = collectionMethod;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://v3.recurly.com'}/invoices`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getInvoice': {
          const invoiceId = this.getNodeParameter('invoice_id', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://v3.recurly.com'}/invoices/${invoiceId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateInvoice': {
          const invoiceId = this.getNodeParameter('invoice_id', i) as string;
          const customerNotes = this.getNodeParameter('customer_notes', i) as string;
          const terms = this.getNodeParameter('terms', i) as string;
          const vatReverseChargeNotes = this.getNodeParameter('vat_reverse_charge_notes', i) as string;
          const poNumber = this.getNodeParameter('po_number', i) as string;

          const body: any = {};
          if (customerNotes) body.customer_notes = customerNotes;
          if (terms) body.terms = terms;
          if (vatReverseChargeNotes) body.vat_reverse_charge_notes = vatReverseChargeNotes;
          if (poNumber) body.po_number = poNumber;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl || 'https://v3.recurly.com'}/invoices/${invoiceId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteInvoice': {
          const invoiceId = this.getNodeParameter('invoice_id', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl || 'https://v3.recurly.com'}/invoices/${invoiceId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'collectInvoice': {
          const invoiceId = this.getNodeParameter('invoice_id', i) as string;
          const transactionType = this.getNodeParameter('transaction_type', i) as string;
          const billingInfoId = this.getNodeParameter('billing_info_id', i) as string;

          const body: any = {};
          if (transactionType) body.transaction_type = transactionType;
          if (billingInfoId) body.billing_info_id = billingInfoId;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://v3.recurly.com'}/invoices/${invoiceId}/collect`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'markInvoiceSuccessful': {
          const invoiceId = this.getNodeParameter('invoice_id', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://v3.recurly.com'}/invoices/${invoiceId}/mark_successful`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'markInvoiceFailed': {
          const invoiceId = this.getNodeParameter('invoice_id', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://v3.recurly.com'}/invoices/${invoiceId}/mark_failed`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'refundInvoice': {
          const invoiceId = this.getNodeParameter('invoice_id', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const refundMethod = this.getNodeParameter('refund_method', i) as string;

          const body: any = {
            type,
            refund_method: refundMethod,
          };
          
          if (type === 'partial' && amount) {
            body.amount = amount;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://v3.recurly.com'}/invoices/${invoiceId}/refund`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.response?.body) {
          throw new NodeApiError(this.getNode(), error.response.body);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }
  
  return returnData;
}

async function executeTransactionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('recurlyApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listTransactions': {
          const queryParams: any = {};
          
          const ids = this.getNodeParameter('ids', i, '') as string;
          if (ids) {
            queryParams.ids = ids;
          }
          
          const limit = this.getNodeParameter('limit', i, 20) as number;
          queryParams.limit = limit;
          
          const order = this.getNodeParameter('order', i, 'desc') as string;
          queryParams.order = order;
          
          const sort = this.getNodeParameter('sort', i, 'created_at') as string;
          queryParams.sort = sort;
          
          const beginTime = this.getNodeParameter('begin_time', i, '') as string;
          if (beginTime) {
            queryParams.begin_time = beginTime;
          }
          
          const endTime = this.getNodeParameter('end_time', i, '') as string;
          if (endTime) {
            queryParams.end_time = endTime;
          }
          
          const type = this.getNodeParameter('type', i, '') as string;
          if (type) {
            queryParams.type = type;
          }
          
          const success = this.getNodeParameter('success', i, '') as string;
          if (success) {
            queryParams.success = success;
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/transactions${queryString ? `?${queryString}` : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createTransaction': {
          const accountId = this.getNodeParameter('account_id', i) as string;
          const currency = this.getNodeParameter('currency', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const paymentMethod = this.getNodeParameter('payment_method', i, '{}') as string;
          const billingInfo = this.getNodeParameter('billing_info', i, '{}') as string;
          const customFields = this.getNodeParameter('custom_fields', i, '{}') as string;

          let parsedPaymentMethod: any = {};
          let parsedBillingInfo: any = {};
          let parsedCustomFields: any = {};

          try {
            if (paymentMethod) {
              parsedPaymentMethod = JSON.parse(paymentMethod);
            }
            if (billingInfo) {
              parsedBillingInfo = JSON.parse(billingInfo);
            }
            if (customFields) {
              parsedCustomFields = JSON.parse(customFields);
            }
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON in request body parameters');
          }

          const requestBody: any = {
            account_id: accountId,
            currency,
            amount,
          };

          if (Object.keys(parsedPaymentMethod).length > 0) {
            requestBody.payment_method = parsedPaymentMethod;
          }
          if (Object.keys(parsedBillingInfo).length > 0) {
            requestBody.billing_info = parsedBillingInfo;
          }
          if (Object.keys(parsedCustomFields).length > 0) {
            requestBody.custom_fields = parsedCustomFields;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
              'Idempotency-Key': `n8n-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            },
            json: true,
            body: requestBody,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransaction': {
          const transactionId = this.getNodeParameter('transaction_id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/transactions/${transactionId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteTransaction': {
          const transactionId = this.getNodeParameter('transaction_id', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/transactions/${transactionId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'refundTransaction': {
          const transactionId = this.getNodeParameter('transaction_id', i) as string;
          const amount = this.getNodeParameter('amount', i, 0) as number;

          const requestBody: any = {};
          if (amount > 0) {
            requestBody.amount = amount;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/transactions/${transactionId}/refund`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
              'Idempotency-Key': `n8n-refund-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            },
            json: true,
            body: requestBody,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeCouponsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('recurlyApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listCoupons': {
          const params: any = {};
          const ids = this.getNodeParameter('ids', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const order = this.getNodeParameter('order', i) as string;
          const sort = this.getNodeParameter('sort', i) as string;
          const beginTime = this.getNodeParameter('begin_time', i) as string;
          const endTime = this.getNodeParameter('end_time', i) as string;
          const state = this.getNodeParameter('state', i) as string;

          if (ids) params.ids = ids;
          if (limit) params.limit = limit;
          if (order) params.order = order;
          if (sort) params.sort = sort;
          if (beginTime) params.begin_time = beginTime;
          if (endTime) params.end_time = endTime;
          if (state) params.state = state;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/coupons`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            qs: params,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createCoupon': {
          const body: any = {
            code: this.getNodeParameter('code', i) as string,
            name: this.getNodeParameter('name', i) as string,
            discount_type: this.getNodeParameter('discount_type', i) as string,
          };

          const discountType = body.discount_type;
          if (discountType === 'percent') {
            body.discount_percent = this.getNodeParameter('discount_percent', i) as number;
          } else if (discountType === 'fixed') {
            body.discount_fixed = this.getNodeParameter('discount_fixed', i) as number;
          }

          const appliesToAllPlans = this.getNodeParameter('applies_to_all_plans', i) as boolean;
          body.applies_to_all_plans = appliesToAllPlans;

          if (!appliesToAllPlans) {
            const plans = this.getNodeParameter('plans', i) as string;
            if (plans) {
              body.plans = plans.split(',').map(plan => plan.trim());
            }
          }

          const appliesToNonPlanCharges = this.getNodeParameter('applies_to_non_plan_charges', i) as boolean;
          if (appliesToNonPlanCharges) {
            body.applies_to_non_plan_charges = appliesToNonPlanCharges;
          }

          const redemptionResource = this.getNodeParameter('redemption_resource', i) as string;
          if (redemptionResource) {
            body.redemption_resource = redemptionResource;
          }

          const maxRedemptions = this.getNodeParameter('max_redemptions', i) as number;
          if (maxRedemptions > 0) {
            body.max_redemptions = maxRedemptions;
          }

          const maxRedemptionsPerAccount = this.getNodeParameter('max_redemptions_per_account', i) as number;
          if (maxRedemptionsPerAccount > 0) {
            body.max_redemptions_per_account = maxRedemptionsPerAccount;
          }

          const duration = this.getNodeParameter('duration', i) as string;
          body.duration = duration;

          if (duration === 'temporal') {
            body.temporal_unit = this.getNodeParameter('temporal_unit', i) as string;
            body.temporal_amount = this.getNodeParameter('temporal_amount', i) as number;
          }

          const uniqueCouponCodesCount = this.getNodeParameter('unique_coupon_codes_count', i) as number;
          if (uniqueCouponCodesCount > 0) {
            body.unique_coupon_codes_count = uniqueCouponCodesCount;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/coupons`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
              'Idempotency-Key': `${Date.now()}-${Math.random()}`,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCoupon': {
          const couponId = this.getNodeParameter('coupon_id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/coupons/${couponId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateCoupon': {
          const couponId = this.getNodeParameter('coupon_id', i) as string;
          const body: any = {};

          const name = this.getNodeParameter('name', i) as string;
          if (name) {
            body.name = name;
          }

          const maxRedemptions = this.getNodeParameter('max_redemptions', i) as number;
          if (maxRedemptions > 0) {
            body.max_redemptions = maxRedemptions;
          }

          const maxRedemptionsPerAccount = this.getNodeParameter('max_redemptions_per_account', i) as number;
          if (maxRedemptionsPerAccount > 0) {
            body.max_redemptions_per_account = maxRedemptionsPerAccount;
          }

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/coupons/${couponId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteCoupon': {
          const couponId = this.getNodeParameter('coupon_id', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/coupons/${couponId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'restoreCoupon': {
          const couponId = this.getNodeParameter('coupon_id', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/coupons/${couponId}/restore`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeAddOnsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('recurlyApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listPlanAddOns': {
          const planId = this.getNodeParameter('planId', i) as string;
          const ids = this.getNodeParameter('ids', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const order = this.getNodeParameter('order', i) as string;
          const sort = this.getNodeParameter('sort', i) as string;
          const beginTime = this.getNodeParameter('beginTime', i) as string;
          const endTime = this.getNodeParameter('endTime', i) as string;
          const state = this.getNodeParameter('state', i) as string;

          const queryParams = new URLSearchParams();
          if (ids) queryParams.append('ids', ids);
          if (limit) queryParams.append('limit', limit.toString());
          if (order) queryParams.append('order', order);
          if (sort) queryParams.append('sort', sort);
          if (beginTime) queryParams.append('begin_time', beginTime);
          if (endTime) queryParams.append('end_time', endTime);
          if (state) queryParams.append('state', state);

          const url = `${credentials.baseUrl}/plans/${planId}/add_ons${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createPlanAddOn': {
          const planId = this.getNodeParameter('planId', i) as string;
          const code = this.getNodeParameter('code', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const addOnType = this.getNodeParameter('addOnType', i) as string;
          const usageType = this.getNodeParameter('usageType', i) as string;
          const unitName = this.getNodeParameter('unitName', i) as string;
          const unitAmount = this.getNodeParameter('unitAmount', i) as number;
          const currency = this.getNodeParameter('currency', i) as string;
          const accountingCode = this.getNodeParameter('accountingCode', i) as string;
          const revenueScheduleType = this.getNodeParameter('revenueScheduleType', i) as string;

          const body: any = {
            code,
            name,
            add_on_type: addOnType,
            currencies: [
              {
                currency,
                unit_amount: unitAmount,
              },
            ],
          };

          if (addOnType === 'usage' && usageType) {
            body.usage_type = usageType;
          }
          if (unitName) body.unit_name = unitName;
          if (accountingCode) body.accounting_code = accountingCode;
          if (revenueScheduleType) body.revenue_schedule_type = revenueScheduleType;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/plans/${planId}/add_ons`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
              'Idempotency-Key': `n8n-${Date.now()}-${Math.random()}`,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPlanAddOn': {
          const planId = this.getNodeParameter('planId', i) as string;
          const addOnId = this.getNodeParameter('addOnId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/plans/${planId}/add_ons/${addOnId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updatePlanAddOn': {
          const planId = this.getNodeParameter('planId', i) as string;
          const addOnId = this.getNodeParameter('addOnId', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const unitName = this.getNodeParameter('unitName', i) as string;
          const accountingCode = this.getNodeParameter('accountingCode', i) as string;
          const revenueScheduleType = this.getNodeParameter('revenueScheduleType', i) as string;

          const body: any = {};
          if (name) body.name = name;
          if (unitName) body.unit_name = unitName;
          if (accountingCode) body.accounting_code = accountingCode;
          if (revenueScheduleType) body.revenue_schedule_type = revenueScheduleType;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/plans/${planId}/add_ons/${addOnId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deletePlanAddOn': {
          const planId = this.getNodeParameter('planId', i) as string;
          const addOnId = this.getNodeParameter('addOnId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/plans/${planId}/add_ons/${addOnId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2021-02-25',
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeWebhooksOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('recurlyApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'listWebhooks': {
          const queryParams: any = {};
          
          const ids = this.getNodeParameter('ids', i, '') as string;
          if (ids) {
            queryParams.ids = ids;
          }
          
          const limit = this.getNodeParameter('limit', i, 20) as number;
          if (limit) {
            queryParams.limit = limit;
          }
          
          const order = this.getNodeParameter('order', i, 'desc') as string;
          if (order) {
            queryParams.order = order;
          }
          
          const sort = this.getNodeParameter('sort', i, 'created_at') as string;
          if (sort) {
            queryParams.sort = sort;
          }
          
          const beginTime = this.getNodeParameter('beginTime', i, '') as string;
          if (beginTime) {
            queryParams.begin_time = new Date(beginTime).toISOString();
          }
          
          const endTime = this.getNodeParameter('endTime', i, '') as string;
          if (endTime) {
            queryParams.end_time = new Date(endTime).toISOString();
          }
          
          const state = this.getNodeParameter('state', i, '') as string;
          if (state) {
            queryParams.state = state;
          }
          
          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/webhooks${queryString ? `?${queryString}` : ''}`;
          
          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2019-10-10',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getWebhook': {
          const webhookId = this.getNodeParameter('webhookId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/webhooks/${webhookId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v2019-10-10',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }
  
  return returnData;
}
