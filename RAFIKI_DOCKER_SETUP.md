#  Rafiki Local Playground: Complete Setup Guide

## What is Rafiki?

**Rafiki** is an open-source implementation of the **Interledger Protocol (ILP)** developed by the Interledger Foundation. It enables:

- Cross-currency payments
- Settlement between different ledgers
- Real-time gross settlement
- Low-fee international transfers

### Why Use Rafiki?

In our freelancer platform, Rafiki handles:
1. **Currency exchange** (USD → KES)
2. **Network routing** (finding the best payment path)
3. **Fee calculation** (connector fees + spreads)
4. **Settlement** (atomic transactions)

---

## 🎯 Raf iki Architecture

```
┌──────────────────────────────────────────────────────┐
│           RAFIKI LOCAL PLAYGROUND                     │
└──────────────────┬───────────────────────────────────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
┌────▼────┐  ┌─────▼──────┐  ┌──▼─────┐
│TigerBtl │  │ PostgreSQL │  │ Redis  │
│(Ledger) │  │  (Data)    │  │(Cache) │
└─────────┘  └────────────┘  └────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
   ┌────▼───┐ ┌────▼────┐ ┌──▼──────┐
   │Rafiki  │ │ Rafiki  │ │  Mock   │
   │Backend │ │  Auth   │ │  ASE    │
   └────────┘ └─────────┘ └─────────┘
```

---

## 📋 Prerequisites

### 1. Software Requirements

```bash
# Check Node.js version (MUST be v20)
node --version  # Should output: v20.x.x

# If not v20, install nvm and switch:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### 2. Install pnpm

```bash
npm install -g pnpm@8.15.9

# Verify installation
pnpm --version  # Should be 8.15.9 or higher
```

### 3. Docker Desktop

- Download: [docker.com/products/docker-desktop](https://docker.com/products/docker-desktop)
- Ensure it's running: `docker ps` should work
- Allocate at least **4GB RAM** to Docker

---

## 🚀 Setup Steps

### Step 1: Clone Rafiki Repository

```bash
cd ~/Documents/freelancer-platform
git clone https://github.com/interledger/rafiki.git rafiki-local
cd rafiki-local
```

**What you just cloned:**
- Rafiki backend (Node.js/GraphQL)
- Rafiki auth server (GNAP protocol)
- Local environment setup (Docker Compose)
- Mock Account Servicing Entity (ASE)

### Step 2: Install Dependencies

```bash
# Switch to Node 20
nvm use 20

# Install all workspace dependencies (this takes 3-5 minutes)
pnpm install
```

**What's being installed:**
- 50+ packages across multiple workspaces
- TypeScript, GraphQL, Knex (migrations)
- Testing libraries (Jest)
- ILP protocol implementations

### Step 3: Understand the Local Environment

```bash
cd localenv
ls -la
```

**Key directories:**
- `cloud-nine-wallet/` - Mock ASE #1 (Test wallet provider)
- `happy-life-bank/` - Mock ASE #2 (Another test provider)
- `merged/` - Combined docker-compose configuration
- `tigerbeetle/` - High-performance accounting ledger

### Step 4: Build Docker Images

```bash
# Return to root
cd ..

# Build all images (TAKES 20-30 MINUTES on first run)
pnpm localenv:compose build
```

**What's being built:**
1. `rafiki-backend` - Core Rafiki server
2. `rafiki-auth` - GNAP authorization server
3. `cloud-nine-wallet-backend` - Mock wallet
4. `cloud-nine-auth` - Mock wallet' auth
5. `happy-life-bank-backend` - Second mock wallet
6. `mock-account-servicing-entity` - Test ASE

**Build stages:**
```
[1/6] Installing dependencies...
[2/6] Compiling TypeScript...
[3/6] Generating GraphQL schemas...
[4/6] Building Docker layers...
[5/6] Caching node_modules...
[6/6] Finalizing images...
```

**⚠️ Common Build Issues:**

**Issue 1: "Image already exists"**
```bash
# Solution: Clean Docker cache
docker system prune -a
pnpm localenv:compose build
```

**Issue 2: "Out of memory"**
```bash
# Solution: Increase Docker memory
# Docker Desktop → Settings → Resources → Memory: 4GB+
```

**Issue 3: "pnpm not found"**
```bash
# Solution: Install pnpm globally
npm install -g pnpm@8.15.9
```

### Step 5: Start All Services

```bash
pnpm localenv:compose up -d
```

**Services starting:**
- PostgreSQL (port 5432) - Rafiki data storage
- Redis (port 6379) - Caching layer
- TigerBeetle (port 3000) - Accounting ledger
- Rafiki Backend (port 3001) - GraphQL API
- Rafiki Auth (port 3006) - GNAP server
- Cloud Nine Wallet (port 3030) - Test wallet #1
- Happy Life Bank (port 4430) - Test wallet #2

**Verify all services are running:**
```bash
docker ps

