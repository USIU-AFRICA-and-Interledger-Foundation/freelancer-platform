'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Users, CreditCard, Activity } from 'lucide-react';
import { fetchTransactions, getQuote } from '../../../lib/api';

export default function ClientDashboard() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [quoteAmount, setQuoteAmount] = useState('100');
    const [quoteCurrency, setQuoteCurrency] = useState('USD');
    const [quote, setQuote] = useState(null);
    const [quoteLoading, setQuoteLoading] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetchTransactions();
                setTransactions(res.data || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load transactions');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const stats = useMemo(() => {
        if (!transactions.length) {
            return [
                { title: 'Total Spent', value: '$0.00', change: '', isPositive: true, icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { title: 'Active Freelancers', value: '0', change: '', isPositive: true, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { title: 'Transactions (30d)', value: '0', change: '', isPositive: true, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            ];
        }

        const totalSpent = transactions.reduce((sum, t) => sum + Number(t.source_amount || 0), 0);
        const uniqueFreelancers = new Set(transactions.map(t => t.freelancer_id)).size;
        const last30Days = transactions.filter(t => {
            const created = new Date(t.created_at);
            const diff = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
            return diff <= 30;
        }).length;

        return [
            { title: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, change: '', isPositive: true, icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { title: 'Active Freelancers', value: String(uniqueFreelancers), change: '', isPositive: true, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { title: 'Transactions (30d)', value: String(last30Days), change: '', isPositive: true, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ];
    }, [transactions]);

    const recentTransactions = (transactions || []).slice(0, 5).map((t) => ({
        id: t.id,
        freelancer: t.freelancer_email || 'Freelancer',
        amount: t.source_amount,
        currency: t.source_currency,
        status: t.status,
        date: new Date(t.created_at).toLocaleDateString(),
    }));

    async function handleQuote(e) {
        e?.preventDefault();
        setQuoteLoading(true);
        setError('');
        try {
            const res = await getQuote({ amount: Number(quoteAmount), currency: quoteCurrency, targetCurrency: 'KES' });
            setQuote(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch quote');
        } finally {
            setQuoteLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="card p-5 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                    <Icon size={20} />
                                </div>
                                <div className="flex items-center gap-1 text-sm font-medium">
                                    <span className={stat.isPositive ? 'text-emerald-400' : 'text-red-400'}>
                                        {stat.change}
                                    </span>
                                    {stat.isPositive ?
                                        <ArrowUpRight size={16} className="text-emerald-400" /> :
                                        <ArrowDownRight size={16} className="text-red-400" />
                                    }
                                </div>
                            </div>
                            <h3 className="text-sm font-medium text-slate-400 mb-1">{stat.title}</h3>
                            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions */}
                    <div className="card animate-fade-in stagger-3">
                        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/dashboard/client/pay" className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-transparent hover:border-emerald-500/30 transition-all group">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <CreditCard size={24} />
                                </div>
                                <span className="font-medium text-emerald-100">Send Payment</span>
                            </Link>

                            <Link href="/dashboard/client/freelancers" className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent hover:border-blue-500/30 transition-all group">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users size={24} />
                                </div>
                                <span className="font-medium text-blue-100">Find Freelancers</span>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Transactions Table */}
                    <div className="card animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">Recent Transactions</h2>
                            <Link href="/dashboard/client/history" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-400 uppercase bg-black/20">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Freelancer</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3 rounded-tr-lg">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading && (
                                        <tr>
                                            <td className="px-4 py-3 text-sm text-slate-400" colSpan={4}>
                                                Loading recent transactions…
                                            </td>
                                        </tr>
                                    )}
                                    {!loading && !recentTransactions.length && (
                                        <tr>
                                            <td className="px-4 py-3 text-sm text-slate-400" colSpan={4}>
                                                No transactions yet. Start by sending your first payment.
                                            </td>
                                        </tr>
                                    )}
                                    {recentTransactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs border border-white/10">
                                                        {tx.freelancer.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-slate-200">{tx.freelancer}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {tx.amount} <span className="text-slate-500 text-xs ml-1">{tx.currency}</span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-400">{tx.date}</td>
                                            <td className="px-4 py-3">
                                                <span className={`badge ${tx.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    {/* Active Integrations */}
                    <div className="card animate-fade-in" style={{ animationDelay: '500ms' }}>
                        <h2 className="text-lg font-semibold mb-4">Interledger Status</h2>
                        <div className="p-4 rounded-lg bg-black/20 border border-white/5 flex items-center gap-4">
                            <div className="relative">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                                <div className="absolute top-0 left-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-emerald-400">Rafiki Node Active</p>
                                <p className="text-xs text-slate-500">Connected to ILP Network</p>
                            </div>
                        </div>
                    </div>

                    {/* Live Quote Preview */}
                    <div className="card animate-fade-in" style={{ animationDelay: '600ms' }}>
                        <h2 className="text-lg font-semibold mb-4">Live Quote Preview</h2>
                        <form onSubmit={handleQuote} className="space-y-3 mb-4">
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="form-input"
                                    value={quoteAmount}
                                    onChange={(e) => setQuoteAmount(e.target.value)}
                                />
                                <select
                                    className="form-input"
                                    value={quoteCurrency}
                                    onChange={(e) => setQuoteCurrency(e.target.value)}
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="BTC">BTC</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-outline w-full text-xs"
                                disabled={quoteLoading}
                            >
                                {quoteLoading ? 'Fetching quote…' : 'Get live quote'}
                            </button>
                        </form>

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
        </div>
    );
}
