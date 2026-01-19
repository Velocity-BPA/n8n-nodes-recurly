/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { RecurlyApi } from '../../credentials/RecurlyApi.credentials';

describe('RecurlyApi Credentials', () => {
	let credentials: RecurlyApi;

	beforeEach(() => {
		credentials = new RecurlyApi();
	});

	describe('Credential Properties', () => {
		it('should have correct name', () => {
			expect(credentials.name).toBe('recurlyApi');
		});

		it('should have correct display name', () => {
			expect(credentials.displayName).toBe('Recurly API');
		});

		it('should have documentation url', () => {
			expect(credentials.documentationUrl).toBeDefined();
		});
	});

	describe('Properties', () => {
		it('should have apiKey property', () => {
			const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
			expect(apiKeyProp).toBeDefined();
			expect(apiKeyProp?.type).toBe('string');
			expect(apiKeyProp?.typeOptions?.password).toBe(true);
		});

		it('should have subdomain property', () => {
			const subdomainProp = credentials.properties.find((p) => p.name === 'subdomain');
			expect(subdomainProp).toBeDefined();
			expect(subdomainProp?.type).toBe('string');
		});

		it('should have required apiKey', () => {
			const apiKeyProp = credentials.properties.find((p) => p.name === 'apiKey');
			expect(apiKeyProp?.required).toBe(true);
		});

		it('should have required subdomain', () => {
			const subdomainProp = credentials.properties.find((p) => p.name === 'subdomain');
			expect(subdomainProp?.required).toBe(true);
		});
	});

	describe('Authentication', () => {
		it('should have authenticate property', () => {
			expect(credentials.authenticate).toBeDefined();
		});

		it('should have test property', () => {
			expect(credentials.test).toBeDefined();
		});
	});
});
