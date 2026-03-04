# n8n-nodes-recurly

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with Recurly's subscription billing platform. With 8 resources implemented, it enables complete subscription lifecycle management including customer accounts, subscription plans, billing, invoicing, and payment processing within your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Recurly API](https://img.shields.io/badge/Recurly-API%20v2021-orange)
![Subscription Billing](https://img.shields.io/badge/Billing-Subscriptions-green)
![Webhooks](https://img.shields.io/badge/Webhooks-Supported-purple)

## Features

- **Complete Account Management** - Create, update, and manage customer accounts with full profile and billing information
- **Subscription Lifecycle Control** - Handle subscription creation, modifications, upgrades, downgrades, and cancellations
- **Flexible Plan Configuration** - Manage subscription plans, pricing tiers, and billing cycles
- **Invoice & Payment Processing** - Generate invoices, process payments, and handle transaction management
- **Promotional Tools** - Create and manage coupons, discounts, and add-on services
- **Real-time Webhook Integration** - Receive and process Recurly webhook events for automated workflows
- **Advanced Filtering & Pagination** - Efficiently query large datasets with built-in pagination support
- **Error Handling & Retry Logic** - Robust error handling with automatic retry capabilities for failed requests

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-recurly`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-recurly
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-recurly.git
cd n8n-nodes-recurly
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-recurly
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Recurly API key found in the Recurly admin panel under Developer → API Credentials | Yes |
| Environment | Select between Sandbox (testing) or Production environment | Yes |
| Site ID | Your Recurly site identifier (subdomain) | Yes |

## Resources & Operations

### 1. Accounts

| Operation | Description |
|-----------|-------------|
| Create | Create a new customer account with billing information |
| Get | Retrieve account details by account code or ID |
| Update | Update account information and billing details |
| List | List all accounts with filtering and pagination |
| Delete | Close or delete an account |
| Get Balance | Retrieve current account balance and outstanding amounts |
| Reactivate | Reactivate a closed account |

### 2. Subscriptions

| Operation | Description |
|-----------|-------------|
| Create | Create a new subscription for an account |
| Get | Retrieve subscription details by UUID |
| Update | Modify subscription settings, plan, or add-ons |
| List | List subscriptions with filtering options |
| Cancel | Cancel a subscription immediately or at period end |
| Reactivate | Reactivate a canceled subscription |
| Change Plan | Upgrade or downgrade subscription plan |
| Pause | Temporarily pause a subscription |
| Resume | Resume a paused subscription |

### 3. Plans

| Operation | Description |
|-----------|-------------|
| Create | Create a new subscription plan |
| Get | Retrieve plan details by plan code |
| Update | Update plan pricing and settings |
| List | List all available plans |
| Delete | Remove a plan (if not in use) |
| Add Add-On | Associate add-ons with a plan |
| Remove Add-On | Remove add-ons from a plan |

### 4. Invoices

| Operation | Description |
|-----------|-------------|
| Create | Generate a new invoice for an account |
| Get | Retrieve invoice details and line items |
| List | List invoices with date and status filters |
| Mark Paid | Mark an invoice as paid manually |
| Mark Failed | Mark an invoice collection as failed |
| Collect | Attempt to collect payment on an invoice |
| Refund | Issue a refund for a paid invoice |
| Get PDF | Retrieve invoice PDF document |

### 5. Transactions

| Operation | Description |
|-----------|-------------|
| Create | Process a one-time transaction |
| Get | Retrieve transaction details by UUID |
| List | List transactions with filtering options |
| Refund | Issue a full or partial refund |
| Void | Void an authorized transaction |

### 6. Coupons

| Operation | Description |
|-----------|-------------|
| Create | Create a new discount coupon |
| Get | Retrieve coupon details by coupon code |
| Update | Update coupon settings and restrictions |
| List | List all coupons with status filters |
| Deactivate | Deactivate a coupon |
| Reactivate | Reactivate a deactivated coupon |
| Generate Codes | Generate unique coupon codes for bulk campaigns |

### 7. AddOns

| Operation | Description |
|-----------|-------------|
| Create | Create a new add-on service |
| Get | Retrieve add-on details by add-on code |
| Update | Update add-on pricing and settings |
| List | List all add-ons |
| Delete | Remove an add-on |

### 8. Webhooks

| Operation | Description |
|-----------|-------------|
| Validate | Validate webhook signature and payload |
| Parse | Parse webhook event data into structured format |
| List Events | Retrieve available webhook event types |

## Usage Examples

```javascript
// Create a new customer account
const accountData = {
  "code": "customer-12345",
  "email": "customer@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "billing_info": {
    "first_name": "John",
    "last_name": "Doe",
    "number": "4111111111111111",
    "month": "12",
    "year": "2025",
    "cvv": "123"
  }
};
```

```javascript
// Create a subscription with add-ons
const subscriptionData = {
  "account_code": "customer-12345",
  "plan_code": "premium-monthly",
  "currency": "USD",
  "subscription_add_ons": [
    {
      "add_on_code": "extra-storage",
      "quantity": 2
    }
  ]
};
```

```javascript
// Apply a coupon to an existing subscription
const couponData = {
  "coupon_code": "SAVE20",
  "subscription_uuid": "sub_abc123def456"
};
```

```javascript
// Process a one-time transaction
const transactionData = {
  "account_code": "customer-12345",
  "amount_in_cents": 2500,
  "currency": "USD",
  "description": "One-time service fee"
};
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid API key or credentials | Verify API key and site ID in credentials |
| 404 Not Found | Resource doesn't exist | Check account codes, plan codes, or UUIDs |
| 422 Validation Error | Invalid data in request | Review required fields and data formats |
| 429 Rate Limit | Too many requests | Implement delays between requests |
| 500 Server Error | Recurly service unavailable | Retry request after delay |
| Network Timeout | Request timed out | Check network connection and retry |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-recurly/issues)
- **Recurly API Documentation**: [https://developers.recurly.com/api/v2021-02-25/](https://developers.recurly.com/api/v2021-02-25/)
- **Recurly Developer Resources**: [https://developers.recurly.com/](https://developers.recurly.com/)