# You should see 7+ containers running
```

### Step 6: Seed Test Data

```bash
# Initialize databases
pnpm localenv:compose:psql

# Seed wallets and payment pointers
pnpm localenv:seed
```

**What gets seeded:**
- 2 test wallets (Cloud Nine, Happy Life Bank)
- Payment pointers for each
- Initial account balances
- Exchange rate data

---

## 🧪 Testing the Setup

### Test 1: Check GraphQL Playground

```bash
# Open in browser:
open http://localhost:3001/graphql
```

**Try this query:**
```graphql
query GetAssets {
  assets {
    edges {
      node {
        id
        code
        scale
      }
    }
  }
}
```

**Expected response:**
```json
{
  "data": {
    "assets": {
      "edges": [
        {
          "node": {
            "id": "...",
            "code": "USD",
            "scale": 2
          }
        }
      ]
    }
  }
}
```

### Test 2: Create a Quote

```bash
# Use Bruno or curl
curl -X POST http://localhost:3000/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "$cloud-nine.example/alice",
    "receiver": "$happy-life.example/bob",
    "sendAmount": {
      "value": "100",
      "assetCode": "USD",
      "assetScale": 2
    }
  }'
```

**Expected response:**
```json
{
  "id": "quote_xyz...",
  "receiveAmount": {
    "value": "12900",
    "assetCode": "KES",
    "assetScale": 2
  },
  "fee": {
    "value": "05",
    "assetCode": "USD"
  }
}
```

### Test 3: Execute a Payment

```bash
curl -X POST http://localhost:3000/outgoing-payments \
  -H "Content-Type": application/json" \
  -d '{
    "walletAddress": "$cloud-nine.example/alice",
    "quoteId": "quote_xyz...",
    "metadata": {
      "description": "Test payment"
    }
  }'
```

---

## 📚 Understanding Rafiki Components

### 1. TigerBeetle (Accounting Ledger)

**Purpose:** Ultra-fast, double-entry accounting

**Why we need it:**
- Tracks all debits/credits
- Ensures zero sum (money can't be created/destroyed)
- Atomic transactions

**Access:**
```bash
# View TigerBeetle logs
docker logs tigerbeetle

# Check balances
docker exec -it tigerbeetle tb query --accounts
```

### 2. Rafiki Backend (GraphQL API)

**Purpose:** Core payment routing logic

**Key responsibilities:**
- Quote generation
- Payment execution
- Webhook management
- Peer management

**API Explorer:**
- GraphQL Playground: http://localhost:3001/graphql
- Admin UI: http://localhost3010

### 3. Rafiki Auth (GNAP Server)

**Purpose:** Grant Negotiation and Authorization Protocol

**What it does:**
- Issues access tokens
- Manages consent flows
- Handles inter-wallet authorization

**Test endpoint:**
```bash
curl http://localhost:3006/.well-known/gnap-as-rs
```

### 4. Mock ASEs (Cloud Nine & Happy Life Bank)

**Purpose:** Simulate real wallet providers

**What they provide:**
- Payment pointers ($wallet.example/user)
- Mock account balances
- Webhook handlers

**Access:**
- Cloud Nine: http://localhost:3030
- Happy Life Bank: http://localhost:4430

---

## 🔧 Advanced Configuration

### Environment Variables

Edit `localenv/.env`:

```bash
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=rafiki
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379

# TigerBeetle
TIGERBEETLE_CLUSTER_ID=1
TIGERBEETLE_REPLICA_ADDRESSES=localhost:3001

# Exchange Rates
EXCHANGE_RATES_URL=https://api.exchangerate-api.com/v4/latest/USD
```

### Custom Docker Compose

Create `localenv/docker-compose.override.yml`:

```yaml
services:
  rafiki-backend:
    environment:
      - LOG_LEVEL=debug
      - ENABLE_TELEMETRY=true
    ports:
      - "3001:3001"
      - "9229:9229"  # Node.js debugger
```

---

## 🐛 Troubleshooting

### Issue: "Port already in use"

**Solution:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>

# Restart Rafiki
pnpm localenv:compose up -d
```

### Issue: "TigerBeetle won't start"

**Solution:**
```bash
# Remove old TigerBeetle data
rm -rf localenv/tigerbeetle/data/*

# Restart
pnpm localenv:compose restart tigerbeetle
```

### Issue: "GraphQL returns 500 errors"

**Check logs:**
```bash
docker logs rafiki-backend --tail=100 -f
```

**Common causes:**
1. Database migrations not run
2. Tigerbeetle not initialized
3. Environment variables missing

