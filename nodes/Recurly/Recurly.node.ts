/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	recurlyApiRequest,
	recurlyApiRequestAllItems,
	removeEmptyFields,
	emitLicensingNotice,
	toRecurlyDate,
} from './GenericFunctions';

import { accountOperations, accountFields } from './descriptions/AccountDescription';
import { subscriptionOperations, subscriptionFields } from './descriptions/SubscriptionDescription';
import { planOperations, planFields } from './descriptions/PlanDescription';
import { invoiceOperations, invoiceFields } from './descriptions/InvoiceDescription';
import { transactionOperations, transactionFields } from './descriptions/TransactionDescription';
import { couponOperations, couponFields } from './descriptions/CouponDescription';
import { creditPaymentOperations, creditPaymentFields } from './descriptions/CreditPaymentDescription';
import { lineItemOperations, lineItemFields } from './descriptions/LineItemDescription';
import { addOnOperations, addOnFields } from './descriptions/AddOnDescription';
import { shippingMethodOperations, shippingMethodFields } from './descriptions/ShippingMethodDescription';
import { measuredUnitOperations, measuredUnitFields } from './descriptions/MeasuredUnitDescription';
import { usageOperations, usageFields } from './descriptions/UsageDescription';

export class Recurly implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Recurly',
		name: 'recurly',
		icon: 'file:recurly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Recurly subscription management API',
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
						name: 'Add-On',
						value: 'addOn',
					},
					{
						name: 'Coupon',
						value: 'coupon',
					},
					{
						name: 'Credit Payment',
						value: 'creditPayment',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Line Item',
						value: 'lineItem',
					},
					{
						name: 'Measured Unit',
						value: 'measuredUnit',
					},
					{
						name: 'Plan',
						value: 'plan',
					},
					{
						name: 'Shipping Method',
						value: 'shippingMethod',
					},
					{
						name: 'Subscription',
						value: 'subscription',
					},
					{
						name: 'Transaction',
						value: 'transaction',
					},
					{
						name: 'Usage',
						value: 'usage',
					},
				],
				default: 'account',
			},
			// Operations and fields for all resources
			...accountOperations,
			...accountFields,
			...subscriptionOperations,
			...subscriptionFields,
			...planOperations,
			...planFields,
			...invoiceOperations,
			...invoiceFields,
			...transactionOperations,
			...transactionFields,
			...couponOperations,
			...couponFields,
			...creditPaymentOperations,
			...creditPaymentFields,
			...lineItemOperations,
			...lineItemFields,
			...addOnOperations,
			...addOnFields,
			...shippingMethodOperations,
			...shippingMethodFields,
			...measuredUnitOperations,
			...measuredUnitFields,
			...usageOperations,
			...usageFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Emit licensing notice once per node load
		emitLicensingNotice(this);

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ============================================
				//             ACCOUNT OPERATIONS
				// ============================================
				if (resource === 'account') {
					if (operation === 'create') {
						const accountCode = this.getNodeParameter('accountCode', i) as string;
						const email = this.getNodeParameter('email', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							code: accountCode,
						};

						if (email) {
							body.email = email;
						}

						// Handle address fields
						const addressFields = ['street1', 'street2', 'city', 'region', 'postalCode', 'country'];
						const address: IDataObject = {};
						for (const field of addressFields) {
							if (additionalFields[field]) {
								address[field === 'postalCode' ? 'postal_code' : field] = additionalFields[field];
								delete additionalFields[field];
							}
						}
						if (Object.keys(address).length > 0) {
							body.address = address;
						}

						// Handle remaining fields with snake_case conversion
						if (additionalFields.firstName) body.first_name = additionalFields.firstName;
						if (additionalFields.lastName) body.last_name = additionalFields.lastName;
						if (additionalFields.company) body.company = additionalFields.company;
						if (additionalFields.vatNumber) body.vat_number = additionalFields.vatNumber;
						if (additionalFields.exemptionCertificate) body.exemption_certificate = additionalFields.exemptionCertificate;
						if (additionalFields.parentAccountId) body.parent_account_id = additionalFields.parentAccountId;
						if (additionalFields.billTo) body.bill_to = additionalFields.billTo;
						if (additionalFields.username) body.username = additionalFields.username;
						if (additionalFields.phone) body.phone = additionalFields.phone;

						responseData = await recurlyApiRequest.call(this, 'POST', '/accounts', removeEmptyFields(body));
					}

					if (operation === 'get') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/accounts/${accountId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.state) query.state = filters.state;
						if (filters.email) query.email = filters.email;
						if (filters.sort) query.sort = filters.sort;
						if (filters.order) query.order = filters.order;

						if (returnAll) {
							responseData = await recurlyApiRequestAllItems.call(this, 'GET', '/accounts', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await recurlyApiRequest.call(this, 'GET', '/accounts', {}, query);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'update') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						// Handle address fields
						const addressFields = ['street1', 'street2', 'city', 'region', 'postalCode', 'country'];
						const address: IDataObject = {};
						for (const field of addressFields) {
							if (updateFields[field]) {
								address[field === 'postalCode' ? 'postal_code' : field] = updateFields[field];
								delete updateFields[field];
							}
						}
						if (Object.keys(address).length > 0) {
							body.address = address;
						}

						// Handle remaining fields
						if (updateFields.email) body.email = updateFields.email;
						if (updateFields.firstName) body.first_name = updateFields.firstName;
						if (updateFields.lastName) body.last_name = updateFields.lastName;
						if (updateFields.company) body.company = updateFields.company;
						if (updateFields.vatNumber) body.vat_number = updateFields.vatNumber;
						if (updateFields.exemptionCertificate) body.exemption_certificate = updateFields.exemptionCertificate;
						if (updateFields.parentAccountId) body.parent_account_id = updateFields.parentAccountId;
						if (updateFields.billTo) body.bill_to = updateFields.billTo;
						if (updateFields.username) body.username = updateFields.username;
						if (updateFields.phone) body.phone = updateFields.phone;

						responseData = await recurlyApiRequest.call(this, 'PUT', `/accounts/${accountId}`, removeEmptyFields(body));
					}

					if (operation === 'delete') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'DELETE', `/accounts/${accountId}`);
					}

					if (operation === 'reopen') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'PUT', `/accounts/${accountId}/reopen`);
					}

					if (operation === 'getBalance') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/accounts/${accountId}/balance`);
					}

					if (operation === 'getBillingInfo') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/accounts/${accountId}/billing_info`);
					}

					if (operation === 'updateBillingInfo') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						const billingFields = this.getNodeParameter('billingFields', i) as IDataObject;

						const body: IDataObject = {};

						if (billingFields.tokenId) body.token_id = billingFields.tokenId;
						if (billingFields.firstName) body.first_name = billingFields.firstName;
						if (billingFields.lastName) body.last_name = billingFields.lastName;
						if (billingFields.company) body.company = billingFields.company;
						if (billingFields.street1) body.street1 = billingFields.street1;
						if (billingFields.street2) body.street2 = billingFields.street2;
						if (billingFields.city) body.city = billingFields.city;
						if (billingFields.region) body.region = billingFields.region;
						if (billingFields.postalCode) body.postal_code = billingFields.postalCode;
						if (billingFields.country) body.country = billingFields.country;
						if (billingFields.vatNumber) body.vat_number = billingFields.vatNumber;

						responseData = await recurlyApiRequest.call(this, 'PUT', `/accounts/${accountId}/billing_info`, removeEmptyFields(body));
					}
				}

				// ============================================
				//           SUBSCRIPTION OPERATIONS
				// ============================================
				if (resource === 'subscription') {
					if (operation === 'create') {
						const planCode = this.getNodeParameter('planCode', i) as string;
						const accountId = this.getNodeParameter('accountId', i) as string;
						const currency = this.getNodeParameter('currency', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							plan_code: planCode,
							account: { id: accountId },
							currency,
						};

						if (additionalFields.quantity) body.quantity = additionalFields.quantity;
						if (additionalFields.unitAmount) body.unit_amount = additionalFields.unitAmount;
						if (additionalFields.collectionMethod) body.collection_method = additionalFields.collectionMethod;
						if (additionalFields.autoRenew !== undefined) body.auto_renew = additionalFields.autoRenew;
						if (additionalFields.netTerms) body.net_terms = additionalFields.netTerms;
						if (additionalFields.trialEndsAt) body.trial_ends_at = toRecurlyDate(additionalFields.trialEndsAt as string);
						if (additionalFields.startsAt) body.starts_at = toRecurlyDate(additionalFields.startsAt as string);
						if (additionalFields.totalBillingCycles) body.total_billing_cycles = additionalFields.totalBillingCycles;
						if (additionalFields.renewalBillingCycles) body.renewal_billing_cycles = additionalFields.renewalBillingCycles;
						if (additionalFields.couponCodes) {
							body.coupon_codes = (additionalFields.couponCodes as string).split(',').map(c => c.trim());
						}

						responseData = await recurlyApiRequest.call(this, 'POST', '/subscriptions', removeEmptyFields(body));
					}

					if (operation === 'get') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/subscriptions/${subscriptionId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.state) query.state = filters.state;
						if (filters.accountId) query.account_id = filters.accountId;
						if (filters.planCode) query.plan_code = filters.planCode;
						if (filters.sort) query.sort = filters.sort;
						if (filters.order) query.order = filters.order;

						if (returnAll) {
							responseData = await recurlyApiRequestAllItems.call(this, 'GET', '/subscriptions', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await recurlyApiRequest.call(this, 'GET', '/subscriptions', {}, query);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'update') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.quantity) body.quantity = updateFields.quantity;
						if (updateFields.unitAmount) body.unit_amount = updateFields.unitAmount;
						if (updateFields.collectionMethod) body.collection_method = updateFields.collectionMethod;
						if (updateFields.autoRenew !== undefined) body.auto_renew = updateFields.autoRenew;
						if (updateFields.netTerms) body.net_terms = updateFields.netTerms;
						if (updateFields.renewalBillingCycles) body.renewal_billing_cycles = updateFields.renewalBillingCycles;

						responseData = await recurlyApiRequest.call(this, 'PUT', `/subscriptions/${subscriptionId}`, removeEmptyFields(body));
					}

					if (operation === 'cancel') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						const body: IDataObject = {};
						if (options.timeframe) body.timeframe = options.timeframe;

						responseData = await recurlyApiRequest.call(this, 'PUT', `/subscriptions/${subscriptionId}/cancel`, removeEmptyFields(body));
					}

					if (operation === 'reactivate') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'PUT', `/subscriptions/${subscriptionId}/reactivate`);
					}

					if (operation === 'pause') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						const remainingPauseCycles = this.getNodeParameter('remainingPauseCycles', i) as number;

						const body: IDataObject = {
							remaining_pause_cycles: remainingPauseCycles,
						};

						responseData = await recurlyApiRequest.call(this, 'PUT', `/subscriptions/${subscriptionId}/pause`, body);
					}

					if (operation === 'resume') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'PUT', `/subscriptions/${subscriptionId}/resume`);
					}

					if (operation === 'terminate') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						const query: IDataObject = {};
						if (options.refund) query.refund = options.refund;
						if (options.charge !== undefined) query.charge = options.charge;

						responseData = await recurlyApiRequest.call(this, 'DELETE', `/subscriptions/${subscriptionId}`, {}, query);
					}

					if (operation === 'postpone') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						const nextRenewalDate = this.getNodeParameter('nextRenewalDate', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						const body: IDataObject = {
							next_bill_date: toRecurlyDate(nextRenewalDate),
						};
						if (options.bulk !== undefined) body.bulk = options.bulk;

						responseData = await recurlyApiRequest.call(this, 'PUT', `/subscriptions/${subscriptionId}/postpone`, body);
					}
				}

				// ============================================
				//              PLAN OPERATIONS
				// ============================================
				if (resource === 'plan') {
					if (operation === 'create') {
						const planCode = this.getNodeParameter('planCode', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							code: planCode,
							name,
						};

						if (additionalFields.description) body.description = additionalFields.description;
						if (additionalFields.intervalUnit) body.interval_unit = additionalFields.intervalUnit;
						if (additionalFields.intervalLength) body.interval_length = additionalFields.intervalLength;
						if (additionalFields.trialUnit) body.trial_unit = additionalFields.trialUnit;
						if (additionalFields.trialLength) body.trial_length = additionalFields.trialLength;
						if (additionalFields.accountingCode) body.accounting_code = additionalFields.accountingCode;
						if (additionalFields.taxCode) body.tax_code = additionalFields.taxCode;
						if (additionalFields.taxExempt !== undefined) body.tax_exempt = additionalFields.taxExempt;
						if (additionalFields.autoRenew !== undefined) body.auto_renew = additionalFields.autoRenew;

						// Handle currencies/pricing
						if (additionalFields.currency && additionalFields.unitAmount) {
							body.currencies = [{
								currency: additionalFields.currency,
								unit_amount: additionalFields.unitAmount,
								setup_fee: additionalFields.setupFee || 0,
							}];
						}

						responseData = await recurlyApiRequest.call(this, 'POST', '/plans', removeEmptyFields(body));
					}

					if (operation === 'get') {
						const planId = this.getNodeParameter('planId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/plans/${planId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.state) query.state = filters.state;
						if (filters.sort) query.sort = filters.sort;
						if (filters.order) query.order = filters.order;

						if (returnAll) {
							responseData = await recurlyApiRequestAllItems.call(this, 'GET', '/plans', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await recurlyApiRequest.call(this, 'GET', '/plans', {}, query);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'update') {
						const planId = this.getNodeParameter('planId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.description) body.description = updateFields.description;
						if (updateFields.intervalUnit) body.interval_unit = updateFields.intervalUnit;
						if (updateFields.intervalLength) body.interval_length = updateFields.intervalLength;
						if (updateFields.trialUnit) body.trial_unit = updateFields.trialUnit;
						if (updateFields.trialLength) body.trial_length = updateFields.trialLength;
						if (updateFields.accountingCode) body.accounting_code = updateFields.accountingCode;
						if (updateFields.taxCode) body.tax_code = updateFields.taxCode;
						if (updateFields.taxExempt !== undefined) body.tax_exempt = updateFields.taxExempt;
						if (updateFields.autoRenew !== undefined) body.auto_renew = updateFields.autoRenew;

						responseData = await recurlyApiRequest.call(this, 'PUT', `/plans/${planId}`, removeEmptyFields(body));
					}

					if (operation === 'delete') {
						const planId = this.getNodeParameter('planId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'DELETE', `/plans/${planId}`);
					}
				}

				// ============================================
				//             INVOICE OPERATIONS
				// ============================================
				if (resource === 'invoice') {
					if (operation === 'create') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						const currency = this.getNodeParameter('currency', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							currency,
						};

						if (additionalFields.collectionMethod) body.collection_method = additionalFields.collectionMethod;
						if (additionalFields.netTerms) body.net_terms = additionalFields.netTerms;
						if (additionalFields.poNumber) body.po_number = additionalFields.poNumber;

						responseData = await recurlyApiRequest.call(this, 'POST', `/accounts/${accountId}/invoices`, removeEmptyFields(body));
					}

					if (operation === 'get') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/invoices/${invoiceId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.state) query.state = filters.state;
						if (filters.type) query.type = filters.type;
						if (filters.origin) query.origin = filters.origin;
						if (filters.accountId) query.account_id = filters.accountId;
						if (filters.sort) query.sort = filters.sort;
						if (filters.order) query.order = filters.order;

						if (returnAll) {
							responseData = await recurlyApiRequestAllItems.call(this, 'GET', '/invoices', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await recurlyApiRequest.call(this, 'GET', '/invoices', {}, query);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'collect') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						const body: IDataObject = {};
						if (options.transactionType) body.transaction_type = options.transactionType;
						if (options.threeDSecureActionResultTokenId) body.three_d_secure_action_result_token_id = options.threeDSecureActionResultTokenId;

						responseData = await recurlyApiRequest.call(this, 'PUT', `/invoices/${invoiceId}/collect`, removeEmptyFields(body));
					}

					if (operation === 'markPaid') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'PUT', `/invoices/${invoiceId}/mark_paid`);
					}

					if (operation === 'markFailed') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'PUT', `/invoices/${invoiceId}/mark_failed`);
					}

					if (operation === 'void') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'PUT', `/invoices/${invoiceId}/void`);
					}

					if (operation === 'refund') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						const refundType = this.getNodeParameter('refundType', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						const body: IDataObject = {
							type: refundType,
						};

						if (refundType === 'amount' && options.amount) {
							body.amount = options.amount;
						}
						if (options.creditCustomerNotes) body.credit_customer_notes = options.creditCustomerNotes;
						if (options.externalRefund !== undefined) body.external_refund = options.externalRefund;

						responseData = await recurlyApiRequest.call(this, 'POST', `/invoices/${invoiceId}/refund`, removeEmptyFields(body));
					}

					if (operation === 'getPdf') {
						const invoiceId = this.getNodeParameter('invoiceId', i) as string;
						// Note: PDF download returns binary data
						responseData = await recurlyApiRequest.call(this, 'GET', `/invoices/${invoiceId}.pdf`);
					}
				}

				// ============================================
				//           TRANSACTION OPERATIONS
				// ============================================
				if (resource === 'transaction') {
					if (operation === 'create') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						const amount = this.getNodeParameter('amount', i) as number;
						const currency = this.getNodeParameter('currency', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							account: { id: accountId },
							amount,
							currency,
						};

						if (additionalFields.type) body.type = additionalFields.type;

						responseData = await recurlyApiRequest.call(this, 'POST', '/transactions', removeEmptyFields(body));
					}

					if (operation === 'get') {
						const transactionId = this.getNodeParameter('transactionId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/transactions/${transactionId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.accountId) query.account_id = filters.accountId;
						if (filters.success !== undefined) query.success = filters.success;
						if (filters.type) query.type = filters.type;
						if (filters.sort) query.sort = filters.sort;
						if (filters.order) query.order = filters.order;

						if (returnAll) {
							responseData = await recurlyApiRequestAllItems.call(this, 'GET', '/transactions', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await recurlyApiRequest.call(this, 'GET', '/transactions', {}, query);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'refund') {
						const transactionId = this.getNodeParameter('transactionId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						const body: IDataObject = {};
						if (options.amount) body.amount = options.amount;

						responseData = await recurlyApiRequest.call(this, 'POST', `/transactions/${transactionId}/refund`, removeEmptyFields(body));
					}

					if (operation === 'void') {
						const transactionId = this.getNodeParameter('transactionId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'DELETE', `/transactions/${transactionId}`);
					}
				}

				// ============================================
				//              COUPON OPERATIONS
				// ============================================
				if (resource === 'coupon') {
					if (operation === 'create') {
						const couponCode = this.getNodeParameter('couponCode', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const discountType = this.getNodeParameter('discountType', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							code: couponCode,
							name,
							discount_type: discountType,
						};

						if (discountType === 'percent' && additionalFields.discountPercent) {
							body.discount_percent = additionalFields.discountPercent;
						}

						if (discountType === 'fixed' && additionalFields.currency && additionalFields.discountAmount) {
							body.currencies = [{
								currency: additionalFields.currency,
								discount: additionalFields.discountAmount,
							}];
						}

						if (discountType === 'free_trial') {
							if (additionalFields.freeTrialUnit) body.free_trial_unit = additionalFields.freeTrialUnit;
							if (additionalFields.freeTrialAmount) body.free_trial_amount = additionalFields.freeTrialAmount;
						}

						if (additionalFields.duration) body.duration = additionalFields.duration;
						if (additionalFields.temporalAmount) body.temporal_amount = additionalFields.temporalAmount;
						if (additionalFields.temporalUnit) body.temporal_unit = additionalFields.temporalUnit;
						if (additionalFields.maxRedemptions) body.max_redemptions = additionalFields.maxRedemptions;
						if (additionalFields.maxRedemptionsPerAccount) body.max_redemptions_per_account = additionalFields.maxRedemptionsPerAccount;
						if (additionalFields.redeemByDate) body.redeem_by = toRecurlyDate(additionalFields.redeemByDate as string);
						if (additionalFields.appliesToAllPlans !== undefined) body.applies_to_all_plans = additionalFields.appliesToAllPlans;
						if (additionalFields.planCodes) {
							body.plan_codes = (additionalFields.planCodes as string).split(',').map(c => c.trim());
						}

						responseData = await recurlyApiRequest.call(this, 'POST', '/coupons', removeEmptyFields(body));
					}

					if (operation === 'get') {
						const couponId = this.getNodeParameter('couponId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/coupons/${couponId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.state) query.state = filters.state;
						if (filters.sort) query.sort = filters.sort;
						if (filters.order) query.order = filters.order;

						if (returnAll) {
							responseData = await recurlyApiRequestAllItems.call(this, 'GET', '/coupons', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await recurlyApiRequest.call(this, 'GET', '/coupons', {}, query);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'update') {
						const couponId = this.getNodeParameter('couponId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.maxRedemptions) body.max_redemptions = updateFields.maxRedemptions;
						if (updateFields.maxRedemptionsPerAccount) body.max_redemptions_per_account = updateFields.maxRedemptionsPerAccount;
						if (updateFields.redeemByDate) body.redeem_by = toRecurlyDate(updateFields.redeemByDate as string);

						responseData = await recurlyApiRequest.call(this, 'PUT', `/coupons/${couponId}`, removeEmptyFields(body));
					}

					if (operation === 'delete') {
						const couponId = this.getNodeParameter('couponId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'DELETE', `/coupons/${couponId}`);
					}

					if (operation === 'restore') {
						const couponId = this.getNodeParameter('couponId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'PUT', `/coupons/${couponId}/restore`);
					}

					if (operation === 'generateCodes') {
						const couponId = this.getNodeParameter('couponId', i) as string;
						const numberOfCodes = this.getNodeParameter('numberOfCodes', i) as number;

						const body: IDataObject = {
							number_of_unique_codes: numberOfCodes,
						};

						responseData = await recurlyApiRequest.call(this, 'POST', `/coupons/${couponId}/generate`, body);
					}
				}

				// ============================================
				//          CREDIT PAYMENT OPERATIONS
				// ============================================
				if (resource === 'creditPayment') {
					if (operation === 'get') {
						const creditPaymentId = this.getNodeParameter('creditPaymentId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/credit_payments/${creditPaymentId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.accountId) query.account_id = filters.accountId;
						if (filters.sort) query.sort = filters.sort;
						if (filters.order) query.order = filters.order;

						if (returnAll) {
							responseData = await recurlyApiRequestAllItems.call(this, 'GET', '/credit_payments', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await recurlyApiRequest.call(this, 'GET', '/credit_payments', {}, query);
							responseData = (response.data as IDataObject[]) || [];
						}
					}
				}

				// ============================================
				//            LINE ITEM OPERATIONS
				// ============================================
				if (resource === 'lineItem') {
					if (operation === 'create') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						const currency = this.getNodeParameter('currency', i) as string;
						const unitAmount = this.getNodeParameter('unitAmount', i) as number;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							currency,
							unit_amount: unitAmount,
						};

						if (additionalFields.type) body.type = additionalFields.type;
						if (additionalFields.quantity) body.quantity = additionalFields.quantity;
						if (additionalFields.description) body.description = additionalFields.description;
						if (additionalFields.productCode) body.product_code = additionalFields.productCode;
						if (additionalFields.revenueScheduleType) body.revenue_schedule_type = additionalFields.revenueScheduleType;
						if (additionalFields.taxCode) body.tax_code = additionalFields.taxCode;
						if (additionalFields.taxExempt !== undefined) body.tax_exempt = additionalFields.taxExempt;
						if (additionalFields.startDate) body.start_date = toRecurlyDate(additionalFields.startDate as string);
						if (additionalFields.endDate) body.end_date = toRecurlyDate(additionalFields.endDate as string);

						responseData = await recurlyApiRequest.call(this, 'POST', `/accounts/${accountId}/line_items`, removeEmptyFields(body));
					}

					if (operation === 'get') {
						const lineItemId = this.getNodeParameter('lineItemId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/line_items/${lineItemId}`);
					}

					if (operation === 'getAll') {
						const accountId = this.getNodeParameter('accountId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.state) query.state = filters.state;
						if (filters.type) query.type = filters.type;
						if (filters.sort) query.sort = filters.sort;
						if (filters.order) query.order = filters.order;

						if (returnAll) {
							responseData = await recurlyApiRequestAllItems.call(this, 'GET', `/accounts/${accountId}/line_items`, {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await recurlyApiRequest.call(this, 'GET', `/accounts/${accountId}/line_items`, {}, query);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'delete') {
						const lineItemId = this.getNodeParameter('lineItemId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'DELETE', `/line_items/${lineItemId}`);
					}
				}

				// ============================================
				//             ADD-ON OPERATIONS
				// ============================================
				if (resource === 'addOn') {
					if (operation === 'create') {
						const planId = this.getNodeParameter('planId', i) as string;
						const addOnCode = this.getNodeParameter('addOnCode', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							code: addOnCode,
							name,
						};

						if (additionalFields.addOnType) body.add_on_type = additionalFields.addOnType;
						if (additionalFields.usageType) body.usage_type = additionalFields.usageType;
						if (additionalFields.measuredUnitId) body.measured_unit_id = additionalFields.measuredUnitId;
						if (additionalFields.defaultQuantity) body.default_quantity = additionalFields.defaultQuantity;
						if (additionalFields.optional !== undefined) body.optional = additionalFields.optional;
						if (additionalFields.displayQuantity !== undefined) body.display_quantity = additionalFields.displayQuantity;
						if (additionalFields.accountingCode) body.accounting_code = additionalFields.accountingCode;
						if (additionalFields.taxCode) body.tax_code = additionalFields.taxCode;

						// Handle currencies/pricing
						if (additionalFields.currency && additionalFields.unitAmount) {
							body.currencies = [{
								currency: additionalFields.currency,
								unit_amount: additionalFields.unitAmount,
							}];
						}

						responseData = await recurlyApiRequest.call(this, 'POST', `/plans/${planId}/add_ons`, removeEmptyFields(body));
					}

					if (operation === 'get') {
						const planId = this.getNodeParameter('planId', i) as string;
						const addOnId = this.getNodeParameter('addOnId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/plans/${planId}/add_ons/${addOnId}`);
					}

					if (operation === 'getAll') {
						const planId = this.getNodeParameter('planId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.state) query.state = filters.state;
						if (filters.sort) query.sort = filters.sort;
						if (filters.order) query.order = filters.order;

						if (returnAll) {
							responseData = await recurlyApiRequestAllItems.call(this, 'GET', `/plans/${planId}/add_ons`, {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await recurlyApiRequest.call(this, 'GET', `/plans/${planId}/add_ons`, {}, query);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'update') {
						const planId = this.getNodeParameter('planId', i) as string;
						const addOnId = this.getNodeParameter('addOnId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.defaultQuantity) body.default_quantity = updateFields.defaultQuantity;
						if (updateFields.optional !== undefined) body.optional = updateFields.optional;
						if (updateFields.displayQuantity !== undefined) body.display_quantity = updateFields.displayQuantity;
						if (updateFields.accountingCode) body.accounting_code = updateFields.accountingCode;
						if (updateFields.taxCode) body.tax_code = updateFields.taxCode;

						responseData = await recurlyApiRequest.call(this, 'PUT', `/plans/${planId}/add_ons/${addOnId}`, removeEmptyFields(body));
					}

					if (operation === 'delete') {
						const planId = this.getNodeParameter('planId', i) as string;
						const addOnId = this.getNodeParameter('addOnId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'DELETE', `/plans/${planId}/add_ons/${addOnId}`);
					}
				}

				// ============================================
				//         SHIPPING METHOD OPERATIONS
				// ============================================
				if (resource === 'shippingMethod') {
					if (operation === 'create') {
						const code = this.getNodeParameter('code', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							code,
							name,
						};

						if (additionalFields.taxCode) body.tax_code = additionalFields.taxCode;
						if (additionalFields.accountingCode) body.accounting_code = additionalFields.accountingCode;

						responseData = await recurlyApiRequest.call(this, 'POST', '/shipping_methods', removeEmptyFields(body));
					}

					if (operation === 'get') {
						const shippingMethodId = this.getNodeParameter('shippingMethodId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/shipping_methods/${shippingMethodId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.sort) query.sort = filters.sort;
						if (filters.order) query.order = filters.order;

						if (returnAll) {
							responseData = await recurlyApiRequestAllItems.call(this, 'GET', '/shipping_methods', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await recurlyApiRequest.call(this, 'GET', '/shipping_methods', {}, query);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'update') {
						const shippingMethodId = this.getNodeParameter('shippingMethodId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.taxCode) body.tax_code = updateFields.taxCode;
						if (updateFields.accountingCode) body.accounting_code = updateFields.accountingCode;

						responseData = await recurlyApiRequest.call(this, 'PUT', `/shipping_methods/${shippingMethodId}`, removeEmptyFields(body));
					}

					if (operation === 'delete') {
						const shippingMethodId = this.getNodeParameter('shippingMethodId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'DELETE', `/shipping_methods/${shippingMethodId}`);
					}
				}

				// ============================================
				//          MEASURED UNIT OPERATIONS
				// ============================================
				if (resource === 'measuredUnit') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const displayName = this.getNodeParameter('displayName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							name,
							display_name: displayName,
						};

						if (additionalFields.description) body.description = additionalFields.description;

						responseData = await recurlyApiRequest.call(this, 'POST', '/measured_units', removeEmptyFields(body));
					}

					if (operation === 'get') {
						const measuredUnitId = this.getNodeParameter('measuredUnitId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/measured_units/${measuredUnitId}`);
					}

					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.state) query.state = filters.state;
						if (filters.sort) query.sort = filters.sort;
						if (filters.order) query.order = filters.order;

						if (returnAll) {
							responseData = await recurlyApiRequestAllItems.call(this, 'GET', '/measured_units', {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await recurlyApiRequest.call(this, 'GET', '/measured_units', {}, query);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'update') {
						const measuredUnitId = this.getNodeParameter('measuredUnitId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.displayName) body.display_name = updateFields.displayName;
						if (updateFields.description) body.description = updateFields.description;

						responseData = await recurlyApiRequest.call(this, 'PUT', `/measured_units/${measuredUnitId}`, removeEmptyFields(body));
					}

					if (operation === 'delete') {
						const measuredUnitId = this.getNodeParameter('measuredUnitId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'DELETE', `/measured_units/${measuredUnitId}`);
					}
				}

				// ============================================
				//              USAGE OPERATIONS
				// ============================================
				if (resource === 'usage') {
					if (operation === 'create') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						const addOnId = this.getNodeParameter('addOnId', i) as string;
						const amount = this.getNodeParameter('amount', i) as number;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							amount,
						};

						if (additionalFields.merchantTag) body.merchant_tag = additionalFields.merchantTag;
						if (additionalFields.recordingTimestamp) body.recording_timestamp = toRecurlyDate(additionalFields.recordingTimestamp as string);
						if (additionalFields.usageTimestamp) body.usage_timestamp = toRecurlyDate(additionalFields.usageTimestamp as string);

						responseData = await recurlyApiRequest.call(this, 'POST', `/subscriptions/${subscriptionId}/add_ons/${addOnId}/usage`, removeEmptyFields(body));
					}

					if (operation === 'get') {
						const usageId = this.getNodeParameter('usageId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'GET', `/usage/${usageId}`);
					}

					if (operation === 'getAll') {
						const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
						const addOnId = this.getNodeParameter('addOnId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const query: IDataObject = {};

						if (filters.billingStatus) query.billing_status = filters.billingStatus;
						if (filters.sort) query.sort = filters.sort;
						if (filters.order) query.order = filters.order;

						if (returnAll) {
							responseData = await recurlyApiRequestAllItems.call(this, 'GET', `/subscriptions/${subscriptionId}/add_ons/${addOnId}/usage`, {}, query);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							query.limit = limit;
							const response = await recurlyApiRequest.call(this, 'GET', `/subscriptions/${subscriptionId}/add_ons/${addOnId}/usage`, {}, query);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'update') {
						const usageId = this.getNodeParameter('usageId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};

						if (updateFields.amount !== undefined) body.amount = updateFields.amount;
						if (updateFields.merchantTag) body.merchant_tag = updateFields.merchantTag;
						if (updateFields.recordingTimestamp) body.recording_timestamp = toRecurlyDate(updateFields.recordingTimestamp as string);
						if (updateFields.usageTimestamp) body.usage_timestamp = toRecurlyDate(updateFields.usageTimestamp as string);

						responseData = await recurlyApiRequest.call(this, 'PUT', `/usage/${usageId}`, removeEmptyFields(body));
					}

					if (operation === 'delete') {
						const usageId = this.getNodeParameter('usageId', i) as string;
						responseData = await recurlyApiRequest.call(this, 'DELETE', `/usage/${usageId}`);
					}
				}

				// Return the response data
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
