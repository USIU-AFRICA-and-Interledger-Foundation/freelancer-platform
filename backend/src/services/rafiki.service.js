const axios = require('axios');

class RafikiService {
    constructor() {
        this.wallyUrl = process.env.RAFIKI_WALLET_ADDRESS;
    }

    /**
     * Mock Quote with Fee/Spread Breakdown
     */
    async getQuote(sourceCurrency, destinationCurrency, sourceAmount) {
        // Mock Exchange Rates (Mid-market)
        const midRates = {
            'USD_KES': 129.50,
            'EUR_KES': 140.20,
            'BTC_KES': 8500000,
        };
        const rate = midRates[`${sourceCurrency}_${destinationCurrency}`] || 1;

        // Simulate Spread (e.g. 0.5%)
        const spreadPct = 0.005;
        const effectiveRate = rate * (1 - spreadPct); // Client gets slightly less KES per USD

        // Simulate Connector Interledger Fee (e.g. 0.2% + fixed fee)
        const connectorFeePct = 0.002;
        const connectorFeeFixed = 0.05; // 5 cents
        const connectorFee = (sourceAmount * connectorFeePct) + connectorFeeFixed;

        const destinationAmount = (sourceAmount - connectorFee) * effectiveRate;

        return {
            rate: effectiveRate.toFixed(4),
            midRate: rate,
            spread: (rate - effectiveRate).toFixed(4), // How much rate was shaved off
            connectorFee: connectorFee.toFixed(2),     // ILP Network Fee
            destinationAmount: destinationAmount.toFixed(2)
        };
    }

    /**
     * Simulates sending the payment through Rafiki network
     */
    async processPayment({ sourceAmount, sourceCurrency, destinationCurrency, destinationAccount }) {
        console.log(`[Rafiki] Processing payment: ${sourceAmount} ${sourceCurrency} -> ${destinationCurrency}`);
        await new Promise(resolve => setTimeout(resolve, 800)); // Latency sim

        // In a real app, this calls the Open Payments API to create outgoing payment
        return {
            success: true,
            id: `rafiki-${Date.now()}`
        };
    }
}

module.exports = new RafikiService();
