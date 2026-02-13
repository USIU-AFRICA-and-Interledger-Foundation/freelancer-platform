const db = require('../db');
const rafikiService = require('./rafiki.service');
const mpesaService = require('./mpesa.service');

class PaymentService {
    /**
     * Calculate a quote for a payment
     */
    async getQuote(sourceCurrency, targetCurrency, sourceAmount) {
        if (targetCurrency !== 'KES') {
            throw new Error('Only KES payouts are supported freely at this time.');
        }

        // Get Quote from Rafiki (includes Network Fee & Spread)
        const rafikiQuote = await rafikiService.getQuote(sourceCurrency, targetCurrency, sourceAmount);

        // Platform Fee (Our Revenue) - e.g. 1%
        const platformFeePct = 0.01;
        const platformFee = sourceAmount * platformFeePct;

        return {
            sourceCurrency,
            targetCurrency,
            sourceAmount,
            exchangeRate: rafikiQuote.rate,
            spread: rafikiQuote.spread,
            connectorFee: rafikiQuote.connectorFee, // Fee charged by ILP Connector
            platformFee: platformFee.toFixed(2),    // Fee charged by Us
            destinationAmount: (rafikiQuote.destinationAmount - (platformFee * rafikiQuote.rate)).toFixed(2),
            breakdown: {
                midRate: rafikiQuote.midRate,
                spreadAmount: rafikiQuote.spread,
                connectorFee: rafikiQuote.connectorFee,
                platformFee: platformFee.toFixed(2)
            }
        };
    }

    /**
     * Process a payment from Client to Freelancer
     */
    async processPayment(clientId, freelancerId, amount, currency, mpesaNumber) {
        // 1. Transaction Record (Pending)
        const client = await db.query('SELECT * FROM users WHERE id = $1', [clientId]);

        // 2. Connector/Rafiki Handling (Asset Transfer + Exchange)
        // We assume the Client pays 'currency' (e.g. USD) and we need to deliver KES
        const quote = await this.getQuote(currency, 'KES', amount);

        const trxResult = await db.query(
            `INSERT INTO transactions 
      (client_id, freelancer_id, source_amount, source_currency, destination_amount, destination_currency, exchange_rate, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'processing')
      RETURNING id`,
            [clientId, freelancerId, amount, currency, quote.destinationAmount, 'KES', quote.rate]
        );
        const transactionId = trxResult.rows[0].id;

        try {
            // 3. Rafiki Transfer (Mock)
            // In reality: Check client balance, lock funds, execute ILP packet
            const rafikiResult = await rafikiService.processPayment({
                sourceAmount: amount,
                sourceCurrency: currency,
                destinationCurrency: 'KES',
                destinationAccount: mpesaNumber
            });

            // 4. M-Pesa Disbursement (B2C)
            // Now that we "have" the KES from the connector, we send it to M-Pesa
            const mpesaResult = await mpesaService.initiateB2C(
                Math.floor(quote.destinationAmount), // M-Pesa needs integer for B2C usually, or 2 decimal check
                mpesaNumber,
                transactionId
            );

            // 5. Update Transaction
            await db.query(
                `UPDATE transactions 
         SET status = 'completed', 
             mpesa_transaction_id = $1, 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
                [mpesaResult.ConversationID, transactionId] // In sandbox this is usually the ID we get
            );

            return {
                status: 'success',
                transactionId,
                message: 'Payment processed and sent to M-Pesa'
            };

        } catch (error) {
            console.error('Payment Processing Failed:', error);
            await db.query(
                `UPDATE transactions SET status = 'failed', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
                [transactionId]
            );
            throw error;
        }
    }
}

module.exports = new PaymentService();
