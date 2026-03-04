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

    it('should define 8 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(8);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(8);
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
describe('Accounts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v3.recurly.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should list accounts successfully', async () => {
    const mockResponse = {
      object: 'list',
      data: [
        {
          object: 'account',
          id: 'account123',
          code: 'test-account',
          email: 'test@example.com',
        },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'listAccounts';
        case 'limit':
          return 20;
        case 'order':
          return 'desc';
        default:
          return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://v3.recurly.com/accounts',
      }),
    );
  });

  test('should create account successfully', async () => {
    const mockResponse = {
      object: 'account',
      id: 'account123',
      code: 'new-account',
      email: 'new@example.com',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'createAccount';
        case 'code':
          return 'new-account';
        case 'email':
          return 'new@example.com';
        default:
          return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://v3.recurly.com/accounts',
        body: expect.objectContaining({
          code: 'new-account',
          email: 'new@example.com',
        }),
      }),
    );
  });

  test('should get account successfully', async () => {
    const mockResponse = {
      object: 'account',
      id: 'account123',
      code: 'test-account',
      email: 'test@example.com',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getAccount';
        case 'account_id':
          return 'account123';
        default:
          return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://v3.recurly.com/accounts/account123',
      }),
    );
  });

  test('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getAccount';
        case 'account_id':
          return 'invalid-id';
        default:
          return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Account not found'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Account not found');
  });

  test('should update account successfully', async () => {
    const mockResponse = {
      object: 'account',
      id: 'account123',
      code: 'test-account',
      email: 'updated@example.com',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'updateAccount';
        case 'account_id':
          return 'account123';
        case 'email':
          return 'updated@example.com';
        default:
          return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        url: 'https://v3.recurly.com/accounts/account123',
      }),
    );
  });

  test('should delete account successfully', async () => {
    const mockResponse = {
      object: 'account',
      id: 'account123',
      deleted: true,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'deleteAccount';
        case 'account_id':
          return 'account123';
        default:
          return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'DELETE',
        url: 'https://v3.recurly.com/accounts/account123',
      }),
    );
  });
});

