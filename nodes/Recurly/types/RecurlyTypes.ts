/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

export interface IRecurlyAccount {
	id?: string;
	code?: string;
	email?: string;
	first_name?: string;
	last_name?: string;
	company?: string;
	vat_number?: string;
	exemption_certificate?: string;
	parent_account_id?: string;
	bill_to?: 'self' | 'parent';
	address?: IRecurlyAddress;
	state?: 'active' | 'closed';
	created_at?: string;
	updated_at?: string;
}

export interface IRecurlyAddress {
	street1?: string;
	street2?: string;
	city?: string;
	region?: string;
	postal_code?: string;
	country?: string;
	phone?: string;
}

export interface IRecurlySubscription {
	id?: string;
	plan?: IDataObject;
	plan_code?: string;
	account?: IDataObject;
	account_id?: string;
	currency?: string;
	quantity?: number;
	unit_amount?: number;
	started_at?: string;
	current_period_started_at?: string;
	current_period_ends_at?: string;
	trial_started_at?: string;
	trial_ends_at?: string;
	total_billing_cycles?: number;
	renewal_billing_cycles?: number;
	auto_renew?: boolean;
	state?: string;
	collection_method?: 'automatic' | 'manual';
	net_terms?: number;
	coupon_codes?: string[];
	add_ons?: IRecurlySubscriptionAddOn[];
	created_at?: string;
	updated_at?: string;
}

export interface IRecurlySubscriptionAddOn {
	code?: string;
	quantity?: number;
	unit_amount?: number;
	add_on_source?: string;
}

export interface IRecurlyPlan {
	id?: string;
	code?: string;
	name?: string;
	description?: string;
	interval_unit?: 'days' | 'months';
	interval_length?: number;
	trial_unit?: 'days' | 'months';
	trial_length?: number;
	setup_fee_accounting_code?: string;
	accounting_code?: string;
	currencies?: IRecurlyPlanPricing[];
	hosted_pages?: IDataObject;
	tax_code?: string;
	tax_exempt?: boolean;
	state?: 'active' | 'inactive';
	created_at?: string;
	updated_at?: string;
}

export interface IRecurlyPlanPricing {
	currency: string;
	unit_amount: number;
	setup_fee?: number;
}

export interface IRecurlyInvoice {
	id?: string;
	number?: string;
	account?: IDataObject;
	subscription_ids?: string[];
	type?: 'charge' | 'credit' | 'legacy';
	origin?: string;
	state?: string;
	currency?: string;
	subtotal?: number;
	tax?: number;
	total?: number;
	balance?: number;
	due_at?: string;
	closed_at?: string;
	collection_method?: 'automatic' | 'manual';
	net_terms?: number;
	created_at?: string;
	updated_at?: string;
}

export interface IRecurlyTransaction {
	id?: string;
	account?: IDataObject;
	invoice?: IDataObject;
	subscription_ids?: string[];
	type?: string;
	origin?: string;
	currency?: string;
	amount?: number;
	status?: string;
	success?: boolean;
	refunded?: boolean;
	gateway_message?: string;
	payment_method?: IDataObject;
	collected_at?: string;
	created_at?: string;
}

export interface IRecurlyCoupon {
	id?: string;
	code?: string;
	name?: string;
	state?: string;
	discount_type?: 'percent' | 'fixed' | 'free_trial';
	discount_percent?: number;
	free_trial_unit?: string;
	free_trial_amount?: number;
	currencies?: IRecurlyCouponDiscount[];
	duration?: 'forever' | 'single_use' | 'temporal';
	temporal_amount?: number;
	temporal_unit?: 'day' | 'week' | 'month' | 'year';
	max_redemptions?: number;
	max_redemptions_per_account?: number;
	applies_to_all_plans?: boolean;
	plan_codes?: string[];
	redeem_by_date?: string;
	created_at?: string;
	updated_at?: string;
}

export interface IRecurlyCouponDiscount {
	currency: string;
	amount: number;
}

export interface IRecurlyCreditPayment {
	id?: string;
	account?: IDataObject;
	invoice?: IDataObject;
	amount?: number;
	currency?: string;
	action?: string;
	uuid?: string;
	created_at?: string;
}

export interface IRecurlyLineItem {
	id?: string;
	account?: IDataObject;
	subscription_id?: string;
	invoice_id?: string;
	type?: 'charge' | 'credit' | 'setup_fee';
	currency?: string;
	amount?: number;
	quantity?: number;
	description?: string;
	product_code?: string;
	revenue_schedule_type?: string;
	origin?: string;
	state?: 'pending' | 'invoiced';
	created_at?: string;
	updated_at?: string;
}

export interface IRecurlyAddOn {
	id?: string;
	plan_id?: string;
	code?: string;
	name?: string;
	add_on_type?: 'fixed' | 'usage';
	usage_type?: 'price' | 'percentage';
	measured_unit_id?: string;
	display_quantity?: boolean;
	default_quantity?: number;
	optional?: boolean;
	currencies?: IRecurlyAddOnPricing[];
	tax_code?: string;
	accounting_code?: string;
	revenue_schedule_type?: string;
	state?: 'active' | 'inactive';
	created_at?: string;
	updated_at?: string;
}

export interface IRecurlyAddOnPricing {
	currency: string;
	unit_amount: number;
}

export interface IRecurlyShippingMethod {
	id?: string;
	code?: string;
	name?: string;
	tax_code?: string;
	accounting_code?: string;
	state?: 'active' | 'inactive';
	created_at?: string;
	updated_at?: string;
}

export interface IRecurlyMeasuredUnit {
	id?: string;
	name?: string;
	display_name?: string;
	description?: string;
	state?: 'active' | 'inactive';
	created_at?: string;
	updated_at?: string;
}

export interface IRecurlyUsage {
	id?: string;
	subscription_id?: string;
	add_on_id?: string;
	measured_unit_id?: string;
	amount?: number;
	recording_timestamp?: string;
	usage_timestamp?: string;
	billed?: boolean;
	billed_at?: string;
	created_at?: string;
	updated_at?: string;
}

export interface IRecurlyBillingInfo {
	id?: string;
	account_id?: string;
	first_name?: string;
	last_name?: string;
	company?: string;
	address?: IRecurlyAddress;
	payment_method?: IDataObject;
	fraud?: IDataObject;
	created_at?: string;
	updated_at?: string;
}

export interface IRecurlyWebhookEvent {
	type: string;
	created_at: string;
	data: IDataObject;
}

export type RecurlyResource =
	| 'account'
	| 'subscription'
	| 'plan'
	| 'invoice'
	| 'transaction'
	| 'coupon'
	| 'creditPayment'
	| 'lineItem'
	| 'addOn'
	| 'shippingMethod'
	| 'measuredUnit'
	| 'usage';
