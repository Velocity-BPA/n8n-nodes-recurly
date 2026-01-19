/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const RECURLY_API_BASE_URL = 'https://v3.recurly.com';
const RECURLY_API_VERSION = 'application/vnd.recurly.v2021-02-25+json';

/**
 * Make an authenticated request to the Recurly API
 */
export async function recurlyApiRequest(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('recurlyApi');

	const apiKey = credentials.apiKey as string;
	const authString = Buffer.from(`${apiKey}:`).toString('base64');

	const options: IRequestOptions = {
		method,
		uri: `${RECURLY_API_BASE_URL}${endpoint}`,
		headers: {
			Authorization: `Basic ${authString}`,
			Accept: RECURLY_API_VERSION,
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	if (query && Object.keys(query).length > 0) {
		options.qs = query;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Make an authenticated request and return all items (handles pagination)
 */
export async function recurlyApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let hasMore = true;

	query = query || {};
	query.limit = 200;

	let currentEndpoint = endpoint;

	while (hasMore) {
		const response = await recurlyApiRequest.call(this, method, currentEndpoint, body, query);

		if (response.data && Array.isArray(response.data)) {
			returnData.push(...(response.data as IDataObject[]));
		}

		if (response.has_more && response.next) {
			const nextUrl = response.next as string;
			currentEndpoint = nextUrl.replace(RECURLY_API_BASE_URL, '');
			query = {}; // Clear query params as they're included in the next URL
		} else {
			hasMore = false;
		}
	}

	return returnData;
}

/**
 * Handle Recurly-specific errors with better error messages
 */
export function handleRecurlyError(error: JsonObject): string {
	if (error.error) {
		const recurlyError = error.error as IDataObject;
		const type = recurlyError.type as string;
		const message = recurlyError.message as string;
		const params = recurlyError.params as IDataObject[];

		let errorMessage = `${type}: ${message}`;

		if (params && params.length > 0) {
			const paramMessages = params
				.map((p) => `${p.param}: ${p.message}`)
				.join(', ');
			errorMessage += ` (${paramMessages})`;
		}

		return errorMessage;
	}

	return 'Unknown Recurly API error';
}

/**
 * Convert n8n date string to ISO format for Recurly API
 */
export function toRecurlyDate(date: string): string {
	if (!date) {
		return '';
	}
	const d = new Date(date);
	return d.toISOString();
}

/**
 * Build filter parameters for list operations
 */
export function buildFilterParams(
	filters: IDataObject,
	additionalFields: IDataObject,
): IDataObject {
	const query: IDataObject = {};

	// Handle common filters
	if (filters.state) {
		query.state = filters.state;
	}
	if (filters.email) {
		query.email = filters.email;
	}
	if (filters.beginTime) {
		query.begin_time = toRecurlyDate(filters.beginTime as string);
	}
	if (filters.endTime) {
		query.end_time = toRecurlyDate(filters.endTime as string);
	}

	// Handle sorting
	if (additionalFields.sort) {
		query.sort = additionalFields.sort;
	}
	if (additionalFields.order) {
		query.order = additionalFields.order;
	}

	// Handle limit
	if (additionalFields.limit) {
		query.limit = additionalFields.limit;
	}

	return query;
}

/**
 * Clean empty values from object
 */
export function removeEmptyFields(obj: IDataObject): IDataObject {
	const cleanObj: IDataObject = {};

	for (const key of Object.keys(obj)) {
		const value = obj[key];
		if (value !== undefined && value !== null && value !== '') {
			if (typeof value === 'object' && !Array.isArray(value)) {
				const cleanNested = removeEmptyFields(value as IDataObject);
				if (Object.keys(cleanNested).length > 0) {
					cleanObj[key] = cleanNested;
				}
			} else {
				cleanObj[key] = value;
			}
		}
	}

	return cleanObj;
}

/**
 * Emit licensing notice (once per session)
 */
let licensingNoticeEmitted = false;

export function emitLicensingNotice(
	context: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
): void {
	if (!licensingNoticeEmitted) {
		const logger = context.getNode();
		console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

Node: ${logger.name}`);
		licensingNoticeEmitted = true;
	}
}
