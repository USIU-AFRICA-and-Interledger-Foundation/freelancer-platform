const express = require('express');
const router = express.Router();
const db = require('../db');

// M-Pesa B2C Result callback
router.post('/mpesa/callback', async (req, res) => {
    try {
        const body = req.body;
        const result = body.Result || body.Body?.stkCallback || {};

        const resultCode = result.ResultCode ?? result.resultCode ?? null;
        const resultDesc = result.ResultDesc ?? result.resultDesc ?? null;

        const transactionId = result.ReferenceData?.ReferenceItem?.Value || result.OriginatorConversationID || null;

        let mpesaReceipt = null;
        let transactionDate = null;
        let phoneNumber = null;
        let amount = null;

        const items = result.ResultParameters?.ResultParameter || [];
        if (Array.isArray(items)) {
            for (const item of items) {
                if (item.Key === 'TransactionReceipt') {
                    mpesaReceipt = item.Value;
                }
                if (item.Key === 'TransactionCompletedDateTime') {
                    transactionDate = item.Value;
                }
                if (item.Key === 'ReceiverPartyPublicName') {
                    phoneNumber = item.Value;
                }
                if (item.Key === 'Amount') {
                    amount = item.Value;
                }
            }
        }

        let transactionRow = null;
        if (transactionId) {
            const trxRes = await db.query('SELECT id FROM transactions WHERE id = $1 OR mpesa_transaction_id = $1', [
                transactionId
            ]);
            transactionRow = trxRes.rows[0] || null;
        }

        const linkedTransactionId = transactionRow ? transactionRow.id : null;

        if (linkedTransactionId) {
            await db.query(
                `INSERT INTO mpesa_callbacks 
         (transaction_id, result_code, result_desc, mpesa_receipt, transaction_date, phone_number, amount, raw_data)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [linkedTransactionId, resultCode, resultDesc, mpesaReceipt, transactionDate, phoneNumber, amount, body]
            );

            const newStatus = resultCode === 0 ? 'completed' : 'failed';
            await db.query(
                `UPDATE transactions 
         SET status = $1,
             mpesa_receipt = COALESCE($2, mpesa_receipt),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
                [newStatus, mpesaReceipt, linkedTransactionId]
            );
        }

        return res.json({ resultCode: 0, resultDesc: 'Received' });
    } catch (err) {
        console.error('M-Pesa callback error:', err);
        return res.status(500).json({ resultCode: 1, resultDesc: 'Internal error' });
    }
});

// M-Pesa timeout callback
router.post('/mpesa/timeout', async (req, res) => {
    try {
        const body = req.body;
        const transactionId =
            body.OriginatorConversationID || body.ConversationID || body.transactionId || null;

        if (transactionId) {
            const trxRes = await db.query('SELECT id FROM transactions WHERE id = $1 OR mpesa_transaction_id = $1', [
                transactionId
            ]);
            const row = trxRes.rows[0];
            if (row) {
                await db.query(
                    `UPDATE transactions 
           SET status = 'failed',
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
                    [row.id]
                );
            }
        }

        return res.json({ resultCode: 0, resultDesc: 'Timeout received' });
    } catch (err) {
        console.error('M-Pesa timeout error:', err);
        return res.status(500).json({ resultCode: 1, resultDesc: 'Internal error' });
    }
});

module.exports = router;

