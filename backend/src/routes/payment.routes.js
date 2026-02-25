const express = require('express');
const router = express.Router();
const paymentService = require('../services/payment.service');
const db = require('../db');
const { auth, requireRole } = require('../middleware/auth');

router.post('/quote', auth(), requireRole('client'), async (req, res) => {
    try {
        const { amount, currency, targetCurrency } = req.body;
        if (!amount || !currency) {
            return res.status(400).json({ message: 'amount and currency are required' });
        }
        const quote = await paymentService.getQuote(currency, targetCurrency || 'KES', amount);
        res.json(quote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/', auth(), requireRole('client'), async (req, res) => {
    try {
        const { freelancerId, amount, currency, mpesaNumber } = req.body;
        if (!freelancerId || !amount || !currency) {
            return res.status(400).json({ message: 'freelancerId, amount and currency are required' });
        }
        const clientId = req.user.id;
        const result = await paymentService.processPayment(clientId, freelancerId, amount, currency, mpesaNumber);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment processing failed' });
    }
});

router.get('/', auth(), async (req, res) => {
    try {
        const { role, id } = req.user;

        let query = `
      SELECT 
        t.*, 
        c.email AS client_email,
        f.email AS freelancer_email
      FROM transactions t
      LEFT JOIN users c ON t.client_id = c.id
      LEFT JOIN users f ON t.freelancer_id = f.id
    `;
        const params = [];

        if (role === 'client') {
            query += ' WHERE t.client_id = $1';
            params.push(id);
        } else if (role === 'freelancer') {
            query += ' WHERE t.freelancer_id = $1';
            params.push(id);
        } else if (role === 'admin') {
            const { clientId, freelancerId } = req.query;
            if (clientId) {
                params.push(clientId);
                query += ` WHERE t.client_id = $${params.length}`;
            }
            if (freelancerId) {
                params.push(freelancerId);
                query += params.length === 1 ? ` WHERE t.freelancer_id = $${params.length}` : ` AND t.freelancer_id = $${params.length}`;
            }
        }

        query += ' ORDER BY t.created_at DESC LIMIT 50';

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;
