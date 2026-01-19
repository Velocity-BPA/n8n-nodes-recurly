/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import { parseStringPromise } from 'xml2js';
import { emitLicensingNotice } from './GenericFunctions';

export class RecurlyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Recurly Trigger',
		name: 'recurlyTrigger',
		icon: 'file:recurly.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Handle Recurly webhook events',
		defaults: {
			name: 'Recurly Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'recurlyApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'The events to listen to',
				options: [
					// Account Events
					{
						name: 'Account - Billing Info Fraud Review',
						value: 'billing_info.fraud_updated',
					},
					{
						name: 'Account - Billing Info Updated',
						value: 'billing_info.updated',
					},
					{
						name: 'Account - Closed',
						value: 'account.closed',
					},
					{
						name: 'Account - Created',
						value: 'account.created',
					},
					{
						name: 'Account - Updated',
						value: 'account.updated',
					},
					// Subscription Events
					{
						name: 'Subscription - Activated',
						value: 'subscription.activated',
					},
					{
						name: 'Subscription - Canceled',
						value: 'subscription.canceled',
					},
					{
						name: 'Subscription - Created',
						value: 'subscription.created',
					},
					{
						name: 'Subscription - Expired',
						value: 'subscription.expired',
					},
					{
						name: 'Subscription - Modified',
						value: 'subscription.modified',
					},
					{
						name: 'Subscription - Paused',
						value: 'subscription.paused',
					},
					{
						name: 'Subscription - Reactivated',
						value: 'subscription.reactivated',
					},
					{
						name: 'Subscription - Renewed',
						value: 'subscription.renewed',
					},
					{
						name: 'Subscription - Resumed',
						value: 'subscription.resumed',
					},
					// Invoice Events
					{
						name: 'Invoice - Closed',
						value: 'invoice.closed',
					},
					{
						name: 'Invoice - Created',
						value: 'invoice.created',
					},
					{
						name: 'Invoice - Failed',
						value: 'invoice.failed',
					},
					{
						name: 'Invoice - Paid',
						value: 'invoice.paid',
					},
					{
						name: 'Invoice - Past Due',
						value: 'invoice.past_due',
					},
					{
						name: 'Invoice - Reopened',
						value: 'invoice.reopened',
					},
					{
						name: 'Invoice - Voided',
						value: 'invoice.voided',
					},
					// Payment Events
					{
						name: 'Payment - Declined',
						value: 'payment.declined',
					},
					{
						name: 'Payment - Failed',
						value: 'payment.failed',
					},
					{
						name: 'Payment - Fraud Info Updated',
						value: 'payment.fraud_info_updated',
					},
					{
						name: 'Payment - Refunded',
						value: 'payment.refunded',
					},
					{
						name: 'Payment - Succeeded',
						value: 'payment.succeeded',
					},
					// Dunning Events
					{
						name: 'Dunning - Cycle Completed',
						value: 'dunning_cycle.completed',
					},
					{
						name: 'Dunning - Cycle Started',
						value: 'dunning_cycle.started',
					},
					// Credit Payment Events
					{
						name: 'Credit Payment - Created',
						value: 'credit_payment.created',
					},
					{
						name: 'Credit Payment - Voided',
						value: 'credit_payment.voided',
					},
					// Gift Card Events
					{
						name: 'Gift Card - Created',
						value: 'gift_card.created',
					},
					{
						name: 'Gift Card - Redeemed',
						value: 'gift_card.redeemed',
					},
					{
						name: 'Gift Card - Updated',
						value: 'gift_card.updated',
					},
					// Item Events
					{
						name: 'Item - Created',
						value: 'item.created',
					},
					{
						name: 'Item - Deactivated',
						value: 'item.deactivated',
					},
					{
						name: 'Item - Reactivated',
						value: 'item.reactivated',
					},
					{
						name: 'Item - Updated',
						value: 'item.updated',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Verify Subdomain',
						name: 'verifySubdomain',
						type: 'boolean',
						default: true,
						description: 'Whether to verify that the webhook subdomain matches your Recurly account subdomain',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Emit licensing notice
				emitLicensingNotice(this);
				// Recurly webhooks are configured in the Recurly dashboard, not via API
				// We return true to allow the webhook to be created in n8n
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// Emit licensing notice
				emitLicensingNotice(this);
				// Recurly webhooks must be configured manually in the Recurly dashboard
				// Point the webhook URL to the n8n webhook URL
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Recurly webhooks must be removed manually from the Recurly dashboard
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// Emit licensing notice
		emitLicensingNotice(this);

		const req = this.getRequestObject();
		const events = this.getNodeParameter('events') as string[];
		const options = this.getNodeParameter('options') as IDataObject;

		// Get the raw body (XML format)
		const rawBody = req.rawBody?.toString() || req.body?.toString() || '';

		if (!rawBody) {
			return {
				workflowData: [],
			};
		}

		try {
			// Parse XML to JSON
			const parsedData = await parseStringPromise(rawBody, {
				explicitArray: false,
				ignoreAttrs: false,
				mergeAttrs: true,
			});

			// Extract the notification type from the root element
			const notificationType = Object.keys(parsedData)[0];
			const notificationData = parsedData[notificationType];

			// Convert notification type to event format (e.g., 'new_subscription_notification' -> 'subscription.created')
			const eventType = convertNotificationToEventType(notificationType);

			// Check if this event type is being listened for
			if (!events.includes(eventType) && events.length > 0) {
				return {
					workflowData: [],
				};
			}

			// Optionally verify subdomain
			if (options.verifySubdomain) {
				const credentials = await this.getCredentials('recurlyApi');
				const expectedSubdomain = credentials.subdomain as string;

				// Check if subdomain is in the notification data
				const subdomain = notificationData?.site?.subdomain || notificationData?.account?.site?.subdomain;
				if (subdomain && subdomain !== expectedSubdomain) {
					console.warn(`Recurly webhook subdomain mismatch: expected ${expectedSubdomain}, got ${subdomain}`);
					return {
						workflowData: [],
					};
				}
			}

			// Flatten and structure the response
			const responseData: IDataObject = {
				event: eventType,
				notification_type: notificationType,
				timestamp: new Date().toISOString(),
				data: flattenObject(notificationData),
				raw: notificationData,
			};

			return {
				workflowData: [
					this.helpers.returnJsonArray([responseData]),
				],
			};
		} catch (error) {
			console.error('Error parsing Recurly webhook:', error);

			// Return raw data if parsing fails
			return {
				workflowData: [
					this.helpers.returnJsonArray([
						{
							event: 'unknown',
							raw_body: rawBody,
							error: (error as Error).message,
						},
					]),
				],
			};
		}
	}
}

/**
 * Convert Recurly notification type to event format
 * e.g., 'new_subscription_notification' -> 'subscription.created'
 */
function convertNotificationToEventType(notificationType: string): string {
	const mappings: { [key: string]: string } = {
		// Account notifications
		new_account_notification: 'account.created',
		updated_account_notification: 'account.updated',
		canceled_account_notification: 'account.closed',
		billing_info_updated_notification: 'billing_info.updated',
		billing_info_update_failed_notification: 'billing_info.fraud_updated',

		// Subscription notifications
		new_subscription_notification: 'subscription.created',
		activated_subscription_notification: 'subscription.activated',
		updated_subscription_notification: 'subscription.modified',
		renewed_subscription_notification: 'subscription.renewed',
		canceled_subscription_notification: 'subscription.canceled',
		expired_subscription_notification: 'subscription.expired',
		reactivated_account_notification: 'subscription.reactivated',
		paused_subscription_notification: 'subscription.paused',
		resumed_subscription_notification: 'subscription.resumed',

		// Invoice notifications
		new_invoice_notification: 'invoice.created',
		closed_invoice_notification: 'invoice.closed',
		past_due_invoice_notification: 'invoice.past_due',
		processing_invoice_notification: 'invoice.created',
		paid_charge_invoice_notification: 'invoice.paid',
		failed_charge_invoice_notification: 'invoice.failed',
		voided_invoice_notification: 'invoice.voided',
		reopened_invoice_notification: 'invoice.reopened',

		// Payment notifications
		successful_payment_notification: 'payment.succeeded',
		failed_payment_notification: 'payment.failed',
		declined_payment_notification: 'payment.declined',
		successful_refund_notification: 'payment.refunded',
		void_payment_notification: 'payment.failed',
		fraud_info_updated_notification: 'payment.fraud_info_updated',

		// Dunning notifications
		new_dunning_event_notification: 'dunning_cycle.started',
		dunning_cycle_complete_notification: 'dunning_cycle.completed',

		// Credit payment notifications
		new_credit_payment_notification: 'credit_payment.created',
		voided_credit_payment_notification: 'credit_payment.voided',

		// Gift card notifications
		gift_card_created_notification: 'gift_card.created',
		gift_card_redeemed_notification: 'gift_card.redeemed',
		gift_card_updated_notification: 'gift_card.updated',

		// Item notifications
		new_item_notification: 'item.created',
		updated_item_notification: 'item.updated',
		deactivated_item_notification: 'item.deactivated',
		reactivated_item_notification: 'item.reactivated',
	};

	return mappings[notificationType] || notificationType;
}

/**
 * Flatten nested object for easier access
 */
function flattenObject(obj: IDataObject, prefix = ''): IDataObject {
	const result: IDataObject = {};

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value = obj[key];
			const newKey = prefix ? `${prefix}_${key}` : key;

			if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
				Object.assign(result, flattenObject(value as IDataObject, newKey));
			} else {
				result[newKey] = value;
			}
		}
	}

	return result;
}
