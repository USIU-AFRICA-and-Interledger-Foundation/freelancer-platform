const express = require('express');
const router = express.Router();
const paymentService = require('../services/payment.service');
const db = require('../db');

// Middleware to verify JWT (simplified)
const auth = (req, res, next) => {
    // In real app: verify jwt from header
    // req.user = decoded;
    next();
};

router.post('/quote', auth, async (req, res) => {
    try {
        const { amount, currency } = req.body;
        const quote = await paymentService.getQuote(currency, 'KES', amount);
        res.json(quote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { clientId, freelancerId, amount, currency, mpesaNumber } = req.body;
        const result = await paymentService.processPayment(clientId, freelancerId, amount, currency, mpesaNumber);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment processing failed' });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        // Mock returning recent transactions
        const result = await db.query('SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10');
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
