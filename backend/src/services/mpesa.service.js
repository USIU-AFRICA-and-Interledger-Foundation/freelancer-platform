const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

class MpesaService {
    constructor() {
        this.consumerKey = process.env.MPESA_CONSUMER_KEY;
        this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
        this.shortCode = process.env.MPESA_SHORTCODE || '174379';
        this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox'; // sandbox or production

        this.baseUrl = this.environment === 'production'
            ? 'https://api.safaricom.co.ke'
            : 'https://sandbox.safaricom.co.ke';
    }

    async getOAuthToken() {
        const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
        try {
            const response = await axios.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
                headers: {
                    Authorization: `Basic ${auth}`
                }
            });
            return response.data.access_token;
        } catch (error) {
            console.error('M-Pesa Auth Error:', error.response?.data || error.message);
            throw new Error('Failed to authenticate with M-Pesa');
        }
    }

    /**
     * Initiate B2C Payment (Business to Customer)
     * Sends money from the platform's Paybill/Till to the freelancer's phone
     */
    async initiateB2C(amount, phoneNumber, transactionId) {
        const token = await this.getOAuthToken();

        // Format phone number to 254...
        const formattedPhone = phoneNumber.startsWith('0')
            ? `254${phoneNumber.slice(1)}`
            : phoneNumber;

        const payload = {
            InitiatorName: process.env.MPESA_INITIATOR_NAME || 'testapi',
            SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL || 'test', // In prod, this is encrypted
            CommandID: 'BusinessPayment', // or SalaryPymt, PromotionPayment
            Amount: Math.floor(amount), // M-Pesa accepts integers
            PartyA: this.shortCode,
            PartyB: formattedPhone,
            Remarks: `Payment for Transaction ${transactionId}`,
            QueueTimeOutURL: `${process.env.APP_URL}/api/webhooks/mpesa/timeout`,
            ResultURL: `${process.env.APP_URL}/api/webhooks/mpesa/callback`,
            Occasion: 'Freelancer Payment'
        };

        try {
            const response = await axios.post(`${this.baseUrl}/mpesa/b2c/v1/paymentrequest`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('M-Pesa B2C Error:', error.response?.data || error.message);
            throw new Error(`M-Pesa B2C Failed: ${error.response?.data?.errorMessage || error.message}`);
        }
    }
}

module.exports = new MpesaService();
