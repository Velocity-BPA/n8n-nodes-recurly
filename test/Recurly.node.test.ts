/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Recurly } from '../nodes/Recurly/Recurly.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Recurly Node', () => {
  let node: Recurly;

  beforeAll(() => {
    node = new Recurly();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Recurly');
      expect(node.description.name).toBe('recurly');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://v3.recurly.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('listAccounts operation', () => {
    it('should list accounts successfully', async () => {
      const mockResponse = { data: [{ id: '123', email: 'test@example.com' }] };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'listAccounts';
        if (param === 'limit') return 20;
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v3.recurly.com/accounts',
        headers: expect.objectContaining({
          'Accept': 'application/vnd.recurly.v3'
        }),
        qs: { limit: 20 },
        json: true
      });
    });

    it('should handle errors when listing accounts', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('listAccounts');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('createAccount operation', () => {
    it('should create account successfully', async () => {
      const mockResponse = { id: '123', code: 'test-code', email: 'test@example.com' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'createAccount';
        if (param === 'code') return 'test-code';
        if (param === 'email') return 'test@example.com';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://v3.recurly.com/accounts',
        headers: expect.objectContaining({
          'Accept': 'application/vnd.recurly.v3'
        }),
        body: { code: 'test-code', email: 'test@example.com' },
        json: true
      });
    });
  });

  describe('getAccount operation', () => {
    it('should get account successfully', async () => {
      const mockResponse = { id: '123', email: 'test@example.com' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getAccount';
        if (param === 'account_id') return '123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v3.recurly.com/accounts/123',
        headers: expect.objectContaining({
          'Accept': 'application/vnd.recurly.v3'
        }),
        json: true
      });
    });
  });

  describe('updateAccount operation', () => {
    it('should update account successfully', async () => {
      const mockResponse = { id: '123', email: 'updated@example.com' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'updateAccount';
        if (param === 'account_id') return '123';
        if (param === 'email') return 'updated@example.com';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://v3.recurly.com/accounts/123',
        headers: expect.objectContaining({
          'Accept': 'application/vnd.recurly.v3'
        }),
        body: { email: 'updated@example.com' },
        json: true
      });
    });
  });

  describe('deleteAccount operation', () => {
    it('should delete account successfully', async () => {
      const mockResponse = { id: '123', state: 'closed' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'deleteAccount';
        if (param === 'account_id') return '123';
        return '';
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://v3.recurly.com/accounts/123',
        headers: expect.objectContaining({
          'Accept': 'application/vnd.recurly.v3'
        }),
        json: true
      });
    });
  });
});

describe('Subscription Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://v3.recurly.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  test('should list subscriptions successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'listSubscriptions';
        case 'limit': return 20;
        case 'cursor': return '';
        case 'ids': return '';
        case 'state': return 'active';
        case 'planId': return '';
        case 'accountId': return '';
        default: return undefined;
      }
    });

    const mockResponse = { data: [{ id: 'sub_1', state: 'active' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubscriptionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://v3.recurly.com/subscriptions?limit=20&state=active',
      headers: {
        'Authorization': expect.stringContaining('Basic'),
        'Accept': 'application/vnd.recurly.v3',
        'Content-Type': 'application/json'
      },
      json: true
    });
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should create subscription successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createSubscription';
        case 'planCode': return 'basic-plan';
        case 'account': return { accountDetails: { code: 'acc_123' } };
        case 'currency': return 'USD';
        case 'unitAmount': return 1000;
        default: return undefined;
      }
    });

    const mockResponse = { id: 'sub_123', state: 'active' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubscriptionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://v3.recurly.com/subscriptions',
      headers: {
        'Authorization': expect.stringContaining('Basic'),
        'Accept': 'application/vnd.recurly.v3',
        'Content-Type': 'application/json'
      },
      json: true,
      body: {
        plan_code: 'basic-plan',
        currency: 'USD',
        account: { code: 'acc_123' },
        unit_amount: 1000
      }
    });
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should handle errors gracefully with continueOnFail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('listSubscriptions');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeSubscriptionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json.error).toBe('API Error');
    expect(result[0].pairedItem).toEqual({ item: 0 });
  });

  test('should get subscription successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getSubscription';
        case 'subscriptionId': return 'sub_123';
        default: return undefined;
      }
    });

    const mockResponse = { id: 'sub_123', state: 'active' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubscriptionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://v3.recurly.com/subscriptions/sub_123',
      headers: {
        'Authorization': expect.stringContaining('Basic'),
        'Accept': 'application/vnd.recurly.v3',
        'Content-Type': 'application/json'
      },
      json: true
    });
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should cancel subscription successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'cancelSubscription';
        case 'subscriptionId': return 'sub_123';
        default: return undefined;
      }
    });

    const mockResponse = { id: 'sub_123', state: 'canceled' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubscriptionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://v3.recurly.com/subscriptions/sub_123',
      headers: {
        'Authorization': expect.stringContaining('Basic'),
        'Accept': 'application/vnd.recurly.v3',
        'Content-Type': 'application/json'
      },
      json: true
    });
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should pause subscription successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'pauseSubscription';
        case 'subscriptionId': return 'sub_123';
        case 'remainingPauseCycles': return 2;
        default: return undefined;
      }
    });

    const mockResponse = { id: 'sub_123', state: 'paused' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSubscriptionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://v3.recurly.com/subscriptions/sub_123/pause',
      headers: {
        'Authorization': expect.stringContaining('Basic'),
        'Accept': 'application/vnd.recurly.v3',
        'Content-Type': 'application/json'
      },
      json: true,
      body: { remaining_pause_cycles: 2 }
    });
    expect(result[0].json).toEqual(mockResponse);
  });
});

