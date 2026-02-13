# Quick Start Guide - Freelancer Payment Platform

## 🚀 Get Started in 5 Minutes

### Step 1: Prerequisites
Ensure you have installed:
- Docker Desktop (https://www.docker.com/products/docker-desktop/)
- Node.js 18+ (optional, for local development)

### Step 2: Clone or Download
Download the platform code to your machine.

### Step 3: Configure M-Pesa (Sandbox)

1. Go to https://developer.safaricom.co.ke/
2. Create an account
3. Create a new sandbox app
4. Copy your credentials

Edit `backend/.env`:
```env
MPESA_CONSUMER_KEY=your_key_from_daraja
MPESA_CONSUMER_SECRET=your_secret_from_daraja
MPESA_SHORTCODE=174379
```

### Step 4: Start the Platform

```bash
# From the project root directory
docker-compose up -d
```

Wait about 30 seconds for all services to start.

### Step 5: Access the Platform

Open your browser and go to: **http://localhost:3001**

### Step 6: Create Your First Account

1. Click "Register" 
2. Choose "Client" to send payments OR "Freelancer" to receive payments
3. Fill in the form:
   - For freelancers: use M-Pesa number format `254712345678`
4. Click "Register"

### Step 7: Make Your First Payment (as Client)

1. Login with your client account
2. Click "Send Payment"
3. Select a freelancer
4. Enter amount (e.g., 100) and currency (e.g., USD)
5. See the quote showing KES amount freelancer will receive
6. Click "Send Payment"

### Step 8: Check Transaction Status

Go to "Transactions" to see payment status update in real-time:
- `pending` → `processing` → `mpesa_sending` → `completed`

---

## 🎯 What Just Happened?

Your payment went through this flow:
1. **Frontend** sent request to backend
2. **Backend** calculated exchange rate (USD → KES)
3. **Rafiki/ILP** routed payment through Interledger (simulated)
4. **M-Pesa API** sent money to freelancer's M-Pesa account
5. **Callback** updated transaction status to completed

---

## 🔍 Testing

### Sandbox Testing
- Use M-Pesa sandbox credentials
- Test phone: `254708374149`
- No real money is transferred in sandbox mode

### Production Setup
- Get production M-Pesa credentials
- Update `.env` with production values
- Set `MPESA_ENVIRONMENT=production`
- Deploy to cloud (AWS, Google Cloud, etc.)

---

## 📱 User Roles

### Client
- Send payments in any currency
- Browse freelancers
- View transaction history

### Freelancer  
- Receive payments to M-Pesa
- View earnings statistics
- Update profile and M-Pesa number

### Admin (Future)
- View all transactions
- Manage users
- Approve KYC
- Set exchange rates

---

## 🛑 Stopping the Platform

```bash
docker-compose down
```

To remove all data:
```bash
docker-compose down -v
```

---

## 🆘 Need Help?

### Common Issues

**Port already in use?**
```bash
# Change ports in docker-compose.yml
ports:
  - "3002:3000"  # Backend on 3002
  - "3003:3000"  # Frontend on 3003
```

**Database connection failed?**
```bash
# Restart services
docker-compose restart
```

**M-Pesa callback not working?**
- Callbacks require public URL
- For local dev, use ngrok:
```bash
ngrok http 3000
# Update MPESA_CALLBACK_URL in .env
```

---

## 📖 Next Steps

1. **Read the full README.md** for detailed documentation
2. **Explore the code** in `backend/` and `frontend/`
3. **Set up Rafiki** for real ILP routing
4. **Deploy to production** when ready
5. **Apply for M-Pesa production** credentials

---

## 🎓 Learning Resources

- [Interledger Protocol Docs](https://interledger.org/)
- [Rafiki Documentation](https://rafiki.dev/)  
- [M-Pesa Daraja API Guide](https://developer.safaricom.co.ke/)
- Platform code includes extensive comments

---

**Happy Building! 🚀**
