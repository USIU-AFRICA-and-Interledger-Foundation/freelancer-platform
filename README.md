# Freelancer Payment Platform

## Multi-Currency to M-Pesa Payments via Interledger Protocol

A complete payment platform that enables clients worldwide to pay Kenyan freelancers using any currency (USD, BTC, EUR, etc.) with automatic conversion and delivery to M-Pesa accounts, powered by Interledger Protocol and Rafiki.

---

## 🌟 Features

- **Multi-Currency Support**: Accept payments in USD, EUR, GBP, BTC, ETH, and more
- **Interledger Protocol Integration**: Efficient cross-ledger routing using ILP/Rafiki
- **M-Pesa Integration**: Direct disbursement to Kenyan mobile money accounts
- **Real-time Exchange Rates**: Automatic currency conversion at market rates
- **Transparent Fees**: Clear fee structure with no hidden charges
- **Secure Transactions**: Industry-standard encryption and authentication
- **User-Friendly Interface**: Simple, intuitive dashboard for clients and freelancers
- **Transaction History**: Complete audit trail of all payments
- **Role-Based Access**: Separate interfaces for clients, freelancers, and admins

---

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Node.js with Express
- PostgreSQL database (Neon Serverless)
- Rafiki for ILP integration
- M-Pesa Daraja API
- JWT authentication

**Frontend:**
- Next.js 14+ (App Router)
- React
- Tailwind CSS
- Lucide React Icons
- Axios

**Infrastructure:**
- Local Node.js Runtime (No Docker required)
- Neon PostgreSQL

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** installed locally
- **Neon Account**: PostgreSQL connection string
- **M-Pesa Daraja API credentials** (sandbox or production)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/freelancer-payment-platform.git
cd freelancer-payment-platform
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Configure Environment Variables**
Create `backend/.env` with:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@neon-hostname/neondb?sslmode=require
JWT_SECRET=your_super_secret_jwt_key
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
```

4. **Run Database Migrations**
```bash
npm run migrate
```

5. **Start Backend Server**
```bash
npm run dev
# Server runs on http://localhost:3001
```

6. **Frontend Setup**
Open a new terminal:
```bash
cd frontend
npm install
```

7. **Configure Frontend Environment**
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

8. **Start Frontend Application**
```bash
npm run dev
# App runs on http://localhost:3000
```

---

## 📖 Usage Guide

1. **Access the Platform**: Go to http://localhost:3000
2. **Register**: Create an account as a Client or Freelancer.
3. **Dashboard**: View your balance and transaction history.
4. **Send Payment**: Click "New Payment" to initiate a transfer to a freelancer's M-Pesa number.

---

## 🔧 Configuration

### Database (Neon)
Currently configured to use Neon serverless PostgreSQL. Ensure your `DATABASE_URL` in `.env` is correct.

### M-Pesa Setup
Standard Daraja API credentials are required. See [Safaricom Developer Portal](https://developer.safaricom.co.ke/).

---

**Built with ❤️ for the global freelance community**