**Fix:**
```bash
pnpm localenv:compose down
pnpm localenv:compose:psql  # Re-run migrations
pnpm localenv:seed
pnpm localenv:compose up -d
```

---

## 📖 Integrating with Our Platform

### Update rafiki.service.js

Replace the mock implementation with real Rafiki calls:

```javascript
const axios = require('axios');

class RafikiService {
    constructor() {
        this.rafikiUrl = 'http://localhost:3001/graphql';
        this.walletAddress = process.env.RAFIKI_WALLET_ADDRESS;
    }

    async getQuote(sourceCurrency, targetCurrency, sourceAmount) {
        const mutation = `
            mutation CreateQuote($input: CreateQuoteInput!) {
                createQuote(input: $input) {
                    quote {
                        id
                        receiveAmount {
                            value
                            assetCode
                        }
                        fee {
                            value
                        }
                    }
                }
            }
        `;

        const response = await axios.post(this.rafikiUrl, {
            query: mutation,
            variables: {
                input: {
                    walletAddress: this.walletAddress,
                    receiver: `$happy-life.example/freelancer`,
                    sendAmount: {
                        value: (sourceAmount * 100).toString(),
                        assetCode: sourceCurrency,
                        assetScale: 2
                    }
                }
            }
        });

        const quote = response.data.data.createQuote.quote;
        
        return {
            quoteId: quote.id,
            rate: parseFloat(quote.receiveAmount.value) / (sourceAmount * 100),
            destinationAmount: parseFloat(quote.receiveAmount.value) / 100,
            connectorFee: parseFloat(quote.fee.value) / 100
        };
    }

    async processPayment({ quoteId, description }) {
        const mutation = `
            mutation CreateOutgoingPayment($input: CreateOutgoingPaymentInput!) {
                createOutgoingPayment(input: $input) {
                    payment {
                        id
                        state
                    }
                }
            }
        `;

        const response = await axios.post(this.rafikiUrl, {
            query: mutation,
            variables: {
                input: {
                    walletAddress: this.walletAddress,
                    quoteId,
                    metadata: { description }
                }
            }
        });

        return response.data.data.createOutgoingPayment.payment;
    }
}

module.exports = new RafikiService();
```

---

## 📊 Monitoring & Logs

### View All Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker logs rafiki-backend -f

# Last 100 lines
docker logs rafiki-backend --tail=100
```

### Important Log Locations

- Rafiki Backend: `/var/log/rafiki/backend.log`
- Auth Server: `/var/log/rafiki/auth.log`
- TigerBeetle: `/var/log/tigerbeetle/tb.log`

---

## 🎓 Learning Resources

### Official Documentation
- Rafiki Docs: [rafiki.dev](https://rafiki.dev)
- Interledger Spec: [interledger.org/rfcs](https://interledger.org/rfcs)
- STREAM Protocol: [interledger.org/rfcs/0029-stream](https://interledger.org/rfcs/0029-stream)

### Video Tutorials
- Rafiki Overview: [YouTube - Interledger Foundation](https://youtube.com/@interledgerfoundation)
- ILP Concepts: [YouTube - Adrian Hope-Bailie](https://youtube.com/watch?v=...)

### Community
- Discord: [discord.gg/interledger](https://discord.gg/interledger)
- Forum: [forum.interledger.org](https://forum.interledger.org)

---

## 🚀 Production Deployment

### Using Rafiki in Production

**For production, you need:**

1. **Cloud Infrastructure**
   - AWS/GCP/Azure
   - Kubernetes cluster
   - Managed PostgreSQL
   - Managed Redis

2. **TigerBeetle Cluster**
   - 3+ replicas for HA
   - SSD storage
   - Dedicated network

3. **SSL/TLS**
   - Let's Encrypt certificates
   - Domain: `ilp.yourplatform.com`

4. **Monitoring**
   - Grafana dashboards
   - Prometheus metrics
   - Alert manager

**Deployment script:**
```bash
# Build production images
docker build -t yourregistry/rafiki-backend:latest -f Dockerfile.backend .

# Push to registry
docker push yourregistry/rafiki-backend:latest

# Deploy to Kubernetes
kubectl apply -f k8s/rafiki-deployment.yaml
```

---

## ✅ Checklist: Rafiki Setup Complete

- [ ] Node v20 installed
- [ ] pnpm installed
- [ ] Docker Desktop running
- [ ] Repository cloned
- [ ] Dependencies installed (pnpm install)
- [ ] Docker images built
- [ ] All services running (docker ps shows 7+ containers)
- [ ] GraphQL playground accessible
- [ ] Test quote created successfully
- [ ] Test payment executed
- [ ] Integrated with  platform backend

---

**Congratulations!** You now have a fully functional Interledger node running locally. 🎉

**Next:** Continue to [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) to learn how to deploy your platform to production.
