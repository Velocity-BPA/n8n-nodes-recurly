/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Recurly } from '../../nodes/Recurly/Recurly.node';

describe('Recurly Node', () => {
	let node: Recurly;

	beforeEach(() => {
		node = new Recurly();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(node.description.displayName).toBe('Recurly');
		});

		it('should have correct name', () => {
			expect(node.description.name).toBe('recurly');
		});

		it('should have correct group', () => {
			expect(node.description.group).toContain('transform');
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

		it('should have one input', () => {
			expect(node.description.inputs).toEqual(['main']);
		});

		it('should have one output', () => {
			expect(node.description.outputs).toEqual(['main']);
		});
	});

	describe('Resources', () => {
		it('should have 12 resources', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty?.options).toHaveLength(12);
		});

		it('should include account resource', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			const accountOption = (resourceProperty?.options as any[])?.find(
				(o) => o.value === 'account'
			);
			expect(accountOption).toBeDefined();
			expect(accountOption?.name).toBe('Account');
		});

		it('should include subscription resource', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			const subscriptionOption = (resourceProperty?.options as any[])?.find(
				(o) => o.value === 'subscription'
			);
			expect(subscriptionOption).toBeDefined();
			expect(subscriptionOption?.name).toBe('Subscription');
		});

		it('should include plan resource', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			const planOption = (resourceProperty?.options as any[])?.find(
				(o) => o.value === 'plan'
			);
			expect(planOption).toBeDefined();
			expect(planOption?.name).toBe('Plan');
		});

		it('should include invoice resource', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			const invoiceOption = (resourceProperty?.options as any[])?.find(
				(o) => o.value === 'invoice'
			);
			expect(invoiceOption).toBeDefined();
			expect(invoiceOption?.name).toBe('Invoice');
		});

		it('should include transaction resource', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			const transactionOption = (resourceProperty?.options as any[])?.find(
				(o) => o.value === 'transaction'
			);
			expect(transactionOption).toBeDefined();
			expect(transactionOption?.name).toBe('Transaction');
		});

		it('should include coupon resource', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			const couponOption = (resourceProperty?.options as any[])?.find(
				(o) => o.value === 'coupon'
			);
			expect(couponOption).toBeDefined();
			expect(couponOption?.name).toBe('Coupon');
		});

		it('should include usage resource', () => {
			const resourceProperty = node.description.properties.find(
				(p) => p.name === 'resource'
			);
			const usageOption = (resourceProperty?.options as any[])?.find(
				(o) => o.value === 'usage'
			);
			expect(usageOption).toBeDefined();
			expect(usageOption?.name).toBe('Usage');
		});
	});

	describe('Account Operations', () => {
		it('should have account operations defined', () => {
			const operationProperty = node.description.properties.find(
				(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('account')
			);
			expect(operationProperty).toBeDefined();
		});
	});

	describe('Subscription Operations', () => {
		it('should have subscription operations defined', () => {
			const operationProperty = node.description.properties.find(
				(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes('subscription')
			);
			expect(operationProperty).toBeDefined();
		});
	});
});
