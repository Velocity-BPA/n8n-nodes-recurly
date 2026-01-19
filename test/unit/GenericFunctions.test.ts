/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	toRecurlyDate,
	removeEmptyFields,
	buildFilterParams,
	handleRecurlyError,
} from '../../nodes/Recurly/GenericFunctions';
import type { IDataObject, JsonObject } from 'n8n-workflow';

describe('GenericFunctions', () => {
	describe('toRecurlyDate', () => {
		it('should convert a date string to ISO format', () => {
			const dateString = '2024-01-15';
			const result = toRecurlyDate(dateString);
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
		});

		it('should return empty string for empty input', () => {
			const result = toRecurlyDate('');
			expect(result).toBe('');
		});

		it('should handle datetime strings', () => {
			const dateString = '2024-01-15T10:30:00Z';
			const result = toRecurlyDate(dateString);
			expect(result).toBe('2024-01-15T10:30:00.000Z');
		});
	});

	describe('removeEmptyFields', () => {
		it('should remove null values', () => {
			const obj: IDataObject = { a: 'value', b: null, c: 'another' };
			const result = removeEmptyFields(obj);
			expect(result).toEqual({ a: 'value', c: 'another' });
		});

		it('should remove undefined values', () => {
			const obj: IDataObject = { a: 'value', b: undefined, c: 'another' };
			const result = removeEmptyFields(obj);
			expect(result).toEqual({ a: 'value', c: 'another' });
		});

		it('should remove empty strings', () => {
			const obj: IDataObject = { a: 'value', b: '', c: 'another' };
			const result = removeEmptyFields(obj);
			expect(result).toEqual({ a: 'value', c: 'another' });
		});

		it('should handle nested objects', () => {
			const obj: IDataObject = {
				a: 'value',
				nested: {
					b: 'inner',
					c: null,
					d: '',
				},
			};
			const result = removeEmptyFields(obj);
			expect(result).toEqual({
				a: 'value',
				nested: { b: 'inner' },
			});
		});

		it('should remove empty nested objects', () => {
			const obj: IDataObject = {
				a: 'value',
				nested: {
					b: null,
					c: '',
				},
			};
			const result = removeEmptyFields(obj);
			expect(result).toEqual({ a: 'value' });
		});

		it('should keep arrays', () => {
			const obj: IDataObject = { a: 'value', b: [1, 2, 3] };
			const result = removeEmptyFields(obj);
			expect(result).toEqual({ a: 'value', b: [1, 2, 3] });
		});

		it('should keep zero values', () => {
			const obj: IDataObject = { a: 0, b: false };
			const result = removeEmptyFields(obj);
			expect(result).toEqual({ a: 0, b: false });
		});
	});

	describe('buildFilterParams', () => {
		it('should handle state filter', () => {
			const filters: IDataObject = { state: 'active' };
			const additionalFields: IDataObject = {};
			const result = buildFilterParams(filters, additionalFields);
			expect(result).toEqual({ state: 'active' });
		});

		it('should handle email filter', () => {
			const filters: IDataObject = { email: 'test@example.com' };
			const additionalFields: IDataObject = {};
			const result = buildFilterParams(filters, additionalFields);
			expect(result).toEqual({ email: 'test@example.com' });
		});

		it('should handle date filters', () => {
			const filters: IDataObject = {
				beginTime: '2024-01-01',
				endTime: '2024-12-31',
			};
			const additionalFields: IDataObject = {};
			const result = buildFilterParams(filters, additionalFields);
			expect(result.begin_time).toMatch(/^\d{4}-\d{2}-\d{2}T/);
			expect(result.end_time).toMatch(/^\d{4}-\d{2}-\d{2}T/);
		});

		it('should handle sorting options', () => {
			const filters: IDataObject = {};
			const additionalFields: IDataObject = {
				sort: 'created_at',
				order: 'desc',
			};
			const result = buildFilterParams(filters, additionalFields);
			expect(result).toEqual({ sort: 'created_at', order: 'desc' });
		});

		it('should handle limit', () => {
			const filters: IDataObject = {};
			const additionalFields: IDataObject = { limit: 50 };
			const result = buildFilterParams(filters, additionalFields);
			expect(result).toEqual({ limit: 50 });
		});

		it('should combine multiple filters', () => {
			const filters: IDataObject = { state: 'active', email: 'test@example.com' };
			const additionalFields: IDataObject = { sort: 'created_at', limit: 100 };
			const result = buildFilterParams(filters, additionalFields);
			expect(result).toEqual({
				state: 'active',
				email: 'test@example.com',
				sort: 'created_at',
				limit: 100,
			});
		});
	});

	describe('handleRecurlyError', () => {
		it('should format validation errors', () => {
			const error: JsonObject = {
				error: {
					type: 'validation',
					message: 'Email is invalid',
					params: [{ param: 'email', message: 'is invalid' }],
				},
			};
			const result = handleRecurlyError(error);
			expect(result).toBe('validation: Email is invalid (email: is invalid)');
		});

		it('should handle errors without params', () => {
			const error: JsonObject = {
				error: {
					type: 'not_found',
					message: 'Account not found',
				},
			};
			const result = handleRecurlyError(error);
			expect(result).toBe('not_found: Account not found');
		});

		it('should handle unknown errors', () => {
			const error: JsonObject = {};
			const result = handleRecurlyError(error);
			expect(result).toBe('Unknown Recurly API error');
		});

		it('should handle multiple validation params', () => {
			const error: JsonObject = {
				error: {
					type: 'validation',
					message: 'Multiple fields invalid',
					params: [
						{ param: 'email', message: 'is invalid' },
						{ param: 'code', message: 'is required' },
					],
				},
			};
			const result = handleRecurlyError(error);
			expect(result).toBe('validation: Multiple fields invalid (email: is invalid, code: is required)');
		});
	});
});