describe('Invoice Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://v3.recurly.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should list invoices successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('listInvoices')
			.mockReturnValueOnce(20)
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ data: [{ id: 'inv_123' }] });

		const result = await executeInvoiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ data: [{ id: 'inv_123' }] });
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://v3.recurly.com/invoices?limit=20',
			headers: {
				'Authorization': expect.stringContaining('Basic'),
				'Accept': 'application/vnd.recurly.v3',
			},
			json: true,
		});
	});

	it('should create invoice successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createInvoice')
			.mockReturnValueOnce('acc_123')
			.mockReturnValueOnce('USD')
			.mockReturnValueOnce('automatic');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'inv_123', account_id: 'acc_123' });

		const result = await executeInvoiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ id: 'inv_123', account_id: 'acc_123' });
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'POST',
			url: 'https://v3.recurly.com/invoices',
			headers: {
				'Authorization': expect.stringContaining('Basic'),
				'Accept': 'application/vnd.recurly.v3',
				'Content-Type': 'application/json',
			},
			body: {
				account_id: 'acc_123',
				currency: 'USD',
				collection_method: 'automatic',
			},
			json: true,
		});
	});

	it('should get invoice successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getInvoice')
			.mockReturnValueOnce('inv_123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'inv_123', state: 'paid' });

		const result = await executeInvoiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ id: 'inv_123', state: 'paid' });
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://v3.recurly.com/invoices/inv_123',
			headers: {
				'Authorization': expect.stringContaining('Basic'),
				'Accept': 'application/vnd.recurly.v3',
			},
			json: true,
		});
	});

	it('should handle errors correctly', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getInvoice');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeInvoiceOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ error: 'API Error' });
	});
});

describe('Plan Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://v3.recurly.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should list plans successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listPlans')
      .mockReturnValueOnce(20)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    const mockResponse = { data: [{ id: 'plan_123', code: 'basic' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePlanOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://v3.recurly.com/plans',
      headers: {
        'Authorization': expect.stringContaining('Basic'),
        'Accept': 'application/vnd.recurly.v3',
      },
      json: true,
    });
  });

  it('should create plan successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createPlan')
      .mockReturnValueOnce('basic-plan')
      .mockReturnValueOnce('Basic Plan')
      .mockReturnValueOnce([{ currency: 'USD', setup_fee: 0, unit_amount: 999 }])
      .mockReturnValueOnce({ interval_unit: 'months', interval_length: 1 });

    const mockResponse = { id: 'plan_123', code: 'basic-plan' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePlanOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://v3.recurly.com/plans',
      headers: {
        'Authorization': expect.stringContaining('Basic'),
        'Accept': 'application/vnd.recurly.v3',
        'Content-Type': 'application/json',
      },
      body: {
        code: 'basic-plan',
        name: 'Basic Plan',
        currencies: [{ currency: 'USD', setup_fee: 0, unit_amount: 999 }],
        recurring: { interval_unit: 'months', interval_length: 1 },
      },
      json: true,
    });
  });

  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPlan').mockReturnValueOnce('invalid');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Plan not found'));

    const result = await executePlanOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'Plan not found' }, pairedItem: { item: 0 } }]);
  });
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://v3.recurly.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('listTransactions', () => {
    it('should list transactions successfully', async () => {
      const mockResponse = { 
        data: [{ id: 'txn_123', amount_in_cents: 1000, currency: 'USD' }],
        has_more: false 
      };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listTransactions')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://v3.recurly.com/transactions?limit=20',
          headers: expect.objectContaining({
            'Accept': 'application/vnd.recurly.v3'
          })
        })
      );
    });

    it('should handle list transactions error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('listTransactions');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('createTransaction', () => {
    it('should create transaction successfully', async () => {
      const mockResponse = { id: 'txn_new123', status: 'success', amount_in_cents: 1500 };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createTransaction')
        .mockReturnValueOnce('acc_123')
        .mockReturnValueOnce('USD')
        .mockReturnValueOnce(15.00)
        .mockReturnValueOnce('pm_123')
        .mockReturnValueOnce(false);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://v3.recurly.com/transactions',
          body: {
            account: { id: 'acc_123' },
            currency: 'USD',
            amount_in_cents: 1500,
            payment_method: 'pm_123'
          }
        })
      );
    });
  });

  describe('getTransaction', () => {
    it('should get transaction successfully', async () => {
      const mockResponse = { id: 'txn_123', status: 'success', amount_in_cents: 1000 };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransaction')
        .mockReturnValueOnce('txn_123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://v3.recurly.com/transactions/txn_123'
        })
      );
    });
  });

  describe('refundTransaction', () => {
    it('should refund transaction successfully', async () => {
      const mockResponse = { id: 'txn_refund123', status: 'success', refunded_amount: 500 };
      
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('refundTransaction')
        .mockReturnValueOnce('txn_123')
        .mockReturnValueOnce(500);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: 'https://v3.recurly.com/transactions/txn_123',
          body: { amount_in_cents: 500 }
        })
      );
    });
  });
});