describe('Subscriptions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v3.recurly.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listSubscriptions', () => {
    it('should list subscriptions successfully', async () => {
      const mockResponse = {
        has_more: false,
        next: null,
        data: [
          {
            id: 'sub_123',
            state: 'active',
            plan: { code: 'basic' },
            quantity: 1,
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'listSubscriptions';
          case 'limit': return 20;
          case 'state': return 'active';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSubscriptionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v3.recurly.com/subscriptions',
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Basic'),
          'Accept': 'application/vnd.recurly.v2021-02-25',
        }),
        qs: { limit: 20, state: 'active' },
        json: true,
      });
    });

    it('should handle listSubscriptions error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'listSubscriptions';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeSubscriptionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('createSubscription', () => {
    it('should create subscription successfully', async () => {
      const mockResponse = {
        id: 'sub_123',
        state: 'active',
        plan: { code: 'basic' },
        quantity: 1,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createSubscription';
          case 'plan_code': return 'basic';
          case 'account': return { code: 'acc_123', email: 'test@example.com' };
          case 'currency': return 'USD';
          case 'quantity': return 1;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSubscriptionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://v3.recurly.com/subscriptions',
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Basic'),
          'Idempotency-Key': expect.any(String),
        }),
        body: {
          plan_code: 'basic',
          account: { code: 'acc_123', email: 'test@example.

describe('Plans Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v3.recurly.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listPlans operation', () => {
    it('should successfully list plans', async () => {
      const mockResponse = {
        object: 'list',
        has_more: false,
        data: [
          {
            object: 'plan',
            id: 'plan_123',
            code: 'monthly',
            name: 'Monthly Plan',
            state: 'active',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        const params: any = {
          operation: 'listPlans',
          limit: 20,
          order: 'desc',
          sort: 'created_at',
          state: 'active',
        };
        return params[paramName] || defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePlansOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v3.recurly.com/plans?limit=20&order=desc&sort=created_at&state=active',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle listPlans errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        return paramName === 'operation' ? 'listPlans' : undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executePlansOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('createPlan operation', () => {
    it('should successfully create a plan', async () => {
      const mockResponse = {
        object: 'plan',
        id: 'plan_123',
        code: 'monthly',
        name: 'Monthly Plan',
        state: 'active',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        const params: any = {
          operation: 'createPlan',
          code: 'monthly',
          name: 'Monthly Plan',
          currency: 'USD',
          unitAmount: 1999,
          planIntervalLength: 1,
          planIntervalUnit: 'months',
        };
        return params[paramName] || defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePlansOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://v3.recurly.com/plans',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
        },
        body: {
          code: 'monthly',
          name: 'Monthly Plan',
          currencies: [{
            currency: 'USD',
            unit_amount: 1999,
          }],
          interval_length: 1,
          interval_unit: 'months',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getPlan operation', () => {
    it('should successfully get a plan', async () => {
      const mockResponse = {
        object: 'plan',
        id: 'plan_123',
        code: 'monthly',
        name: 'Monthly Plan',
        state: 'active',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'getPlan',
          planId: 'plan_123',
        };
        return params[paramName];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePlansOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v3.recurly.com/plans/plan_123',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('updatePlan operation', () => {
    it('should successfully update a plan', async () => {
      const mockResponse = {
        object: 'plan',
        id: 'plan_123',
        code: 'monthly',
        name: 'Updated Monthly Plan',
        state: 'active',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        const params: any = {
          operation: 'updatePlan',
          planId: 'plan_123',
          name: 'Updated Monthly Plan',
        };
        return params[paramName] || defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePlansOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://v3.recurly.com/plans/plan_123',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'Updated Monthly Plan',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('deletePlan operation', () => {
    it('should successfully delete a plan', async () => {
      const mockResponse = {
        object: 'plan',
        id: 'plan_123',
        deleted: true,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'deletePlan',
          planId: 'plan_123',
        };
        return params[paramName];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePlansOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://v3.recurly.com/plans/plan_123',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('error handling', () => {
    it('should handle unknown operation error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        return paramName === 'operation' ? 'unknownOperation' : undefined;
      });

      await expect(
        executePlansOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Unknown operation: unknownOperation');
    });

    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        return paramName === 'operation' ? 'listPlans' : undefined;
      });
      
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executePlansOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Invoices Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v3.recurly.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listInvoices', () => {
    it('should list invoices successfully', async () => {
      const mockResponse = { data: [{ id: 'invoice_1', state: 'paid' }] };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'listInvoices';
          case 'limit': return 20;
          case 'order': return 'desc';
          case 'sort': return 'created_at';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeInvoicesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v3.recurly.com/invoices',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
        },
        qs: { limit: 20, order: 'desc', sort: 'created_at' },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('createInvoice', () => {
    it('should create an invoice successfully', async () => {
      const mockResponse = { id: 'new_invoice', state: 'pending' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createInvoice';
          case 'account_id': return 'acc_123';
          case 'currency': return 'USD';
          case 'collection_method': return 'automatic';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeInvoicesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://v3.recurly.com/invoices',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
        },
        body: {
          account: { id: 'acc_123' },
          currency: 'USD',
          collection_method: 'automatic',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getInvoice', () => {
    it('should get an invoice successfully', async () => {
      const mockResponse = { id: 'invoice_123', state: 'paid' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getInvoice';
          case 'invoice_id': return 'invoice_123';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeInvoicesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v3.recurly.com/invoices/invoice_123',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('collectInvoice', () => {
    it('should collect an invoice successfully', async () => {
      const mockResponse = { id: 'invoice_123', state: 'processing' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'collectInvoice';
          case 'invoice_id': return 'invoice_123';
          case 'transaction_type': return 'moto';
          default: return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeInvoicesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://v3.recurly.com/invoices/invoice_123/collect',
        headers: {
          'Authorization': expect.stringContaining('Basic'),
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
        },
        body: { transaction_type: 'moto' },
        json: true,

describe('Transactions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v3.recurly.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should list transactions successfully', async () => {
    const mockResponse = {
      data: [
        { id: 'txn_1', amount: 100, currency: 'USD' },
        { id: 'txn_2', amount: 200, currency: 'USD' },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'listTransactions';
        case 'limit': return 20;
        case 'order': return 'desc';
        case 'sort': return 'created_at';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/transactions'),
      })
    );
  });

  test('should create transaction successfully', async () => {
    const mockResponse = {
      id: 'txn_123',
      amount: 100,
      currency: 'USD',
      status: 'success',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'createTransaction';
        case 'account_id': return 'acc_123';
        case 'currency': return 'USD';
        case 'amount': return 100;
        case 'payment_method': return '{"type": "credit_card"}';
        case 'billing_info': return '{}';
        case 'custom_fields': return '{}';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/transactions'),
        body: expect.objectContaining({
          account_id: 'acc_123',
          currency: 'USD',
          amount: 100,
        }),
      })
    );
  });

  test('should get transaction successfully', async () => {
    const mockResponse = {
      id: 'txn_123',
      amount: 100,
      currency: 'USD',
      status: 'success',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getTransaction';
        case 'transaction_id': return 'txn_123';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/transactions/txn_123'),
      })
    );
  });

  test('should refund transaction successfully', async () => {
    const mockResponse = {
      id: 'refund_123',
      amount: 50,
      original_transaction_id: 'txn_123',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'refundTransaction';
        case 'transaction_id': return 'txn_123';
        case 'amount': return 50;
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/transactions/txn_123/refund'),
        body: expect.objectContaining({
          amount: 50,
        }),
      })
    );
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getTransaction';
        case 'transaction_id': return 'invalid_id';
        default: return '';
      }
    });

    const apiError = new Error('Transaction not found');
    (apiError as any).httpCode = 404;
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    const items = [{ json: {} }];

    await expect(
      executeTransactionsOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('Transaction not found');
  });

  test('should handle continue on fail', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getTransaction';
        case 'transaction_id': return 'invalid_id';
        default: return '';
      }
    });

    const apiError = new Error('Transaction not found');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    const items = [{ json: {} }];
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'Transaction not found' });
  });
});

describe('Coupons Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v3.recurly.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listCoupons', () => {
    it('should list coupons successfully', async () => {
      const mockResponse = {
        object: 'list',
        has_more: false,
        data: [
          {
            id: 'coupon_123',
            code: 'SAVE20',
            name: '20% Off Coupon',
            state: 'active',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'listCoupons';
          case 'limit': return 20;
          case 'order': return 'desc';
          case 'sort': return 'created_at';
          case 'state': return 'active';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCouponsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v3.recurly.com/coupons',
        headers: {
          'Authorization': 'Basic dGVzdC1hcGkta2V5Og==',
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
        },
        qs: {
          limit: 20,
          order: 'desc',
          sort: 'created_at',
          state: 'active',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle listCoupons error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'listCoupons';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCouponsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('createCoupon', () => {
    it('should create a coupon successfully', async () => {
      const mockResponse = {
        id: 'coupon_123',
        code: 'SAVE20',
        name: '20% Off Coupon',
        discount_type: 'percent',
        discount_percent: 20,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'createCoupon';
          case 'code': return 'SAVE20';
          case 'name': return '20% Off Coupon';
          case 'discount_type': return 'percent';
          case 'discount_percent': return 20;
          case 'applies_to_all_plans': return true;
          case 'applies_to_non_plan_charges': return false;
          case 'redemption_resource': return 'account';
          case 'max_redemptions_per_account': return 1;
          case 'duration': return 'forever';
          default: return 0;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCouponsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://v3.recurly.com/coupons',
        headers: expect.objectContaining({
          'Authorization': 'Basic dGVzdC1hcGkta2V5Og==',
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
          'Idempotency-Key': expect.any(String),
        }),
        body: {
          code: 'SAVE20',
          name: '20% Off Coupon',
          discount_type: 'percent',
          discount_percent: 20,
          applies_to_all_plans: true,
          redemption_resource: 'account',
          max_redemptions_per_account: 1,
          duration: 'forever',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getCoupon', () => {
    it('should get a coupon successfully', async () => {
      const mockResponse = {
        id: 'coupon_123',
        code: 'SAVE20',
        name: '20% Off Coupon',
        state: 'active',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getCoupon';
        if (paramName === 'coupon_id') return 'coupon_123';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCouponsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v3.recurly.com/coupons/coupon_123',
        headers: {
          'Authorization': 'Basic dGVzdC1hcGkta2V5Og==',
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('updateCoupon', () => {
    it('should update a coupon successfully', async () => {
      const mockResponse = {
        id: 'coupon_123',
        code: 'SAVE20',
        name: 'Updated Coupon Name',
        state: 'active',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'updateCoupon';
        if (paramName === 'coupon_id') return 'coupon_123';
        if (paramName === 'name') return 'Updated Coupon Name';
        if (paramName === 'max_redemptions') return 100;
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCouponsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://v3.recurly.com/coupons/coupon_123',
        headers: {
          'Authorization': 'Basic dGVzdC1hcGkta2V5Og==',
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
        },
        body: {
          name: 'Updated Coupon Name',
          max_redemptions: 100,
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('deleteCoupon', () => {
    it('should delete a coupon successfully', async () => {
      const mockResponse = {
        id: 'coupon_123',
        state: 'inactive',
        deleted_at: '2023-01-01T00:00:00Z',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'deleteCoupon';
        if (paramName === 'coupon_id') return 'coupon_123';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCouponsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://v3.recurly.com/coupons/coupon_123',
        headers: {
          'Authorization': 'Basic dGVzdC1hcGkta2V5Og==',
          'Accept': 'application/vnd.recurly.v2021-02-25',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json:

describe('AddOns Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v3.recurly.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should list plan add-ons successfully', async () => {
    const mockResponse = {
      data: [
        {
          id: 'addon_1',
          code: 'addon_code_1',
          name: 'Test Add-on 1',
          add_on_type: 'fixed',
        },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'listPlanAddOns';
        case 'planId': return 'plan_123';
        case 'limit': return 20;
        case 'order': return 'asc';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAddOnsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/plans/plan_123/add_ons'),
      })
    );
  });

  test('should create plan add-on successfully', async () => {
    const mockResponse = {
      id: 'addon_new',
      code: 'new_addon',
      name: 'New Add-on',
      add_on_type: 'fixed',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'createPlanAddOn';
        case 'planId': return 'plan_123';
        case 'code': return 'new_addon';
        case 'name': return 'New Add-on';
        case 'addOnType': return 'fixed';
        case 'unitAmount': return 1000;
        case 'currency': return 'USD';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAddOnsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/plans/plan_123/add_ons'),
        body: expect.objectContaining({
          code: 'new_addon',
          name: 'New Add-on',
          add_on_type: 'fixed',
        }),
      })
    );
  });

  test('should get plan add-on successfully', async () => {
    const mockResponse = {
      id: 'addon_123',
      code: 'addon_code',
      name: 'Test Add-on',
      add_on_type: 'fixed',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'getPlanAddOn';
        case 'planId': return 'plan_123';
        case 'addOnId': return 'addon_123';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAddOnsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://v3.recurly.com/plans/plan_123/add_ons/addon_123',
      })
    );
  });

  test('should update plan add-on successfully', async () => {
    const mockResponse = {
      id: 'addon_123',
      code: 'addon_code',
      name: 'Updated Add-on',
      add_on_type: 'fixed',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'updatePlanAddOn';
        case 'planId': return 'plan_123';
        case 'addOnId': return 'addon_123';
        case 'name': return 'Updated Add-on';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAddOnsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        url: 'https://v3.recurly.com/plans/plan_123/add_ons/addon_123',
        body: expect.objectContaining({
          name: 'Updated Add-on',
        }),
      })
    );
  });

  test('should delete plan add-on successfully', async () => {
    const mockResponse = {
      id: 'addon_123',
      deleted: true,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'deletePlanAddOn';
        case 'planId': return 'plan_123';
        case 'addOnId': return 'addon_123';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAddOnsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'DELETE',
        url: 'https://v3.recurly.com/plans/plan_123/add_ons/addon_123',
      })
    );
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'getPlanAddOn';
        case 'planId': return 'plan_123';
        case 'addOnId': return 'addon_123';
        default: return undefined;
      }
    });

    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

    await expect(
      executeAddOnsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow();
  });

  test('should continue on fail when enabled', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((name: string) => {
      switch (name) {
        case 'operation': return 'getPlanAddOn';
        case 'planId': return 'plan_123';
        case 'addOnId': return 'addon_123';
        default: return undefined;
      }
    });

    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

    const result = await executeAddOnsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('Webhooks Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://v3.recurly.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('listWebhooks', () => {
    it('should list webhook notifications successfully', async () => {
      const mockResponse = {
        object: 'list',
        has_more: false,
        data: [
          {
            id: 'webhook_123',
            object: 'webhook_notification',
            state: 'successful',
            created_at: '2023-01-01T00:00:00Z',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        const params: any = {
          operation: 'listWebhooks',
          limit: 20,
          order: 'desc',
          sort: 'created_at',
          ids: '',
          beginTime: '',
          endTime: '',
          state: '',
        };
        return params[param] !== undefined ? params[param] : defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v3.recurly.com/webhooks?limit=20&order=desc&sort=created_at',
        headers: {
          Authorization: 'Basic dGVzdC1hcGkta2V5Og==',
          Accept: 'application/vnd.recurly.v2019-10-10',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle list webhooks error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'listWebhooks';
        return '';
      });

      const error = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(
        executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getWebhook', () => {
    it('should get webhook notification successfully', async () => {
      const mockResponse = {
        id: 'webhook_123',
        object: 'webhook_notification',
        state: 'successful',
        created_at: '2023-01-01T00:00:00Z',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'getWebhook',
          webhookId: 'webhook_123',
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://v3.recurly.com/webhooks/webhook_123',
        headers: {
          Authorization: 'Basic dGVzdC1hcGkta2V5Og==',
          Accept: 'application/vnd.recurly.v2019-10-10',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle get webhook error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getWebhook';
        if (param === 'webhookId') return 'webhook_123';
        return '';
      });

      const error = new Error('Webhook not found');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      await expect(
        executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Webhook not found');
    });
  });

  it('should handle unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

    await expect(
      executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });

  it('should continue on fail when configured', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('listWebhooks');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

    const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});
});
