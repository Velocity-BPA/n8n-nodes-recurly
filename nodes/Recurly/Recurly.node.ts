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
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Subscription',
            value: 'subscription',
          },
          {
            name: 'Invoice',
            value: 'invoice',
          },
          {
            name: 'Plan',
            value: 'plan',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Coupon',
            value: 'coupon',
          },
          {
            name: 'Webhook',
            value: 'webhook',
          }
        ],
        default: 'account',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['account'] } },
        options: [
          { name: 'List Accounts', value: 'listAccounts', description: 'Retrieve all accounts', action: 'List accounts' },
          { name: 'Create Account', value: 'createAccount', description: 'Create a new account', action: 'Create account' },
          { name: 'Get Account', value: 'getAccount', description: 'Retrieve a specific account', action: 'Get account' },
          { name: 'Update Account', value: 'updateAccount', description: 'Update account information', action: 'Update account' },
          { name: 'Delete Account', value: 'deleteAccount', description: 'Close an account', action: 'Delete account' },
          { name: 'Reopen Account', value: 'reopenAccount', description: 'Reopen a closed account', action: 'Reopen account' },
        ],
        default: 'listAccounts',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['subscription'] } },
        options: [
          { name: 'List Subscriptions', value: 'listSubscriptions', description: 'Retrieve all subscriptions', action: 'List subscriptions' },
          { name: 'Create Subscription', value: 'createSubscription', description: 'Create a new subscription', action: 'Create a subscription' },
          { name: 'Get Subscription', value: 'getSubscription', description: 'Retrieve a specific subscription', action: 'Get a subscription' },
          { name: 'Update Subscription', value: 'updateSubscription', description: 'Modify subscription details', action: 'Update a subscription' },
          { name: 'Cancel Subscription', value: 'cancelSubscription', description: 'Cancel a subscription', action: 'Cancel a subscription' },
          { name: 'Reactivate Subscription', value: 'reactivateSubscription', description: 'Reactivate a canceled subscription', action: 'Reactivate subscription' },
          { name: 'Pause Subscription', value: 'pauseSubscription', description: 'Pause a subscription', action: 'Pause a subscription' },
          { name: 'Resume Subscription', value: 'resumeSubscription', description: 'Resume a paused subscription', action: 'Resume a subscription' }
        ],
        default: 'listSubscriptions',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['invoice'] } },
        options: [
          { name: 'List Invoices', value: 'listInvoices', description: 'Retrieve all invoices', action: 'List invoices' },
          { name: 'Create Invoice', value: 'createInvoice', description: 'Generate a new invoice', action: 'Create invoice' },
          { name: 'Get Invoice', value: 'getInvoice', description: 'Retrieve a specific invoice', action: 'Get invoice' },
          { name: 'Update Invoice', value: 'updateInvoice', description: 'Update invoice details', action: 'Update invoice' },
          { name: 'Void Invoice', value: 'voidInvoice', description: 'Void an invoice', action: 'Void invoice' },
          { name: 'Collect Invoice', value: 'collectInvoice', description: 'Attempt to collect payment on invoice', action: 'Collect invoice' },
          { name: 'Mark Invoice Successful', value: 'markInvoiceSuccessful', description: 'Mark invoice as paid', action: 'Mark invoice successful' },
          { name: 'Mark Invoice Failed', value: 'markInvoiceFailed', description: 'Mark an open invoice as failed', action: 'Mark invoice failed' },
          { name: 'Refund Invoice', value: 'refundInvoice', description: 'Refund an invoice', action: 'Refund invoice' },
        ],
        default: 'listInvoices',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['plan'] } },
        options: [
          { name: 'List Plans', value: 'listPlans', description: 'Retrieve all plans', action: 'List plans' },
          { name: 'Create Plan', value: 'createPlan', description: 'Create a new subscription plan', action: 'Create a plan' },
          { name: 'Get Plan', value: 'getPlan', description: 'Retrieve a specific plan', action: 'Get a plan' },
          { name: 'Update Plan', value: 'updatePlan', description: 'Update plan details', action: 'Update a plan' },
          { name: 'Delete Plan', value: 'deletePlan', description: 'Remove a plan', action: 'Delete a plan' }
        ],
        default: 'listPlans',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['transaction'] } },
        options: [
          { name: 'List Transactions', value: 'listTransactions', description: 'Retrieve all transactions', action: 'List transactions' },
          { name: 'Create Transaction', value: 'createTransaction', description: 'Process a new transaction', action: 'Create transaction' },
          { name: 'Get Transaction', value: 'getTransaction', description: 'Retrieve a specific transaction', action: 'Get transaction' },
          { name: 'Refund Transaction', value: 'refundTransaction', description: 'Refund a transaction', action: 'Refund transaction' },
          { name: 'Delete Transaction', value: 'deleteTransaction', description: 'Delete a transaction', action: 'Delete transaction' },
        ],
        default: 'listTransactions',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['coupon'] } },
        options: [
          { name: 'List Coupons', value: 'listCoupons', description: 'Retrieve all coupons', action: 'List coupons' },
          { name: 'Create Coupon', value: 'createCoupon', description: 'Create a new coupon', action: 'Create a coupon' },
          { name: 'Get Coupon', value: 'getCoupon', description: 'Retrieve a specific coupon', action: 'Get a coupon' },
          { name: 'Update Coupon', value: 'updateCoupon', description: 'Update coupon details', action: 'Update a coupon' },
          { name: 'Delete Coupon', value: 'deleteCoupon', description: 'Deactivate a coupon', action: 'Delete a coupon' },
          { name: 'Restore Coupon', value: 'restoreCoupon', description: 'Reactivate a coupon', action: 'Restore a coupon' },
        ],
        default: 'listCoupons',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['webhook'] } },
        options: [
          { name: 'List Webhooks', value: 'listWebhooks', description: 'Retrieve all webhook endpoints', action: 'List webhooks' },
          { name: 'Create Webhook', value: 'createWebhook', description: 'Create a new webhook endpoint', action: 'Create webhook' },
          { name: 'Get Webhook', value: 'getWebhook', description: 'Retrieve a specific webhook', action: 'Get webhook' },
          { name: 'Update Webhook', value: 'updateWebhook', description: 'Update webhook configuration', action: 'Update webhook' },
          { name: 'Delete Webhook', value: 'deleteWebhook', description: 'Remove a webhook endpoint', action: 'Delete webhook' },
        ],
        default: 'listWebhooks',
      },
      // Account parameters
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 20,
        description: 'The number of objects to return',
        displayOptions: { show: { resource: ['account'], operation: ['listAccounts'] } },
      },
      {
        displayName: 'Cursor',
        name: 'cursor',
        type: 'string',
        default: '',
        description: 'Cursor for pagination',
        displayOptions: { show: { resource: ['account'], operation: ['listAccounts'] } },
      },
      {
        displayName: 'Account IDs',
        name: 'ids',
        type: 'string',
        default: '',
        description: 'Comma-separated list of account IDs to filter by',
        displayOptions: { show: { resource: ['account'], operation: ['listAccounts'] } },
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Filter by email address',
        displayOptions: { show: { resource: ['account'], operation: ['listAccounts', 'createAccount', 'updateAccount'] } },
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'options',
        options: [
          { name: 'Active', value: 'active' },
          { name: 'Closed', value: 'closed' },
          { name: 'Subscriber', value: 'subscriber' },
          { name: 'Non-Subscriber', value: 'non_subscriber' }
        ],
        default: '',
        description: 'Filter accounts by state',
        displayOptions: { show: { resource: ['account'], operation: ['listAccounts'] } },
      },
      {
        displayName: 'Past Due',
        name: 'past_due',
        type: 'boolean',
        displayOptions: {
          show: {
            resource: ['account'],
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
        default: '',
        description: 'Unique account code for the account',
        displayOptions: { show: { resource: ['account'], operation: ['createAccount'] } },
      },
      {
        displayName: 'First Name',
        name: 'first_name',
        type: 'string',
        default: '',
        description: 'First name of the account holder',
        displayOptions: { show: { resource: ['account'], operation: ['createAccount', 'updateAccount'] } },
      },
      {
        displayName: 'Last Name',
        name: 'last_name',
        type: 'string',
        default: '',
        description: 'Last name of the account holder',
        displayOptions: { show: { resource: ['account'], operation: ['createAccount', 'updateAccount'] } },
      },
      {
        displayName: 'Company',
        name: 'company',
        type: 'string',
        default: '',
        description: 'Company name for the account',
        displayOptions: { show: { resource: ['account'], operation: ['createAccount', 'updateAccount'] } },
      },
      {
        displayName: 'Username',
        name: 'username',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['account'],
            operation: ['createAccount', 'updateAccount'],
          },
        },
        default: '',
        description: 'The username used to log into the hosted account management pages',
      },
      {
        displayName: 'VAT Number',
        name: 'vat_number',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['account'],
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
            resource: ['account'],
            operation: ['createAccount', 'updateAccount'],
          },
        },
        default: false,
        description: 'The tax status of the account',
      },
      {
        displayName: 'Address',
        name: 'address',
        type: 'fixedCollection',
        default: {},
        description: 'Address information for the account',
        displayOptions: { show: { resource: ['account'], operation: ['createAccount'] } },
        typeOptions: { multipleValues: false },
        options: [
          {
            name: 'addressValues',
            displayName: 'Address',
            values: [
              {
                displayName: 'Street 1',
                name: 'street1',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Street 2',
                name: 'street2',
                type: 'string',
                default: '',
              },
              {
                displayName: 'City',
                name: 'city',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Region',
                name: 'region',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Postal Code',
                name: 'postal_code',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Country',
                name: 'country',
                type: 'string',
                default: '',
              }
            ]
          }
        ]
      },
      {
        displayName: 'Account ID',
        name: 'account_id',
        type: 'string',
        required: true,
        default: '',
        description: 'The ID of the account',
        displayOptions: { show: { resource: ['account'], operation: ['getAccount', 'updateAccount', 'deleteAccount', 'reopenAccount'] } },
      },
      // Subscription parameters
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 20,
        description: 'Maximum number of subscriptions to return',
        displayOptions: { show: { resource: ['subscription'], operation: ['listSubscriptions'] } }
      },
      {
        displayName: 'Cursor',
        name: 'cursor',
        type: 'string',
        default: '',
        description: 'Cursor for pagination',
        displayOptions: { show: { resource: ['subscription'], operation: ['listSubscriptions'] } }
      },
      {
        displayName: 'Subscription IDs',
        name: 'ids',
        type: 'string',
        default: '',
        description: 'Comma-separated list of subscription IDs',
        displayOptions: { show: { resource: ['subscription'], operation: ['listSubscriptions'] } }
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'options',
        options: [
          { name: 'Active', value: 'active' },
          { name: 'Canceled', value: 'canceled' },
          { name: 'Expired', value: 'expired' },
          { name: 'Future', value: 'future' },
          { name: 'In Trial', value: 'in_trial' },
          { name: 'Live', value: 'live' },
          { name: 'Paused', value: 'paused' },
          { name: 'Pending', value: 'pending' }
        ],
        default: '',
        description: 'Filter subscriptions by state',
        displayOptions: { show: { resource: ['subscription'], operation: ['listSubscriptions'] } }
      },
      {
        displayName: 'Plan ID',
        name: 'planId',
        type: 'string',
        default: '',
        description: 'Filter subscriptions by plan ID',
        displayOptions: { show: { resource: ['subscription'], operation: ['listSubscriptions'] } }
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        description: 'Filter subscriptions by account ID',
        displayOptions: { show: { resource: ['subscription'], operation: ['listSubscriptions'] } }
      },
      {
        displayName: 'Plan Code',
        name: 'planCode',
        type: 'string',
        required: true,
        default: '',
        description: 'The plan code for the subscription',
        displayOptions: { show: { resource: ['subscription'], operation: ['createSubscription', 'updateSubscription'] } }
      },
      {
        displayName: 'Account',
        name: 'account',
        type: 'fixedCollection',
        typeOptions: { multipleValues: false },
        default: {},
        options: [
          {
            name: 'accountDetails',
            displayName: 'Account Details',
            values: [
              {
                displayName: 'Account Code',
                name: 'code',
                type: 'string',
                default: '',
                description: 'Account code'
              },
              {
                displayName: 'Account ID',
                name: 'id',
                type: 'string',
                default: '',
                description: 'Account ID'
              }
            ]
          }
        ],
        description: 'Account information for the subscription',
        displayOptions: { show: { resource: ['subscription'], operation: ['createSubscription'] } }
      },
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        required: true,
        default: 'USD',
        description: 'Currency for the subscription',
        displayOptions: { show: { resource: ['subscription'], operation: ['createSubscription'] } }
      },
      {
        displayName: 'Unit Amount',
        name: 'unitAmount',
        type: 'number',
        default: 0,
        description: 'Unit amount in cents',
        displayOptions: { show: { resource: ['subscription'], operation: ['createSubscription', 'updateSubscription'] } }
      },
      {
        displayName: 'Quantity',
        name: 'quantity',
        type: 'number',
        default: 1,
        description: 'Subscription quantity',
        displayOptions: { show: { resource: ['subscription'], operation: ['updateSubscription'] } }
      },
      {
        displayName: 'Subscription ID',
        name: 'subscriptionId',
        type: 'string',
        required: true,
        default: '',
        description: 'The subscription ID',
        displayOptions: { show: { resource: ['subscription'], operation: ['getSubscription', 'updateSubscription', 'cancelSubscription', 'reactivateSubscription', 'pauseSubscription', 'resumeSubscription'] } }
      },
      {
        displayName: 'Remaining Pause Cycles',
        name: 'remainingPauseCycles',
        type: 'number',
        default: 1,
        description: 'Number of billing cycles to pause',
        displayOptions: { show: { resource: ['subscription'], operation: ['pauseSubscription'] } }
      },
      // Invoice parameters
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 20,
        description: 'Number of invoices to return',
        displayOptions: { show: { resource: ['invoice'], operation: ['listInvoices'] } },
      },
      {
        displayName: 'Cursor',
        name: 'cursor',
        type: 'string',
        default: '',
        description: 'Pagination cursor',
        displayOptions: { show: { resource: ['invoice'], operation: ['listInvoices'] } },
      },
      {
        displayName: 'IDs',
        name: 'ids',
        type: 'string',
        default: '',
        description: 'Comma-separated list of invoice IDs to filter',
        displayOptions: { show: { resource: ['invoice'], operation: ['listInvoices'] } },
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'options',
        options: [
          { name: 'Pending', value: 'pending' },
          { name: 'Processing', value: 'processing' },
          { name: 'Past Due', value: 'past_due' },
          { name: 'Paid', value: 'paid' },
          { name: 'Failed', value: 'failed' },
          { name: 'Voided', value: 'voided' },
        ],
        default: '',
        description: 'Filter invoices by state',
        displayOptions: { show: { resource: ['invoice'], operation: ['listInvoices'] } },
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'Charge', value: 'charge' },
          { name: 'Credit', value: 'credit' },
          { name: 'Legacy', value: 'legacy' },
        ],
        default: '',
        description: 'Filter invoices by type',
        displayOptions: { show: { resource: ['invoice'], operation: ['listInvoices'] } },
      },
      {
        displayName: 'Account ID',
        name: 'accountId',
        type: 'string',
        default: '',
        description: 'Filter invoices by account ID',
        displayOptions: { show: { resource: ['invoice'], operation: ['listInvoices', 'createInvoice'] } },
      },
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        required: true,
        default: 'USD',
        description: 'Currency code for the invoice',
        displayOptions: { show: { resource: ['invoice'], operation: ['createInvoice'] } },
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
        description: 'How the invoice should be collected',
        displayOptions: { show: { resource: ['invoice'], operation: ['createInvoice'] } },
      },
      {
        displayName: 'Invoice ID',
        name: 'invoiceId',
        type: 'string',
        required: true,
        default: '',
        description: 'The ID of the invoice',
        displayOptions: { show: { resource: ['invoice'], operation: ['getInvoice', 'updateInvoice', 'voidInvoice', 'collectInvoice', 'markInvoiceSuccessful', 'markInvoiceFailed', 'refundInvoice'] } },
      },
      {
        displayName: 'Terms and Conditions',
        name: 'termsAndConditions',
        type: 'string',
        default: '',
        description: 'Terms and conditions for the invoice',
        displayOptions: { show: { resource: ['invoice'], operation: ['updateInvoice'] } },
      },
      {
        displayName: 'Customer Notes',
        name: 'customerNotes',
        type: 'string',
        default: '',
        description: 'Customer notes for the invoice',
        displayOptions: { show: { resource: ['invoice'], operation: ['updateInvoice'] } },
      },
      // Plan parameters
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 20,
        description: 'Number of records to return',
        displayOptions: { show: { resource: ['plan'], operation: ['listPlans'] } },
      },
      {
        displayName: 'Cursor',
        name: 'cursor',
        type: 'string',
        default: '',
        description: 'Cursor for pagination',
        displayOptions: { show: { resource: ['plan'], operation: ['listPlans'] } },
      },
      {
        displayName: 'IDs',
        name: 'ids',
        type: 'string',
        default: '',
        description: 'Comma-separated list of plan IDs',
        displayOptions: { show: { resource: ['plan'], operation: ['listPlans'] } },
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'options',
        options: [
          { name: 'Active', value: 'active' },
          { name: 'Inactive', value: 'inactive' }
        ],
        default: '',
        description: 'Filter by plan state',
        displayOptions: { show: { resource: ['plan'], operation: ['listPlans'] } },
      },
      {
        displayName: 'Plan Code',
        name: 'code',
        type: 'string',
        required: true,
        default: '',
        description: 'Unique code for the plan',
        displayOptions: { show: { resource: ['plan'], operation: ['createPlan'] } },
      },
      {
        displayName: 'Plan Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        description: 'Name of the plan',
        displayOptions: { show: { resource: ['plan'], operation: ['createPlan', 'updatePlan'] } },
      },
      {
        displayName: 'Currencies',
        name: 'currencies',
        type: 'json',
        required: true,
        default: '[]',
        description: 'Array of currency pricing configurations',
        displayOptions: { show: { resource: ['plan'], operation: ['createPlan', 'updatePlan'] } },
      },
      {
        displayName: 'Recurring',
        name: 'recurring',
        type: 'json',
        required: true,
        default: '{}',
        description: 'Recurring billing configuration',
        displayOptions: { show: { resource: ['plan'], operation: ['createPlan', 'updatePlan'] } },
      },
      {
        displayName: 'Plan ID',
        name: 'planId',
        type: 'string',
        required: true,
        default: '',
        description: 'ID of the plan',
        displayOptions: { show: { resource: ['plan'], operation: ['getPlan', 'updatePlan', 'deletePlan'] } },
      },
      // Transaction parameters
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
        default: 20,
        description: 'The maximum number of transactions to return',
      },
      {
        displayName: 'Cursor',
        name: 'cursor',
        type: 'string',
        displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
        default: '',
        description: 'Cursor for pagination',
      },
      {
        displayName: 'Transaction IDs',
        name: 'ids',
        type: 'string',
        displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
        default: '',
        description: 'Comma-separated list of transaction IDs to filter by',
      },
      {
        displayName: 'Transaction Type',
        name: 'type',
        type: 'options',
        displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
        options: [
          { name: 'All', value: '' },
          { name: 'Purchase', value: 'purchase' },
          { name: 'Authorization', value: 'authorization' },
          { name: 'Refund', value: 'refund' },
          { name: 'Verify', value: 'verify' }
        ],
        default: '',
        description: 'Filter transactions by type',
      },
      {
        displayName: 'Account ID',
        name: 'account_id',
        type: 'string',
        displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions', 'createTransaction'] } },
        default: '',
        description: 'Filter by account ID or account ID for new transaction',
      },
      {
        displayName: 'Success Filter',
        name: 'success',
        type: 'options',
        displayOptions: { show: { resource: ['transaction'], operation: ['listTransactions'] } },
        options: [
          { name: 'All', value: '' },
          { name: 'Successful Only', value: 'true' },
          { name: 'Failed Only', value: 'false' }
        ],
        default: '',
        description: 'Filter transactions by success status',
      },
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['transaction'], operation: ['createTransaction'] } },
        default: 'USD',
        description: 'Three-letter ISO currency code',
      },
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        required: true,
        displayOptions: { show: { resource: ['transaction'], operation: ['createTransaction'] } },
        default: 0,
        description: 'Transaction amount in the specified currency',
      },
      {
        displayName: 'Payment Method',
        name: 'payment_method',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['transaction'], operation: ['createTransaction'] } },
        default: '',
        description: 'Payment method token or ID',
      },
      {
        displayName: 'Transaction ID',
        name: 'transaction_id',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['transaction'], operation: ['getTransaction', 'refundTransaction', 'deleteTransaction'] } },
        default: '',
        description: 'The unique identifier of the transaction',
      },
      {
        displayName: 'Refund Amount (Cents)',
        name: 'amount_in_cents',
        type: 'number',
        displayOptions: { show: { resource: ['transaction'], operation: ['refundTransaction'] } },
        default: 0,
        description: 'Amount to refund in cents. Leave empty to refund the full amount',
      },
      {
        displayName: 'Use Idempotency Key',
        name: 'useIdempotencyKey',
        type: 'boolean',
        displayOptions: { show: { resource: ['transaction'], operation: ['createTransaction'] } },
        default: false,
        description: 'Whether to generate an idempotency key for safe retries',
      },
      // Coupon parameters
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: { show: { resource: ['coupon'], operation: ['listCoupons'] } },
        default: 20,
        description: 'Number of items to return',
      },
      {
        displayName: 'Cursor',
        name: 'cursor',
        type: 'string',
        displayOptions: { show: { resource: ['coupon'], operation: ['listCoupons'] } },
        default: '',
        description: 'Cursor for pagination',
      },
      {
        displayName: 'IDs',
        name: 'ids',
        type: 'string',
        displayOptions: { show: { resource: ['coupon'], operation: ['listCoupons'] } },
        default: '',
        description: 'Comma-separated list of coupon IDs to filter by',
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'options',
        displayOptions: { show: { resource: ['coupon'], operation: ['listCoupons'] } },
        options: [
          { name: 'Active', value: 'active' },
          { name: 'Inactive', value: 'inactive' },
          { name: 'All', value: '' },
        ],
        default: '',
        description: 'Filter by coupon state',
      },
      {
        displayName: 'Code',
        name: 'code',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['coupon'], operation: ['createCoupon'] } },
        default: '',
        description: 'Unique coupon code',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['coupon'], operation: ['createCoupon', 'updateCoupon'] } },
        default: '',
        description: 'Display name for the coupon',
      },
      {
        displayName: 'Discount Type',
        name: 'discount_type',
        type: 'options',
        required: true,
        displayOptions: { show: { resource: ['coupon'], operation: ['createCoupon'] } },
        options: [
          { name: 'Percent', value: 'percent' },
          { name: 'Fixed', value: 'fixed' },
        ],
        default: 'percent',
        description: 'Type of discount to apply',
      },
      {
        displayName: 'Discount Percent',
        name: 'discount_percent',
        type: 'number',
        displayOptions: { show: { resource: ['coupon'], operation: ['createCoupon'], discount_type: ['percent'] } },
        default: 0,
        description: 'Percentage discount (0-100)',
      },
      {
        displayName: 'Discount Fixed',
        name: 'discount_fixed',
        type: 'number',
        displayOptions: { show: { resource: ['coupon'], operation: ['createCoupon'], discount_type: ['fixed'] } },
        default: 0,
        description: 'Fixed amount discount',
      },
      {
        displayName: 'Coupon ID',
        name: 'coupon_id',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['coupon'], operation: ['getCoupon', 'updateCoupon', 'deleteCoupon', 'restoreCoupon'] } },
        default: '',
        description: 'ID of the coupon',
      },
      {
        displayName: 'Max Redemptions',
        name: 'max_redemptions',
        type: 'number',
        displayOptions: { show: { resource: ['coupon'], operation: ['updateCoupon'] } },
        default: 0,
        description: 'Maximum number of redemptions allowed',
      },
      // Webhook parameters
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: { show: { resource: ['webhook'], operation: ['listWebhooks'] } },
        default: 20,
        description: 'Maximum number of webhooks to return',
      },
      {
        displayName: 'Cursor',
        name: 'cursor',
        type: 'string',
        displayOptions: { show: { resource: ['webhook'], operation: ['listWebhooks'] } },
        default: '',
        description: 'Cursor for pagination',
      },
      {
        displayName: 'URL',
        name: 'url',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['webhook'], operation: ['createWebhook', 'updateWebhook'] } },
        default: '',
        description: 'The webhook endpoint URL',
      },
      {
        displayName: 'Event Types',
        name: 'event_types',
        type: 'multiOptions',
        required: true,
        displayOptions: { show: { resource: ['webhook'], operation: ['createWebhook', 'updateWebhook'] } },
        options: [
          { name: 'Account Created', value: 'account_created' },
          { name: 'Account Updated', value: 'account_updated' },
          { name: 'Subscription Created', value: 'subscription_created' },
          { name: 'Subscription Updated', value: 'subscription_updated' },
          { name: 'Subscription Canceled', value: 'subscription_canceled' },
          { name: 'Invoice Created', value: 'invoice_created' },
          { name: 'Invoice Paid', value: 'invoice_paid' },
          { name: 'Transaction Created', value: 'transaction_created' },
          { name: 'Transaction Updated', value: 'transaction_updated' },
        ],
        default: [],
        description: 'Types of events to subscribe to',
      },
      {
        displayName: 'Webhook ID',
        name: 'webhook_id',
        type: 'string',
        required: true,
        displayOptions: { show: { resource: ['webhook'], operation: ['getWebhook', 'updateWebhook', 'deleteWebhook'] } },
        default: '',
        description: 'The ID of the webhook',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'subscription':
        return [await executeSubscriptionOperations.call(this, items)];
      case 'invoice':
        return [await executeInvoiceOperations.call(this, items)];
      case 'plan':
        return [await executePlanOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'coupon':
        return [await executeCouponOperations.call(this, items)];
      case 'webhook':
        return [await executeWebhookOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
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
          const limit = this.getNodeParameter('limit', i) as number;
          const cursor = this.getNodeParameter('cursor', i) as string;
          const ids = this.getNodeParameter('ids', i) as string;
          const state = this.getNodeParameter('state', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const pastDue = this.getNodeParameter('past_due', i) as boolean;

          const qs: any = {};
          if (limit) qs.limit = limit;
          if (cursor) qs.cursor = cursor;
          if (ids) qs.ids = ids;
          if (state) qs.state = state;
          if (email) qs.email = email;
          if (pastDue) qs.past_due = pastDue;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/accounts`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v3',
              'Content-Type': 'application/json'
            },
            qs,
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createAccount': {
          const code = this.getNodeParameter('code', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const firstName = this.getNodeParameter('first_name', i) as string;
          const lastName = this.getNodeParameter('last_name', i) as string;
          const company = this.getNodeParameter('company', i) as string;
          const address = this.getNodeParameter('address', i) as any;
          const username = this.getNodeParameter('username', i) as string;
          const vatNumber = this.getNodeParameter('vat_number', i) as string;
          const taxExempt = this.getNodeParameter('tax_exempt', i) as boolean;

          const body: any = {
            code,
            email
          };

          if (firstName) body.first_name = firstName;
          if (lastName) body.last_name = lastName;
          if (company) body.company = company;
          if (address && address.addressValues) {
            body.address = address.addressValues;
          }
          if (username) body.username = username;
          if (vatNumber) body.vat_number = vatNumber;
          if (taxExempt) body.tax_exempt = taxExempt;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/accounts`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v3',
              'Content-Type': 'application/json'
            },
            body,
            json: true
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
              'Accept': 'application/vnd.recurly.v3',
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateAccount': {
          const accountId = this.getNodeParameter('account_id', i) as string;
          const email = this.getNodeParameter('email', i) as string;
          const firstName = this.getNodeParameter('first_name', i) as string;
          const lastName = this.getNodeParameter('last_name', i) as string;
          const company = this.getNodeParameter('company', i) as string;
          const username = this.getNodeParameter('username', i) as string;
          const vatNumber = this.getNodeParameter('vat_number', i) as string;
          const taxExempt = this.getNodeParameter('tax_exempt', i) as boolean;

          const body: any = {};

          if (email) body.email = email;
          if (firstName) body.first_name = firstName;
          if (lastName) body.last_name = lastName;
          if (company) body.company = company;
          if (username) body.username = username;
          if (vatNumber) body.vat_number = vatNumber;
          if (typeof taxExempt === 'boolean') body.tax_exempt = taxExempt;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/accounts/${accountId}`,
            headers: {
              'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
              'Accept': 'application/vnd.recurly.v3',
              'Content-Type': 'application/json'
            },
            body,
            json: true
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
              'Accept': 'application/vnd.recurly.v3',
              'Content-Type': 'application/json'
            },
            json: true
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
              'Accept': 'application/vnd.recurly.v3',
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
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeSubscriptionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('recurlyApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      const baseOptions: any = {
        headers: {
          'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
          'Accept': 'application/vnd.recurly.v3',
          'Content-Type': 'application/json'
        },
        json: true
      };

      switch (operation) {
        case 'listSubscriptions': {
          const limit = this.getNodeParameter('limit', i) as number;
          const cursor = this.getNodeParameter('cursor', i) as string;
          const ids = this.getNodeParameter('ids', i) as string;
          const state = this.getNodeParameter('state', i) as string;
          const planId = this.getNodeParameter('planId', i) as string;
          const accountId = this.getNodeParameter('accountId', i) as string;

          const queryParams: string[] = [];
          if (limit) queryParams.push(`limit=${limit}`);
          if (cursor) queryParams.push(`cursor=${cursor}`);
          if (ids) queryParams.push(`ids=${ids}`);
          if (state) queryParams.push(`state=${state}`);
          if (planId) queryParams.push(`plan_id=${planId}`);
          if (accountId) queryParams.push(`account_id=${accountId}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/subscriptions${queryString}`
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createSubscription': {
          const planCode = this.getNodeParameter('planCode', i) as string;
          const account = this.getNodeParameter('account', i) as any;
          const currency = this.getNodeParameter('currency', i) as string;
          const unitAmount = this.getNodeParameter('unitAmount', i) as number;

          const body: any = {
            plan_code: planCode,
            currency: currency
          };

          if (account.accountDetails) {
            body.account = {};
            if (account.accountDetails.code) body.account.code = account.accountDetails.code;
            if (account.accountDetails.id) body.account.id = account.accountDetails.id;
          }

          if (unitAmount) body.unit_amount = unitAmount;

          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/subscriptions`,
            body
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSubscription': {
          const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;

          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/subscriptions/${subscriptionId}`
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateSubscription': {
          const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
          const planCode = this.getNodeParameter('planCode', i) as string;
          const unitAmount = this.getNodeParameter('unitAmount', i) as number;
          const quantity = this.getNodeParameter('quantity', i) as number;

          const body: any = {};
          if (planCode) body.plan_code = planCode;
          if (unitAmount) body.unit_amount = unitAmount;
          if (quantity) body.quantity = quantity;

          const options: any = {
            ...baseOptions,
            method: 'PUT',
            url: `${credentials.baseUrl}/subscriptions/${subscriptionId}`,
            body
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelSubscription': {
          const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;

          const options: any = {
            ...baseOptions,
            method: 'DELETE',
            url: `${credentials.baseUrl}/subscriptions/${subscriptionId}`
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'reactivateSubscription': {
          const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;

          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/subscriptions/${subscriptionId}/reactivate`,
            headers: {
              ...baseOptions.headers,
              'Idempotency-Key': `${Date.now()}-${i}`,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'pauseSubscription': {
          const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
          const remainingPauseCycles = this.getNodeParameter('remainingPauseCycles', i) as number;

          const body: any = {
            remaining_pause_cycles: remainingPauseCycles
          };

          const options: any = {
            ...baseOptions,
            method: 'PUT',
            url: `${credentials.baseUrl}/subscriptions/${subscriptionId}/pause`,
            body
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'resumeSubscription': {
          const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;

          const options: any = {
            ...baseOptions,
            method: 'PUT',
            url: `${credentials.baseUrl}/subscriptions/${subscriptionId}/resume`
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
        throw error;
      }
    }
  }

  return returnData;
}

async function executeInvoiceOperations(
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
					const limit = this.getNodeParameter('limit', i) as number;
					const cursor = this.getNodeParameter('cursor', i) as string;
					const ids = this.getNodeParameter('ids', i) as string;
					const state = this.getNodeParameter('state', i) as string;
					const type = this.getNodeParameter('type', i) as string;
					const accountId = this.getNodeParameter('accountId', i) as string;

					const queryParams = new URLSearchParams();
					if (limit) queryParams.append('limit', limit.toString());
					if (cursor) queryParams.append('cursor', cursor);
					if (ids) queryParams.append('ids', ids);
					if (state) queryParams.append('state', state);
					if (type) queryParams.append('type', type);
					if (accountId) queryParams.append('account_id', accountId);

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/invoices?${queryParams.toString()}`,
						headers: {
							'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
							'Accept': 'application/vnd.recurly.v3',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createInvoice': {
					const accountId = this.getNodeParameter('accountId', i) as string;
					const currency = this.getNodeParameter('currency', i) as string;
					const collectionMethod = this.getNodeParameter('collectionMethod', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/invoices`,
						headers: {
							'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
							'Accept': 'application/vnd.recurly.v3',
							'Content-Type': 'application/json',
						},
						body: {
							account_id: accountId,
							currency: currency,
							collection_method: collectionMethod,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getInvoice': {
					const invoiceId = this.getNodeParameter('invoiceId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/invoices/${invoiceId}`,
						headers: {
							'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
							'Accept': 'application/vnd.recurly.v3',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateInvoice': {
					const invoiceId = this.getNodeParameter('invoiceId', i) as string;
					const termsAndConditions = this.getNodeParameter('termsAndConditions', i) as string;
					const customerNotes = this.getNodeParameter('customerNotes', i) as string;

					const body: any = {};
					if (termsAndConditions) body.terms_and_conditions = termsAndConditions;
					if (customerNotes) body.customer_notes = customerNotes;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/invoices/${invoiceId}`,
						headers: {
							'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
							'Accept': 'application/vnd.recurly.v3',
							'Content-Type': 'application/json',
						},
						body: body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'voidInvoice': {
					const invoiceId = this.getNodeParameter('invoiceId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/invoices/${invoiceId}`,
						headers: {
							'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
							'Accept': 'application/vnd.recurly.v3',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'collectInvoice': {
					const invoiceId = this.getNodeParameter('invoiceId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/invoices/${invoiceId}/collect`,
						headers: {
							'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
							'Accept': 'application/vnd.recurly.v3',
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'markInvoiceSuccessful': {
					const invoiceId = this.getNodeParameter('invoiceId', i) as string;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/invoices/${invoiceId}/mark_successful`,
						headers: {
							'Authorization': `Basic ${Buffer.from(credentials.apiKey + ':').toString('base64')}`,
							'Accept': 'application/vnd.recurly.v3',
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

        case 'markInvoiceFailed': {
          const invoiceId = this.getNodeParameter('invoiceId', i) as string;