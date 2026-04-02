# n8n-nodes-recurly

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Recurly's subscription billing platform. Manage 7 core resources including accounts, subscriptions, invoices, plans, transactions, coupons, and webhooks with full CRUD operations and advanced subscription management capabilities.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Recurly API](https://img.shields.io/badge/Recurly-API%20v3-orange)
![Subscription Management](https://img.shields.io/badge/Subscription-Management-green)
![Billing Automation](https://img.shields.io/badge/Billing-Automation-purple)

## Features

- **Complete Account Management** - Create, update, retrieve, and manage customer accounts with billing information
- **Subscription Lifecycle Control** - Full subscription operations including creation, modification, cancellation, and reactivation
- **Invoice Operations** - Generate, retrieve, update invoices and handle payment processing
- **Plan Management** - Create and manage subscription plans with flexible pricing models
- **Transaction Processing** - Handle payments, refunds, and transaction tracking
- **Coupon System** - Create and manage discount coupons and promotional codes
- **Webhook Integration** - Set up and manage webhooks for real-time event notifications
- **Error Handling & Validation** - Comprehensive error handling with detailed validation messages

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
| API Key | Your Recurly API key from the developer section | Yes |
| Subdomain | Your Recurly subdomain (e.g., 'yourcompany' for yourcompany.recurly.com) | Yes |
| Environment | Select 'sandbox' for testing or 'production' for live operations | Yes |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Create | Create a new customer account with billing information |
| Get | Retrieve account details by account ID or code |
| Update | Update account information including billing details |
| Delete | Close or delete a customer account |
| List | Retrieve a list of accounts with filtering options |
| Get Balance | Get the current account balance |

### 2. Subscription

| Operation | Description |
|-----------|-------------|
| Create | Create a new subscription for an account |
| Get | Retrieve subscription details by ID |
| Update | Modify subscription settings and billing information |
| Cancel | Cancel a subscription with optional cancellation date |
| Reactivate | Reactivate a cancelled subscription |
| Pause | Temporarily pause a subscription |
| Resume | Resume a paused subscription |
| List | List subscriptions with filtering and pagination |

### 3. Invoice

| Operation | Description |
|-----------|-------------|
| Create | Generate a new invoice for an account |
| Get | Retrieve invoice details by ID |
| Update | Update invoice information and line items |
| List | List invoices with date and status filters |
| Mark Paid | Mark an invoice as paid manually |
| Mark Failed | Mark an invoice collection attempt as failed |
| Void | Void an existing invoice |

### 4. Plan

| Operation | Description |
|-----------|-------------|
| Create | Create a new subscription plan with pricing |
| Get | Retrieve plan details by ID or code |
| Update | Update plan information and pricing |
| Delete | Delete a plan (if not in use) |
| List | List all available plans |
| Get Add-ons | Retrieve add-ons associated with a plan |

### 5. Transaction

| Operation | Description |
|-----------|-------------|
| Create | Process a new transaction or payment |
| Get | Retrieve transaction details by ID |
| List | List transactions with filtering options |
| Refund | Process a refund for an existing transaction |
| Void | Void a pending transaction |

### 6. Coupon

| Operation | Description |
|-----------|-------------|
| Create | Create a new coupon with discount rules |
| Get | Retrieve coupon details by ID or code |
| Update | Update coupon settings and restrictions |
| Delete | Delete an unused coupon |
| List | List all coupons with filtering |
| Restore | Restore a previously deleted coupon |

### 7. Webhook

| Operation | Description |
|-----------|-------------|
| Create | Set up a new webhook endpoint |
| Get | Retrieve webhook configuration by ID |
| Update | Update webhook settings and endpoints |
| Delete | Remove a webhook configuration |
| List | List all configured webhooks |
| Test | Send a test webhook to verify connectivity |

## Usage Examples

```javascript
// Create a new customer account
{
  "code": "customer_001",
  "email": "john.doe@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "billing_info": {
    "first_name": "John",
    "last_name": "Doe",
    "address1": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105",
    "country": "US"
  }
}
```

```javascript
// Create a subscription for an existing account
{
  "account_code": "customer_001",
  "plan_code": "monthly_premium",
  "currency": "USD",
  "unit_amount_in_cents": 2999,
  "quantity": 1,
  "starts_at": "2024-01-01T00:00:00Z"
}
```

```javascript
// Create a discount coupon
{
  "coupon_code": "WELCOME20",
  "name": "Welcome Discount",
  "discount_type": "percent",
  "discount_percent": 20,
  "applies_to_all_plans": true,
  "max_redemptions": 100,
  "applies_until": "2024-12-31T23:59:59Z"
}
```

```javascript
// Process a transaction
{
  "account_code": "customer_001",
  "amount_in_cents": 5000,
  "currency": "USD",
  "payment_method": "credit_card",
  "description": "One-time payment for services"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key and subdomain in credentials |
| Account Not Found | Specified account ID or code doesn't exist | Check account code/ID or create account first |
| Subscription Already Cancelled | Attempting to cancel an already cancelled subscription | Check subscription status before cancellation |
| Plan Not Found | Referenced plan code doesn't exist | Verify plan exists or create plan first |
| Invalid Payment Method | Payment method validation failed | Check billing information and payment method details |
| Rate Limit Exceeded | Too many API requests in short timeframe | Implement delays between requests or retry logic |

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
- **Recurly API Documentation**: [Recurly Developer Docs](https://developers.recurly.com/)
- **Recurly Community**: [Recurly Community Forum](https://support.recurly.com/)