describe('Coupon Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://v3.recurly.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			},
		};
	});

	it('should list coupons successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('listCoupons')
			.mockReturnValueOnce(20)
			.mockReturnValueOnce('')
			.mockReturnValueOnce('')
			.mockReturnValueOnce('');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			data: [{ id: 'coupon1', code: 'TEST10' }]
		});

		const result = await executeCouponOperations.call(mockExecuteFunctions, [{ json: {} }]);
		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({ method: 'GET' })
		);
	});

	it('should create coupon successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('createCoupon')
			.mockReturnValueOnce('TEST10')
			.mockReturnValueOnce('Test Coupon')
			.mockReturnValueOnce('percent')
			.mockReturnValueOnce(10)
			.mockReturnValueOnce(0);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'new-coupon',
			code: 'TEST10'
		});

		const result = await executeCouponOperations.call(mockExecuteFunctions, [{ json: {} }]);
		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({ method: 'POST' })
		);
	});

	it('should get coupon successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getCoupon')
			.mockReturnValueOnce('coupon123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'coupon123',
			code: 'TEST10'
		});

		const result = await executeCouponOperations.call(mockExecuteFunctions, [{ json: {} }]);
		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'GET',
				url: expect.stringContaining('/coupons/coupon123')
			})
		);
	});

	it('should update coupon successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('updateCoupon')
			.mockReturnValueOnce('coupon123')
			.mockReturnValueOnce('Updated Name')
			.mockReturnValueOnce(100);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'coupon123',
			name: 'Updated Name'
		});

		const result = await executeCouponOperations.call(mockExecuteFunctions, [{ json: {} }]);
		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({ method: 'PUT' })
		);
	});

	it('should delete coupon successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('deleteCoupon')
			.mockReturnValueOnce('coupon123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'coupon123',
			state: 'inactive'
		});

		const result = await executeCouponOperations.call(mockExecuteFunctions, [{ json: {} }]);
		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({ method: 'DELETE' })
		);
	});

	it('should restore coupon successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('restoreCoupon')
			.mockReturnValueOnce('coupon123');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			id: 'coupon123',
			state: 'active'
		});

		const result = await executeCouponOperations.call(mockExecuteFunctions, [{ json: {} }]);
		expect(result).toHaveLength(1);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'POST',
				url: expect.stringContaining('/restore')
			})
		);
	});

	it('should handle API errors', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCoupon');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeCouponOperations.call(mockExecuteFunctions, [{ json: {} }]))
			.rejects.toThrow('API Error');
	});

	it('should continue on fail when configured', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCoupon');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeCouponOperations.call(mockExecuteFunctions, [{ json: {} }]);
		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});
});

describe('Webhook Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://v3.recurly.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('listWebhooks operation', () => {
    it('should list webhooks successfully', async () => {
      const mockResponse = { data: [{ id: 'webhook123', url: 'https://example.com/webhook' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listWebhooks')
        .mockReturnValueOnce(20)
        .mockReturnValueOnce('');

      const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v3.recurly.com/webhooks?limit=20',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
          'Accept': 'application/vnd.recurly.v3',
        },
        json: true,
      });
    });

    it('should handle errors when listing webhooks', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('listWebhooks');

      await expect(executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('API Error');
    });
  });

  describe('createWebhook operation', () => {
    it('should create webhook successfully', async () => {
      const mockResponse = { id: 'webhook123', url: 'https://example.com/webhook' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createWebhook')
        .mockReturnValueOnce('https://example.com/webhook')
        .mockReturnValueOnce(['account_created']);

      const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://v3.recurly.com/webhooks',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
          'Accept': 'application/vnd.recurly.v3',
          'Content-Type': 'application/json',
        },
        body: {
          url: 'https://example.com/webhook',
          event_types: ['account_created'],
        },
        json: true,
      });
    });
  });

  describe('getWebhook operation', () => {
    it('should get webhook successfully', async () => {
      const mockResponse = { id: 'webhook123', url: 'https://example.com/webhook' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getWebhook')
        .mockReturnValueOnce('webhook123');

      const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('updateWebhook operation', () => {
    it('should update webhook successfully', async () => {
      const mockResponse = { id: 'webhook123', url: 'https://updated.com/webhook' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateWebhook')
        .mockReturnValueOnce('webhook123')
        .mockReturnValueOnce('https://updated.com/webhook')
        .mockReturnValueOnce(['account_updated']);

      const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('deleteWebhook operation', () => {
    it('should delete webhook successfully', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({});
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteWebhook')
        .mockReturnValueOnce('webhook123');

      const result = await executeWebhookOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: {}, pairedItem: { item: 0 } }]);
    });
  });
});
});
