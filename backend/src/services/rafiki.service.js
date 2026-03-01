const axios = require('axios');

class RafikiService {
    constructor() {
        this.mode = (process.env.RAFIKI_MODE || 'mock').toLowerCase(); // 'mock' | 'live'
        this.backendUrl = process.env.RAFIKI_BACKEND_URL;
        this.authUrl = process.env.RAFIKI_AUTH_URL;
        this.walletAddressUrl = process.env.RAFIKI_WALLET_ADDRESS_URL;
    }

    async getQuote(sourceCurrency, destinationCurrency, sourceAmount) {
        if (this.mode === 'live') {
            return this.getLiveQuote(sourceCurrency, destinationCurrency, sourceAmount);
        }
        return this.getMockQuote(sourceCurrency, destinationCurrency, sourceAmount);
    }

    async processPayment({ sourceAmount, sourceCurrency, destinationCurrency, destinationAccount }) {
        if (this.mode === 'live') {
            return this.processLivePayment({ sourceAmount, sourceCurrency, destinationCurrency, destinationAccount });
        }
        return this.processMockPayment({ sourceAmount, sourceCurrency, destinationCurrency, destinationAccount });
    }

    /**
     * Mock Quote with Fee/Spread Breakdown
     */
    async getMockQuote(sourceCurrency, destinationCurrency, sourceAmount) {
        const midRates = {
            USD_KES: 129.5,
            EUR_KES: 140.2,
            BTC_KES: 8500000
        };
        const midRate = midRates[`${sourceCurrency}_${destinationCurrency}`] || 1;

        const spreadPct = 0.005;
        const effectiveRate = midRate * (1 - spreadPct);

        const connectorFeePct = 0.002;
        let connectorFeeFixed = 0.05;
        if (sourceCurrency === 'BTC') connectorFeeFixed = 0.000001;
        if (sourceCurrency === 'ETH') connectorFeeFixed = 0.00001;

        const connectorFee = sourceAmount * connectorFeePct + connectorFeeFixed;

        let destinationAmount = (sourceAmount - connectorFee) * effectiveRate;
        if (destinationAmount < 0) destinationAmount = 0;

        return {
            rate: effectiveRate,
            midRate,
            spread: midRate - effectiveRate,
            connectorFee,
            destinationAmount
        };
    }

    /**
     * Simulated network payment
     */
    async processMockPayment({ sourceAmount, sourceCurrency, destinationCurrency }) {
        console.log(`[Rafiki] (mock) Processing payment: ${sourceAmount} ${sourceCurrency} -> ${destinationCurrency}`);
        await new Promise((resolve) => setTimeout(resolve, 800));
        return {
            success: true,
            id: `rafiki-${Date.now()}`
        };
    }

    /**
     * Placeholder for real Rafiki/Open Payments quote call.
     * This is intentionally minimal but wired for future expansion.
     */
    async getLiveQuote(sourceCurrency, destinationCurrency, sourceAmount) {
        if (!this.backendUrl) {
            throw new Error('RAFIKI_BACKEND_URL is not configured for live mode.');
        }

        try {
            // This is a placeholder; in a real integration you would use Rafiki's GraphQL/Open Payments APIs.
            const response = await axios.post(`${this.backendUrl}/quotes`, {
                sourceCurrency,
                destinationCurrency,
                sourceAmount
            });
            const data = response.data;
            return {
                rate: data.effectiveRate,
                midRate: data.midRate || data.effectiveRate,
                spread: data.spread || 0,
                connectorFee: data.connectorFee || 0,
                destinationAmount: data.destinationAmount
            };
        } catch (err) {
            console.error('Rafiki live quote error:', err.response?.data || err.message);
            throw new Error('Failed to retrieve quote from Rafiki');
        }
    }

    /**
     * Placeholder for real Rafiki/Open Payments payment call.
     */
    async processLivePayment({ sourceAmount, sourceCurrency, destinationCurrency, destinationAccount }) {
        if (!this.backendUrl) {
            throw new Error('RAFIKI_BACKEND_URL is not configured for live mode.');
        }

        try {
            const response = await axios.post(`${this.backendUrl}/payments`, {
                sourceAmount,
                sourceCurrency,
                destinationCurrency,
                destinationAccount
            });
            return {
                success: true,
                id: response.data.id
            };
        } catch (err) {
            console.error('Rafiki live payment error:', err.response?.data || err.message);
            throw new Error('Failed to process payment via Rafiki');
        }
    }
}

module.exports = new RafikiService();
