# n8n-nodes-recurly

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Recurly subscription management providing 12 resources and 90+ operations for billing automation, subscription lifecycle management, and invoice processing. Includes webhook trigger support for real-time event handling.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **Complete API Coverage**: 12 resources with 90+ operations covering all major Recurly functionality
- **Account Management**: Create, update, and manage customer accounts with billing information
- **Subscription Lifecycle**: Full control over subscriptions including create, cancel, pause, resume, and terminate
- **Invoice Processing**: Create invoices, process payments, handle refunds, and download PDFs
- **Plan Management**: Configure pricing plans with currencies, trials, and add-ons
- **Coupon System**: Create and manage discount coupons with bulk code generation
- **Usage-Based Billing**: Track and bill metered usage with measured units
- **Webhook Triggers**: Real-time notifications for account, subscription, invoice, payment, and dunning events

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-recurly`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-recurly
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-recurly.git
cd n8n-nodes-recurly

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-recurly

# Restart n8n
```

## Credentials Setup

To use this node, you need to configure Recurly API credentials:

| Property | Description |
|----------|-------------|
| **API Key** | Your Recurly private API key (found in Integrations > API Credentials) |
| **Subdomain** | Your Recurly subdomain (e.g., `yourcompany` from `yourcompany.recurly.com`) |

### Getting Your API Key

1. Log in to your Recurly account
2. Navigate to **Integrations** > **API Credentials**
3. Copy your **Private API Key**
4. Never share or expose this key publicly

## Resources & Operations

### Account
| Operation | Description |
|-----------|-------------|
| Create | Create a new customer account |
| Get | Retrieve account by ID or code |
| Get Many | List accounts with filtering |
| Update | Modify account information |
| Delete | Deactivate an account |
| Reopen | Reactivate a closed account |
| Get Balance | Retrieve account balance |
| Get Billing Info | Get billing information |
| Update Billing Info | Update payment details |

### Subscription
| Operation | Description |
|-----------|-------------|
| Create | Create a new subscription |
| Get | Retrieve subscription by ID |
| Get Many | List subscriptions with filtering |
| Update | Modify subscription settings |
| Cancel | Cancel a subscription |
| Reactivate | Reactivate canceled subscription |
| Pause | Pause subscription billing |
| Resume | Resume paused subscription |
| Terminate | Immediately terminate subscription |
| Postpone | Postpone next renewal date |

### Plan
| Operation | Description |
|-----------|-------------|
| Create | Create a new pricing plan |
| Get | Retrieve plan by ID or code |
| Get Many | List all plans |
| Update | Modify plan details |
| Delete | Remove a plan |

### Invoice
| Operation | Description |
|-----------|-------------|
| Create | Create a charge invoice |
| Get | Retrieve invoice by ID |
| Get Many | List invoices with filtering |
| Collect | Attempt payment collection |
| Mark Paid | Mark invoice as paid |
| Mark Failed | Mark collection as failed |
| Void | Void an invoice |
| Refund | Refund an invoice |
| Get PDF | Download invoice as PDF |

### Transaction
| Operation | Description |
|-----------|-------------|
| Create | Create a manual transaction |
| Get | Retrieve transaction by ID |
| Get Many | List transactions |
| Refund | Refund a transaction |
| Void | Void a transaction |

### Coupon
| Operation | Description |
|-----------|-------------|
| Create | Create a new coupon |
| Get | Retrieve coupon by ID or code |
| Get Many | List all coupons |
| Update | Modify coupon settings |
| Delete | Deactivate a coupon |
| Restore | Restore deactivated coupon |
| Generate Codes | Generate bulk unique codes |

### Credit Payment
| Operation | Description |
|-----------|-------------|
| Get | Retrieve credit payment by ID |
| Get Many | List credit payments |

### Line Item
| Operation | Description |
|-----------|-------------|
| Create | Create pending charge/credit |
| Get | Retrieve line item by ID |
| Get Many | List line items for account |
| Delete | Remove pending line item |

### Add-On
| Operation | Description |
|-----------|-------------|
| Create | Create add-on for a plan |
| Get | Retrieve add-on by ID |
| Get Many | List add-ons for plan |
| Update | Modify add-on details |
| Delete | Remove add-on from plan |

### Shipping Method
| Operation | Description |
|-----------|-------------|
| Create | Create shipping method |
| Get | Retrieve shipping method |
| Get Many | List shipping methods |
| Update | Modify shipping method |
| Delete | Deactivate shipping method |

### Measured Unit
| Operation | Description |
|-----------|-------------|
| Create | Create usage unit |
| Get | Retrieve measured unit |
| Get Many | List measured units |
| Update | Modify unit details |
| Delete | Deactivate measured unit |

### Usage
| Operation | Description |
|-----------|-------------|
| Create | Record usage for billing |
| Get | Retrieve usage record |
| Get Many | List usage records |
| Update | Modify usage record |
| Delete | Remove usage record |

## Trigger Node

The Recurly Trigger node allows you to receive webhook events from Recurly.

### Supported Events

**Account Events:**
- Account Created, Updated, Closed
- Billing Info Updated, Fraud Review

**Subscription Events:**
- Created, Activated, Modified, Renewed
- Canceled, Expired, Reactivated
- Paused, Resumed

**Invoice Events:**
- Created, Closed, Paid
- Past Due, Failed, Voided, Reopened

**Payment Events:**
- Succeeded, Failed, Declined, Refunded
- Fraud Info Updated

**Dunning Events:**
- Cycle Started, Cycle Completed

### Webhook Setup

1. Add the Recurly Trigger node to your workflow
2. Copy the webhook URL from the node
3. In Recurly, go to **Integrations** > **Webhooks**
4. Add a new endpoint with your n8n webhook URL
5. Select the events you want to receive
6. Save the webhook configuration

## Usage Examples

### Create a Customer Account

```javascript
// Using the Recurly node with operation "Create" on resource "Account"
{
  "accountCode": "customer-123",
  "email": "customer@example.com",
  "additionalFields": {
    "firstName": "John",
    "lastName": "Doe",
    "company": "Acme Inc"
  }
}
```

### Create a Subscription

```javascript
// Using the Recurly node with operation "Create" on resource "Subscription"
{
  "planCode": "monthly-pro",
  "accountId": "acct_xxxxx",
  "currency": "USD",
  "additionalFields": {
    "quantity": 1,
    "autoRenew": true
  }
}
```

### Apply a Coupon to Subscription

```javascript
// When creating a subscription
{
  "planCode": "annual-plan",
  "accountId": "acct_xxxxx",
  "currency": "USD",
  "additionalFields": {
    "couponCodes": "SUMMER20, LOYALTY10"
  }
}
```

## Error Handling

The node provides detailed error messages from Recurly's API:

| Error Type | Description |
|------------|-------------|
| `validation` | Invalid input parameters |
| `not_found` | Resource not found |
| `unauthorized` | Invalid API credentials |
| `forbidden` | Access denied |
| `too_many_requests` | Rate limit exceeded |

## Security Best Practices

1. **Never expose your API key** - Store credentials securely in n8n
2. **Use sandbox for testing** - Test workflows with Recurly sandbox before production
3. **Verify webhooks** - Enable subdomain verification on trigger nodes
4. **Monitor rate limits** - Recurly allows 2000 requests/minute (varies by plan)

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Watch mode for development
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

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-recurly/issues)
- **Documentation**: [Recurly API Docs](https://recurly.com/developers/api/)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [Recurly](https://recurly.com) for their excellent subscription management platform and API documentation
- [n8n](https://n8n.io) for the powerful workflow automation platform
