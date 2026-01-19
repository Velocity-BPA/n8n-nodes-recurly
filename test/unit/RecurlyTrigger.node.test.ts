/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { RecurlyTrigger } from '../../nodes/Recurly/RecurlyTrigger.node';

describe('RecurlyTrigger Node', () => {
	let node: RecurlyTrigger;

	beforeEach(() => {
		node = new RecurlyTrigger();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(node.description.displayName).toBe('Recurly Trigger');
		});

		it('should have correct name', () => {
			expect(node.description.name).toBe('recurlyTrigger');
		});

		it('should have correct group', () => {
			expect(node.description.group).toContain('trigger');
		});

		it('should have version 1', () => {
			expect(node.description.version).toBe(1);
		});

		it('should require recurlyApi credentials', () => {
			const credentials = node.description.credentials;
			expect(credentials).toBeDefined();
			expect(credentials?.[0].name).toBe('recurlyApi');
			expect(credentials?.[0].required).toBe(true);
		});

		it('should have no inputs', () => {
			expect(node.description.inputs).toEqual([]);
		});

		it('should have one output', () => {
			expect(node.description.outputs).toEqual(['main']);
		});
	});

	describe('Webhook Configuration', () => {
		it('should have webhook configuration', () => {
			expect(node.description.webhooks).toBeDefined();
			expect(node.description.webhooks?.length).toBe(1);
		});

		it('should use POST method', () => {
			const webhook = node.description.webhooks?.[0];
			expect(webhook?.httpMethod).toBe('POST');
		});

		it('should respond on received', () => {
			const webhook = node.description.webhooks?.[0];
			expect(webhook?.responseMode).toBe('onReceived');
		});

		it('should have webhook path', () => {
			const webhook = node.description.webhooks?.[0];
			expect(webhook?.path).toBe('webhook');
		});
	});

	describe('Events', () => {
		it('should have events property', () => {
			const eventsProperty = node.description.properties.find(
				(p) => p.name === 'events'
			);
			expect(eventsProperty).toBeDefined();
			expect(eventsProperty?.type).toBe('multiOptions');
			expect(eventsProperty?.required).toBe(true);
		});

		it('should include account events', () => {
			const eventsProperty = node.description.properties.find(
				(p) => p.name === 'events'
			);
			const options = eventsProperty?.options as any[];
			const accountCreated = options?.find((o) => o.value === 'account.created');
			expect(accountCreated).toBeDefined();
		});

		it('should include subscription events', () => {
			const eventsProperty = node.description.properties.find(
				(p) => p.name === 'events'
			);
			const options = eventsProperty?.options as any[];
			const subscriptionCreated = options?.find((o) => o.value === 'subscription.created');
			expect(subscriptionCreated).toBeDefined();
		});

		it('should include invoice events', () => {
			const eventsProperty = node.description.properties.find(
				(p) => p.name === 'events'
			);
			const options = eventsProperty?.options as any[];
			const invoicePaid = options?.find((o) => o.value === 'invoice.paid');
			expect(invoicePaid).toBeDefined();
		});

		it('should include payment events', () => {
			const eventsProperty = node.description.properties.find(
				(p) => p.name === 'events'
			);
			const options = eventsProperty?.options as any[];
			const paymentSucceeded = options?.find((o) => o.value === 'payment.succeeded');
			expect(paymentSucceeded).toBeDefined();
		});

		it('should include dunning events', () => {
			const eventsProperty = node.description.properties.find(
				(p) => p.name === 'events'
			);
			const options = eventsProperty?.options as any[];
			const dunningStarted = options?.find((o) => o.value === 'dunning_cycle.started');
			expect(dunningStarted).toBeDefined();
		});
	});

	describe('Options', () => {
		it('should have options property', () => {
			const optionsProperty = node.description.properties.find(
				(p) => p.name === 'options'
			);
			expect(optionsProperty).toBeDefined();
			expect(optionsProperty?.type).toBe('collection');
		});

		it('should have verify subdomain option', () => {
			const optionsProperty = node.description.properties.find(
				(p) => p.name === 'options'
			);
			const options = optionsProperty?.options as any[];
			const verifySubdomain = options?.find((o) => o.name === 'verifySubdomain');
			expect(verifySubdomain).toBeDefined();
			expect(verifySubdomain?.type).toBe('boolean');
			expect(verifySubdomain?.default).toBe(true);
		});
	});

	describe('Webhook Methods', () => {
		it('should have webhook methods defined', () => {
			expect(node.webhookMethods).toBeDefined();
			expect(node.webhookMethods.default).toBeDefined();
		});

		it('should have checkExists method', () => {
			expect(node.webhookMethods.default.checkExists).toBeDefined();
		});

		it('should have create method', () => {
			expect(node.webhookMethods.default.create).toBeDefined();
		});

		it('should have delete method', () => {
			expect(node.webhookMethods.default.delete).toBeDefined();
		});
	});
});
