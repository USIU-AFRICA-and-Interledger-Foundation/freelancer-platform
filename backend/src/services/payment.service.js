const db = require('../db');
const rafikiService = require('./rafiki.service');
const mpesaService = require('./mpesa.service');

class PaymentService {
    /**
     * Calculate a quote for a payment
     */
    async getQuote(sourceCurrency, targetCurrency, sourceAmount) {
        const numericSourceAmount = Number(sourceAmount);
        if (Number.isNaN(numericSourceAmount) || numericSourceAmount <= 0) {
            throw new Error('Source amount must be a positive number.');
        }

        if (targetCurrency !== 'KES') {
            throw new Error('Only KES payouts are supported freely at this time.');
        }

        // Get Quote from Rafiki (includes Network Fee & Spread)
        const rafikiQuote = await rafikiService.getQuote(sourceCurrency, targetCurrency, numericSourceAmount);

        // Ensure we are working with numbers (rafiki may format values)
        const rate = Number(rafikiQuote.rate);
        const midRate = Number(rafikiQuote.midRate ?? rate);
        const spread = Number(rafikiQuote.spread ?? (midRate - rate));
        const ilpFee = Number(rafikiQuote.connectorFee ?? 0);
        const destinationAmountGross = Number(rafikiQuote.destinationAmount);

        if ([rate, destinationAmountGross].some((v) => Number.isNaN(v))) {
            throw new Error('Invalid quote returned from Rafiki.');
        }

        // Platform Fee (Our Revenue) - from env percentage, default 1%
        const platformFeePercent = Number(process.env.PLATFORM_FEE_PERCENTAGE || '1');
        const platformFee = (numericSourceAmount * platformFeePercent) / 100;

        // Convert platform fee into destination currency using the effective rate
        const platformFeeInDestination = platformFee * rate;
        const destinationAmountNet = destinationAmountGross - platformFeeInDestination;

        const totalFeesSource = platformFee + ilpFee;

        return {
            sourceCurrency,
            targetCurrency,
            sourceAmount: numericSourceAmount,
            exchangeRate: Number(rate.toFixed(6)),
            destinationAmount: Number(destinationAmountNet.toFixed(2)),
            destinationAmountGross: Number(destinationAmountGross.toFixed(2)),
            spread: Number(spread.toFixed(6)),
            connectorFee: Number(ilpFee.toFixed(4)), // Fee charged by ILP Connector (source currency)
            platformFee: Number(platformFee.toFixed(4)), // Fee charged by Us (source currency)
            totalFeesSource: Number(totalFeesSource.toFixed(4)),
            breakdown: {
                midRate: Number(midRate.toFixed(6)),
                spreadAmount: Number(spread.toFixed(6)),
                connectorFeeSourceCurrency: Number(ilpFee.toFixed(4)),
                platformFeeSourceCurrency: Number(platformFee.toFixed(4)),
                platformFeeInDestination: Number(platformFeeInDestination.toFixed(2))
            }
        };
    }

    /**
     * Process a payment from Client to Freelancer
     */
    async processPayment(clientId, freelancerId, amount, currency, mpesaNumber) {
        const numericAmount = Number(amount);
        if (Number.isNaN(numericAmount) || numericAmount <= 0) {
            throw new Error('Amount must be a positive number.');
        }

        // 1. Get Freelancer M-Pesa Number if not provided
        let targetPhone = mpesaNumber;
        if (!targetPhone) {
            const freelancerProfile = await db.query(
                'SELECT mpesa_phone FROM freelancer_profiles WHERE user_id = $1',
                [freelancerId]
            );
            if (freelancerProfile.rows.length === 0 || !freelancerProfile.rows[0].mpesa_phone) {
                throw new Error('Freelancer has no M-Pesa number registered.');
            }
            targetPhone = freelancerProfile.rows[0].mpesa_phone;
        }

        // 2. Connector/Rafiki Handling (Asset Transfer + Exchange)
        // We assume the Client pays 'currency' (e.g. USD) and we need to deliver KES
        const quote = await this.getQuote(currency, 'KES', numericAmount);

        const trxResult = await db.query(
            `INSERT INTO transactions 
      (client_id, freelancer_id, source_amount, source_currency, destination_amount, destination_currency, exchange_rate, platform_fee, ilp_fee, total_fees, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'processing')
      RETURNING id`,
            [
                clientId,
                freelancerId,
                numericAmount,
                currency,
                quote.destinationAmount,
                'KES',
                quote.exchangeRate,
                quote.platformFee,
                quote.connectorFee,
                quote.totalFeesSource
            ]
        );
        const transactionId = trxResult.rows[0].id;

        try {
            // 3. Rafiki Transfer (Mock)
            // In reality: Check client balance, lock funds, execute ILP packet
            const rafikiResult = await rafikiService.processPayment({
                sourceAmount: numericAmount,
                sourceCurrency: currency,
                destinationCurrency: 'KES',
                destinationAccount: mpesaNumber
            });

            // 4. M-Pesa Disbursement (B2C)
            // Now that we "have" the KES from the connector, we send it to M-Pesa
            const mpesaResult = await mpesaService.initiateB2C(
                Math.floor(quote.destinationAmount),
                targetPhone,
                transactionId
            );

            // 5. Update Transaction
            await db.query(
                `UPDATE transactions 
         SET status = 'completed', 
             mpesa_transaction_id = $1,
             rafiki_payment_id = $2,
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3`,
                [
                    mpesaResult.ConversationID || mpesaResult.ConversationID || null,
                    rafikiResult.id || null,
                    transactionId
                ]
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
