'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchFreelancers, getQuote, createPayment } from '../../../../lib/api';

export default function ClientSendPaymentPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [loadingFreelancers, setLoadingFreelancers] = useState(true);

  const [freelancerId, setFreelancerId] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('100');
  const [mpesaNumber, setMpesaNumber] = useState('');

  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchFreelancers();
        setFreelancers(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load freelancers');
      } finally {
        setLoadingFreelancers(false);
      }
    }
    load();
  }, []);

  async function refreshQuote() {
    if (!amount || Number(amount) <= 0) return;
    setQuoteLoading(true);
    setError('');
    try {
      const res = await getQuote({ amount: Number(amount), currency, targetCurrency: 'KES' });
      setQuote(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch quote');
    } finally {
      setQuoteLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const res = await createPayment({
        freelancerId,
        amount: Number(amount),
        currency,
        mpesaNumber: mpesaNumber || undefined
      });
      setSuccess(`Payment submitted. Transaction ID: ${res.data.transactionId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Send Payment</h1>
          <p className="text-sm text-muted">
            Pay a freelancer in your currency and we&apos;ll handle the conversion to M-Pesa KES.
          </p>
        </div>
        <Link href="/dashboard/client" className="btn btn-ghost text-xs">
          Back to overview
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label" htmlFor="freelancer">
                Freelancer
              </label>
              <select
                id="freelancer"
                className="form-input"
                value={freelancerId}
                onChange={(e) => setFreelancerId(e.target.value)}
                required
              >
                <option value="">{loadingFreelancers ? 'Loading…' : 'Select a freelancer'}</option>
                {freelancers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name || f.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="form-label" htmlFor="amount">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onBlur={refreshQuote}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="currency">
                  Currency
                </label>
                <select
                  id="currency"
                  className="form-input"
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    void refreshQuote();
                  }}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="BTC">BTC</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mpesa">
                Override M-Pesa number (optional)
              </label>
              <input
                id="mpesa"
                type="tel"
                className="form-input"
                placeholder="+2547..."
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
              />
              <span className="text-xs text-muted">
                Leave empty to use the freelancer&apos;s default M-Pesa number.
              </span>
            </div>

            {error && <span className="form-error">{error}</span>}
            {success && <span className="text-xs text-emerald-400">{success}</span>}

            <button
              type="submit"
              className="btn btn-glow w-full mt-2"
              disabled={submitting || !freelancerId}
            >
              {submitting ? 'Processing…' : 'Send Payment'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Quote details</h2>
          {quoteLoading && <p className="text-sm text-muted">Fetching latest quote…</p>}
          {!quote && !quoteLoading && (
            <p className="text-sm text-muted">
              Enter an amount to see the estimated KES to your freelancer, including all fees.
            </p>
          )}

          {quote && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">You send</span>
                <span className="font-medium">
                  {quote.sourceAmount} {quote.sourceCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Estimated to freelancer</span>
                <span className="font-semibold text-emerald-400">
                  {quote.destinationAmount} {quote.targetCurrency}
                </span>
              </div>
              <div className="border-t border-white/5 pt-2 mt-2 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted">Exchange rate</span>
                  <span>{quote.exchangeRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">ILP network fee</span>
                  <span>
                    {quote.connectorFee} {quote.sourceCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Platform fee</span>
                  <span>
                    {quote.platformFee} {quote.sourceCurrency}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { CreditCard, ArrowRight, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

export default function PaymentForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        freelancerId: '1',
        amount: '',
        currency: 'USD',
        description: '',
    });

    const [quote, setQuote] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Mock calculation
    const getQuote = (e) => {
        e.preventDefault();
        setIsCalculating(true);

        // Simulate API delay
        setTimeout(() => {
            const amount = parseFloat(formData.amount);
            const rates = { USD: 150.5, EUR: 158.2, GBP: 182.1, BTC: 4500000, KES: 1 };
            const rate = rates[formData.currency] || 150.5;

            const convertedTotal = amount * rate;
            const platformFee = convertedTotal * 0.025; // 2.5% fee
            const mpesaPayout = convertedTotal - platformFee;

            setQuote({
                sendAmount: amount,
                sendCurrency: formData.currency,
                exchangeRate: rate,
                platformFeeKes: platformFee,
                freelancerReceivesKes: mpesaPayout,
                estimatedTime: '~ 5 minutes',
            });
            setIsCalculating(false);
            setStep(2);
        }, 1200);
    };

    const handlePayment = () => {
        setIsCalculating(true);
        // Simulate blockchain/network processing
        setTimeout(() => {
            setStep(3);
            setIsCalculating(false);
        }, 2000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -z-10 -translate-y-1/2" />
                <div
                    className="absolute top-1/2 left-0 h-[2px] bg-emerald-500 -z-10 -translate-y-1/2 transition-all duration-500"
                    style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                />

                {['Details', 'Review Quote', 'Confirmation'].map((label, i) => {
                    const s = i + 1;
                    const isActive = step >= s;
                    const isCurrent = step === s;

                    return (
                        <div key={s} className="flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isActive
                                    ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                    : 'bg-slate-800 text-slate-500 border border-white/10'
                                }`}>
                                {isActive && s < step ? <ShieldCheck size={16} /> : s}
                            </div>
                            <span className={`text-xs font-medium ${isCurrent ? 'text-emerald-400' : isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="card overflow-hidden relative">
                {isCalculating && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in">
                        <RefreshCw size={32} className="text-emerald-500 animate-spin mb-4" />
                        <p className="font-medium text-lg">
                            {step === 1 ? 'Negotiating best route...' : 'Processing through Rafiki...'}
                        </p>
                        <p className="text-sm text-slate-400 mt-2">
                            Interledger Protocol
                        </p>
                    </div>
                )}

                {/* Step 1: Input Details */}
                {step === 1 && (
                    <div className="animate-fade-in">
                        <div className="mb-6 pb-6 border-b border-white/10">
                            <h2 className="text-xl font-bold mb-2">Payment Details</h2>
                            <p className="text-slate-400 text-sm">Initiate a secure ILP payment directly to a freelancer's M-Pesa account.</p>
                        </div>

                        <form onSubmit={getQuote} className="space-y-5">
                            <div className="form-group">
                                <label className="form-label" htmlFor="freelancer">Select Freelancer</label>
                                <select
                                    id="freelancer"
                                    className="form-input appearance-none bg-slate-900 border-white/10"
                                    value={formData.freelancerId}
                                    onChange={(e) => setFormData({ ...formData, freelancerId: e.target.value })}
                                >
                                    <option value="1">Alex Kariuki (+254 712 *** 678)</option>
                                    <option value="2">Grace Njuguna (+254 722 *** 678)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="form-group col-span-2">
                                    <label className="form-label" htmlFor="amount">Amount to Send</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                                        <input
                                            type="number"
                                            id="amount"
                                            min="1"
                                            step="0.01"
                                            className="form-input pl-8 text-lg font-medium"
                                            placeholder="0.00"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="currency">Currency</label>
                                    <select
                                        id="currency"
                                        className="form-input bg-slate-900 border-white/10 h-[46px]"
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    >
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                        <option value="BTC">BTC</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="desc">Payment Description (Optional)</label>
                                <input
                                    type="text"
                                    id="desc"
                                    className="form-input"
                                    placeholder="e.g., September Invoice #INV-102"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-full mt-6 py-3 text-lg group">
                                Continue to Quote
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Quote Review */}
                {step === 2 && quote && (
                    <div className="animate-fade-in">
                        <div className="mb-6 pb-6 border-b border-white/10 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-2">Review Payment Quote</h2>
                                <p className="text-slate-400 text-sm">Transparent fees, real-time rates.</p>
                            </div>
                            <button
                                onClick={() => setStep(1)}
                                className="text-sm text-blue-400 hover:text-blue-300"
                            >
                                Edit
                            </button>
                        </div>

                        <div className="bg-black/30 rounded-xl p-6 border border-white/5 space-y-4 mb-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px]" />

                            <div className="flex justify-between items-center text-lg">
                                <span className="text-slate-400">You Send</span>
                                <span className="font-bold">{quote.sendAmount.toFixed(2)} {quote.sendCurrency}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm border-t border-b border-white/5 py-4 my-4">
                                <div className="space-y-2">
                                    <p className="text-slate-400">Exchange Rate</p>
                                    <p className="text-slate-400">Platform Fee (2.5%)</p>
                                    <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
                                        <ShieldCheck size={12} className="text-emerald-500" />
                                        Guaranteed Rate via ILP
                                    </p>
                                </div>
                                <div className="space-y-2 text-right">
                                    <p className="font-mono">1 {quote.sendCurrency} = {quote.exchangeRate.toFixed(2)} KES</p>
                                    <p className="text-red-400">-{quote.platformFeeKes.toFixed(2)} KES</p>
                                    <p className="text-slate-500 text-xs mt-2">{quote.estimatedTime}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-slate-400 block mb-1">Freelancer Receives (M-Pesa)</span>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs text-emerald-500 font-medium">Instant Payout</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-emerald-400 tracking-tight">
                                        {quote.freelancerReceivesKes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span className="text-xl block text-emerald-400/70">KES</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200/80 text-sm mb-6">
                            <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-500" />
                            <p>Once initiated, ILP payments are non-reversible. Please ensure the freelancer details are correct.</p>
                        </div>

                        <button onClick={handlePayment} className="btn btn-success w-full py-3 text-lg btn-glow">
                            Confirm & Pay
                        </button>
                    </div>
                )}

                {/* Step 3: Success Confirmation */}
                {step === 3 && (
                    <div className="text-center py-8 animate-fade-in stagger-1">
                        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/50 animate-ping opacity-75" />
                            <ShieldCheck size={40} className="text-emerald-500" />
                        </div>

                        <h2 className="text-3xl font-bold mb-3 text-white">Payment Sent!</h2>
                        <p className="text-slate-400 max-w-sm mx-auto mb-8">
                            Your payment of <strong className="text-white">{formData.amount} {formData.currency}</strong> has been successfully routed through Rafiki to Alex's M-Pesa account.
                        </p>

                        <div className="bg-black/20 rounded-lg p-4 border border-white/5 inline-flex flex-col items-center gap-1 mb-8">
                            <span className="text-xs text-slate-500 uppercase tracking-widest">Transaction Ref</span>
                            <code className="text-emerald-400 font-mono">RFK-8X9P-V2M1</code>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => { setStep(1); setFormData({ ...formData, amount: '' }); }}
                                className="btn btn-primary"
                            >
                                Send Another
                            </button>
                            <Link href="/dashboard/client/history" className="btn btn-outline">
                                View History
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
