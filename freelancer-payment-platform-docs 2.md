# Freelancer Payment Platform Documentation
## Multi-Currency to M-Pesa Payment System using Interledger Protocol & Rafiki

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Core Technologies](#core-technologies)
3. [Interledger Protocol (ILP)](#interledger-protocol-ilp)
4. [Rafiki Implementation](#rafiki-implementation)
5. [M-Pesa Integration](#m-pesa-integration)
6. [System Architecture](#system-architecture)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Key Resources](#key-resources)

---

## Project Overview

### Vision
Build a platform that enables clients worldwide to pay Kenyan freelancers using multiple currencies (USD, BTC, etc.) with automatic conversion and delivery to their M-Pesa accounts.

### Key Features
- Accept payments in multiple currencies (USD, BTC, EUR, etc.)
- Leverage Interledger Protocol for cross-ledger transactions
- Use Rafiki as the ILP implementation layer
- Automatically convert and deliver funds to M-Pesa
- Real-time payment processing
- Transparent fee structure
- Secure transaction handling

---

## Core Technologies

### 1. Interledger Protocol (ILP)
**What it is:** An open protocol suite for sending packets of value across different payment networks, inspired by TCP/IP.

**Why it matters:**
- Enables payments across different ledgers and currencies
- No single network dependency
- Scalable and neutral
- Designed for high-volume, low-value transactions ("penny switching")

**Current Version:** ILPv4 (optimized for routing large volumes of low-value packets)

### 2. Rafiki
**What it is:** Open-source software that provides an efficient solution for Account Servicing Entities (ASEs) to enable Interledger functionality.

**Why it matters:**
- Reference implementation of ILP stack
- Handles the complexity of ILP implementation
- Includes connector, accounting database (TigerBeetle), and APIs
- Supports Open Payments standard
- Multi-tenancy support (as of v2.0.0-beta)

### 3. M-Pesa API (Daraja)
**What it is:** Safaricom's API platform for integrating M-Pesa payment functionality into applications.

**Why it matters:**
- ~30 million users in Kenya alone
- Widely accepted payment method
- APIs for B2C (Business to Customer) disbursements
- Real-time transaction processing
- Reliable and secure

---

## Interledger Protocol (ILP)

### Architecture Overview

ILP is structured in layers, similar to the internet protocol stack:

```
┌─────────────────────────────────────┐
│   Application Layer                 │
│   (Open Payments, Web Monetization) │
├─────────────────────────────────────┤
│   Transport Layer                   │
│   (STREAM Protocol)                 │
├─────────────────────────────────────┤
│   Interledger Layer                 │
│   (ILPv4 - Core Protocol)           │
├─────────────────────────────────────┤
│   Link Layer                        │
│   (Bilateral Transfer Protocol)     │
├─────────────────────────────────────┤
│   Ledger Layer                      │
│   (Settlement Systems)              │
└─────────────────────────────────────┘
```

### Key Concepts

#### 1. **Packets**
- ILPv4 has three packet types:
  - **Prepare**: Request packet (sender → receiver)
  - **Fulfill**: Success response (receiver → sender)
  - **Reject**: Error response (receiver → sender)

#### 2. **Connectors**
- Intermediaries that forward packets between senders and receivers
- Compete to offer best balance of speed, reliability, coverage, and cost
- Can charge fees for their services

#### 3. **Accounts & Balances**
- Two peers establish accounts to track obligations
- Balance represents difference between ILP packets sent/received and settled value
- Settlement happens periodically through underlying ledgers

#### 4. **Security**
- Uses Hashed Timelock Agreements (HTLAs)
- Conditions and fulfillments for packet security
- Conditions are NOT enforced by ledgers (too slow/costly)
- Instead used for accounting between peers

### Protocol Features

**Neutrality:** Not tied to any company, currency, or network

**Interoperability:** Works with any ledger type, even those not built for interoperability

**End-to-End Principle:** Complex features at network edges, not in core protocol

**Scalability:** No single processing system, unlimited scalability potential

---

## Rafiki Implementation

### What Rafiki Provides

Rafiki is a comprehensive package that includes:

1. **Interledger Connector** - Acts as a node on the Interledger network
2. **TigerBeetle** - High-throughput accounting database for financial transactions
3. **Backend Service** - Handles business logic and external communication
4. **Auth Service** - Authorization server for Open Payments
5. **Admin APIs** - For managing:
   - Peering relationships
   - Supported assets
   - Wallet addresses
   - Configuration

### Architecture Components

```
┌──────────────────────────────────────────────┐
│              Rafiki Instance                 │
│                                              │
│  ┌─────────────┐        ┌────────────────┐  │
│  │   Backend   │◄──────►│     Auth       │  │
│  │   Service   │        │    Service     │  │
│  └──────┬──────┘        └────────────────┘  │
│         │                                    │
│         ▼                                    │
│  ┌──────────────────────────────────────┐   │
│  │   ILP Connector                      │   │
│  │   (Handles packet routing)           │   │
│  └──────────────────────────────────────┘   │
│         │                                    │
│         ▼                                    │
│  ┌──────────────────────────────────────┐   │
│  │   TigerBeetle                        │   │
│  │   (Accounting Database)              │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │   Admin UI (Frontend)                │   │
│  └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

### Key Features

#### 1. **Open Payments Support**
- Standardized API for third-party access to accounts
- Uses Grant Negotiation and Authorization Protocol (GNAP)
- Enables:
  - Transaction history retrieval
  - Payment initiation
  - Fine-grained access control

#### 2. **Multi-tenancy** (v2.0.0-beta+)
- Support for multiple account servicing entities
- Isolated data and configurations per tenant

#### 3. **Web Monetization**
- Supports incoming/outgoing Web Monetization payments
- Uses Simple Payment Setup Protocol (SPSP)
- Wallet addresses for each account holder

#### 4. **Latest Features** (2026)
- Encrypted data exchange between ILP peers
- GoLang SDK support
- Enhanced scalability architecture in development
- Card service and point-of-sale integration

### Setup & Deployment

#### Prerequisites
- Git
- Docker
- Node Version Manager (NVM)

#### Local Development
```bash
git clone https://github.com/interledger/rafiki.git
cd rafiki
git submodule update --init --recursive
```

#### Running Local Playground
The local environment provides two mock ASEs that automatically peer with each other for testing.

Location: `localenv/` directory

#### Deployment Options
- Docker containers
- Kubernetes with Helm charts
- Kubernetes Operator (in development)

---

## M-Pesa Integration

### Daraja API Platform

Safaricom's Daraja 3.0 provides APIs for M-Pesa integration:

**Official Portal:** https://developer.safaricom.co.ke/

### Key APIs for Your Use Case

#### 1. **B2C (Business to Customer) API**
- **Purpose**: Send money from your business account to customer M-Pesa accounts
- **Perfect for**: Paying freelancers
- **Features**:
  - Single and bulk payments
  - Real-time processing
  - Automated disbursements
  - Up to 5,000 transactions per batch

#### 2. **Transaction Status API**
- Query status of transactions
- Get confirmation details
- Track payment delivery

#### 3. **Account Balance API**
- Check your M-Pesa business account balance
- Monitor available funds

### Integration Requirements

#### 1. **Business Registration**
- Registered business in Kenya
- Safaricom business account
- PayBill or Till number

#### 2. **Daraja Portal Account**
- Register at developer.safaricom.co.ke
- Create sandbox app for testing
- Apply for production access

#### 3. **Credentials Needed**
- Consumer Key
- Consumer Secret
- Lipa Na M-Pesa Online (LNMO) Shortcode
- Passkey
- Shortcode (PayBill/Till number)

#### 4. **Technical Requirements**
- Secure HTTPS server for callbacks
- Webhook endpoints for payment notifications
- SSL/TLS certificates

### Integration Process

#### Step 1: Sandbox Testing
1. Register on Daraja portal
2. Create sandbox application
3. Get sandbox credentials
4. Test API calls in sandbox environment

#### Step 2: Production Setup
```
1. Obtain PayBill/Till Number
   ↓
2. Create Business Administrator User
   (Fill admin creation form, sign, stamp)
   ↓
3. Register on Daraja Portal
   ↓
4. Click "Go Live"
   ↓
5. Select verification by shortcode
   ↓
6. Enter admin username, select APIs
   ↓
7. Receive production credentials via email
   ↓
8. Register callback URLs
   ↓
9. Implement payment logic
```

#### Step 3: B2C Payment Flow
```javascript
// Pseudo-code for B2C payment
const payment = {
  InitiatorName: "your_username",
  SecurityCredential: "encrypted_password",
  CommandID: "BusinessPayment",
  Amount: 1000, // Amount in KES
  PartyA: "your_shortcode",
  PartyB: "254712345678", // Recipient phone number
  Remarks: "Freelance payment",
  QueueTimeOutURL: "https://your-domain.com/timeout",
  ResultURL: "https://your-domain.com/result",
  Occasion: "Payment for services"
};

// Send request to M-Pesa B2C API
const response = await mpesa.b2c(payment);
```

### Security Best Practices

1. **Use HTTPS** for all communications
2. **Encrypt sensitive data** at rest and in transit
3. **Validate all inputs** to prevent injection attacks
4. **Implement rate limiting** to prevent abuse
5. **Monitor transactions** for suspicious patterns
6. **Use unique transaction IDs** to prevent replay attacks
7. **Keep credentials secure** - never commit to version control
8. **Regular security audits**

### Transaction Costs

- Safaricom charges transaction fees on B2C payments
- Fees vary based on payment amount
- Check current fee structure at Safaricom's official site

### Third-Party Solutions

For faster integration, consider these intermediaries:
- **IntaSend** - Simplified M-Pesa API with SDKs
- **KopoKopo** - Payment gateway with M-Pesa integration
- Custom integration via Daraja API (full control)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│  (Pays in USD, BTC, EUR, etc.)                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Payment Gateway Frontend                   │
│  - Currency selection                                   │
│  - Amount input                                         │
│  - Freelancer selection                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           Your Platform Backend                         │
│  - User management                                      │
│  - Transaction logging                                  │
│  - Rate calculation                                     │
│  - Fee management                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Rafiki Instance                            │
│  ┌────────────────────────────────────────────┐        │
│  │  Open Payments API (Incoming)              │        │
│  └──────────────────┬─────────────────────────┘        │
│                     ▼                                   │
│  ┌────────────────────────────────────────────┐        │
│  │      ILP Connector                         │        │
│  │  - Routes packets                          │        │
│  │  - Currency conversion                     │        │
│  │  - Multi-hop forwarding                    │        │
│  └──────────────────┬─────────────────────────┘        │
│                     ▼                                   │
│  ┌────────────────────────────────────────────┐        │
│  │  TigerBeetle (Accounting)                  │        │
│  └────────────────────────────────────────────┘        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│        Settlement / Conversion Layer                    │
│  (Handles final conversion to KES)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            M-Pesa Daraja API                            │
│  ┌────────────────────────────────────────────┐        │
│  │     B2C Payment Initiation                 │        │
│  └──────────────────┬─────────────────────────┘        │
│                     ▼                                   │
│  ┌────────────────────────────────────────────┐        │
│  │     Transaction Processing                 │        │
│  └──────────────────┬─────────────────────────┘        │
│                     ▼                                   │
│  ┌────────────────────────────────────────────┐        │
│  │     Callback/Confirmation                  │        │
│  └────────────────────────────────────────────┘        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Freelancer M-Pesa Account                       │
│  (Receives KES directly)                                │
└─────────────────────────────────────────────────────────┘
```

### Payment Flow Sequence

```
1. Client initiates payment
   ├─ Selects freelancer
   ├─ Enters amount in their currency (e.g., $100)
   └─ Confirms transaction

2. Your platform backend processes
   ├─ Validates transaction
   ├─ Calculates fees
   ├─ Determines KES equivalent
   └─ Creates payment record

3. Rafiki handles ILP routing
   ├─ Creates incoming payment
   ├─ Routes through ILP network
   ├─ Performs currency conversion
   └─ Updates accounting in TigerBeetle

4. Settlement layer converts to KES
   ├─ Final currency conversion (if needed)
   └─ Prepares for M-Pesa disbursement

5. M-Pesa B2C API call
   ├─ Authenticate with Daraja
   ├─ Initiate B2C transaction
   └─ Send to freelancer's phone number

6. M-Pesa processes payment
   ├─ Validates recipient
   ├─ Credits M-Pesa account
   └─ Sends confirmation

7. Callback handling
   ├─ Receive M-Pesa callback
   ├─ Update transaction status
   ├─ Notify freelancer
   └─ Update platform records
```

### Data Models

#### Transaction Record
```javascript
{
  id: "txn_abc123",
  clientId: "client_xyz",
  freelancerId: "freelancer_123",
  sourceAmount: 100,
  sourceCurrency: "USD",
  destinationAmount: 12500,
  destinationCurrency: "KES",
  exchangeRate: 125.00,
  platformFee: 2.50,
  ilpFee: 0.50,
  totalFees: 3.00,
  status: "completed",
  mpesaTransactionId: "MPX123456",
  mpesaReceipt: "REC789",
  freelancerPhone: "254712345678",
  timestamps: {
    initiated: "2026-02-12T10:00:00Z",
    rafikiProcessed: "2026-02-12T10:00:05Z",
    mpesaSent: "2026-02-12T10:00:08Z",
    completed: "2026-02-12T10:00:12Z"
  }
}
```

#### Freelancer Profile
```javascript
{
  id: "freelancer_123",
  name: "Jane Doe",
  email: "jane@example.com",
  mpesaPhone: "254712345678",
  walletAddress: "$jane.yourplatform.com",
  bankAccount: {
    accountNumber: "1234567890",
    bankCode: "01" // Optional, for future bank integration
  },
  preferences: {
    minimumPayout: 1000, // KES
    autoWithdraw: true
  },
  verified: true,
  kycStatus: "completed"
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

#### Week 1-2: Setup & Learning
- [ ] Set up development environment
- [ ] Deploy Rafiki local playground
- [ ] Explore Rafiki documentation thoroughly
- [ ] Test transactions in local environment
- [ ] Study Open Payments specification
- [ ] Review ILP packet flow

#### Week 3-4: M-Pesa Integration
- [ ] Register for Daraja developer account
- [ ] Create sandbox application
- [ ] Implement B2C payment in sandbox
- [ ] Set up callback endpoints
- [ ] Test various transaction scenarios
- [ ] Handle error cases
- [ ] Document integration process

### Phase 2: Platform Development (Weeks 5-8)

#### Week 5-6: Backend Development
- [ ] Design database schema
- [ ] Set up user authentication
- [ ] Create freelancer management system
- [ ] Build transaction logging
- [ ] Implement rate calculation engine
- [ ] Create admin dashboard

#### Week 7-8: Rafiki Integration
- [ ] Deploy production Rafiki instance
- [ ] Configure peering relationships
- [ ] Set up asset management
- [ ] Create wallet addresses for users
- [ ] Implement Open Payments client
- [ ] Test payment flows

### Phase 3: Integration & Testing (Weeks 9-12)

#### Week 9-10: Connect All Pieces
- [ ] Connect frontend to backend
- [ ] Integrate backend with Rafiki
- [ ] Integrate Rafiki with M-Pesa
- [ ] Implement currency conversion logic
- [ ] Set up monitoring and logging
- [ ] Create transaction tracking system

#### Week 11-12: Testing & Security
- [ ] End-to-end testing
- [ ] Load testing
- [ ] Security audit
- [ ] Penetration testing
- [ ] Fix identified issues
- [ ] Prepare for production

### Phase 4: Production Launch (Weeks 13-16)

#### Week 13-14: Production Setup
- [ ] Set up production servers
- [ ] Configure production Rafiki
- [ ] Get M-Pesa production credentials
- [ ] Set up monitoring and alerting
- [ ] Create backup and recovery procedures
- [ ] Document operations procedures

#### Week 15-16: Launch & Monitor
- [ ] Soft launch with beta users
- [ ] Monitor transactions closely
- [ ] Gather user feedback
- [ ] Make necessary adjustments
- [ ] Full public launch
- [ ] Marketing and onboarding

### Phase 5: Optimization (Ongoing)

- [ ] Optimize transaction speeds
- [ ] Reduce fees where possible
- [ ] Add more currency support
- [ ] Improve user experience
- [ ] Scale infrastructure
- [ ] Add new features based on feedback

---

## Key Resources

### Interledger Protocol

**Official Documentation:**
- Main site: https://interledger.org/
- Architecture: https://interledger.org/developers/rfcs/interledger-architecture/
- ILPv4 Spec: https://interledger.org/developers/rfcs/interledger-protocol/
- GitHub: https://github.com/interledger/rfcs

**Getting Started:**
- Developer Docs: https://interledger.org/developers/get-started/

### Rafiki

**Official Resources:**
- Documentation: https://rafiki.dev/
- GitHub: https://github.com/interledger/rafiki
- Getting Started: https://rafiki.dev/overview/overview
- Local Playground: https://rafiki.dev/integration/playground/overview
- API Docs: https://rafiki.dev/apis/graphql/backend

**Community:**
- Slack: Join Interledger community
- Community Calls: Every Tuesday at 15:30 GMT

**Recent Updates:**
- January 2026 update: https://community.interledger.org/interledger/rafiki-updates-january-2026-12i7
- December 2025 update: https://community.interledger.org/interledger/rafiki-updates-december-2025-1gh6

### M-Pesa / Daraja API

**Official Resources:**
- Daraja Portal: https://developer.safaricom.co.ke/
- M-Pesa API Info: https://www.safaricom.co.ke/main-mpesa/m-pesa-services/do-more-with-m-pesa/m-pesa-api

**Integration Guides:**
- Comprehensive guide: https://webpinn.com/mpesa-integration-guide-kenya/
- Step-by-step: https://intasend.com/payments/m-pesa-api-integration-step-by-step-guide
- Updated Daraja guide: https://techweez.com/2022/07/29/the-updated-m-pesa-daraja-api-integration-guide/

**Third-Party Solutions:**
- IntaSend: https://intasend.com/mpesa-api/
- IntaSend Docs: https://intasend.com/payments/m-pesa-api-integration-step-by-step-guide

### Open Payments

**Specification:**
- Open Payments documentation: Check Rafiki docs for latest links
- GNAP Protocol: Study grant negotiation

### Development Tools

**Code Examples:**
- Rafiki local environment
- Bruno API collection (in Rafiki repo)
- Laravel M-Pesa example: https://github.com/harrykerry/laravel-mpesa-integration

**Testing:**
- Daraja sandbox environment
- Rafiki local playground
- Bruno for API testing

---

## Technical Considerations

### Currency Conversion

**Options:**
1. **Built into ILP:** Use connector rates
2. **External Service:** Integrate forex API (e.g., Open Exchange Rates, Fixer.io)
3. **Hybrid:** ILP for crypto, external for fiat

**Implementation:**
```javascript
// Example rate calculation
const getConversionRate = async (from, to) => {
  if (from === to) return 1;
  
  // Check if ILP connector provides rate
  const ilpRate = await rafikiClient.getRate(from, to);
  if (ilpRate) return ilpRate;
  
  // Fallback to external API
  const externalRate = await forexAPI.getRate(from, to);
  return externalRate;
};
```

### Settlement

**Considerations:**
- How often to settle with M-Pesa?
- Batch vs. individual payments?
- Minimum payout thresholds?
- Fee optimization

**Recommendation:**
- Start with individual payments for transparency
- Move to batching as volume increases
- Set reasonable minimum payouts (e.g., 500 KES)

### Compliance & Regulations

**Kenya:**
- KYC (Know Your Customer) requirements
- Anti-Money Laundering (AML) compliance
- Data protection (Kenya Data Protection Act)
- Financial service licensing (if applicable)

**International:**
- Cross-border payment regulations
- Tax reporting requirements
- GDPR (if serving EU clients)

### Monitoring & Alerts

**Key Metrics:**
- Transaction success rate
- Average transaction time
- Failed transaction reasons
- Currency conversion accuracy
- Fee calculations
- M-Pesa API response times

**Recommended Tools:**
- Prometheus + Grafana for metrics
- Sentry for error tracking
- PagerDuty for alerts
- Custom dashboard for business metrics

---

## Next Steps

1. **Start with Rafiki:**
   - Clone the repository
   - Run the local playground
   - Understand the payment flow
   - Test transactions between mock ASEs

2. **M-Pesa Sandbox:**
   - Register for Daraja account
   - Create test application
   - Make test B2C payments
   - Implement callback handling

3. **Design Your System:**
   - Define user flows
   - Design database schema
   - Plan API architecture
   - Choose tech stack

4. **Build MVP:**
   - Focus on core functionality
   - Single currency to start (e.g., USD → KES)
   - Basic UI
   - Essential security features

5. **Test & Iterate:**
   - Get feedback from test users
   - Refine based on real usage
   - Add features incrementally
   - Scale as needed

---

## Questions to Consider

1. **Business Model:**
   - What fees will you charge?
   - Fixed fee, percentage, or hybrid?
   - Who pays fees - client or freelancer?

2. **User Experience:**
   - How will clients find freelancers?
   - Escrow or direct payment?
   - Dispute resolution process?
   - Payment scheduling?

3. **Technical:**
   - Hosting infrastructure?
   - Database choice?
   - Backup strategy?
   - Disaster recovery plan?

4. **Legal:**
   - Business registration needed?
   - Financial service license?
   - Terms of service?
   - Privacy policy?

5. **Scale:**
   - Expected transaction volume?
   - Growth projections?
   - Infrastructure scaling plan?
   - Cost per transaction at scale?

---

## Support & Community

- **Interledger Foundation:** https://interledger.org/
- **Rafiki GitHub Issues:** https://github.com/interledger/rafiki/issues
- **Interledger Community:** Join Slack workspace
- **M-Pesa Support:** apisupport@safaricom.co.ke

---

*This documentation is current as of February 2026. Always check official sources for the latest updates.*
