'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, DollarSign, Activity, Download } from 'lucide-react';
import { fetchTransactions, fetchCurrentUser } from '../../../lib/api';

export default function FreelancerDashboard() {
    const [transactions, setTransactions] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const [trxRes, meRes] = await Promise.all([
                    fetchTransactions(),
                    fetchCurrentUser()
                ]);
                setTransactions(trxRes.data || []);
                setProfile(meRes.data.profile || null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const earningsStats = useMemo(() => {
        if (!transactions.length) {
            return {
                total: 0,
                pending: 0
            };
        }
        const completed = transactions.filter((t) => t.status === 'completed');
        const pending = transactions.filter((t) => t.status === 'processing' || t.status === 'pending');
        const total = completed.reduce((sum, t) => sum + Number(t.destination_amount || 0), 0);
        const pendingAmount = pending.reduce((sum, t) => sum + Number(t.destination_amount || 0), 0);
        return { total, pending: pendingAmount };
    }, [transactions]);

    const stats = [
        {
            title: 'Total Earnings',
            value: `${earningsStats.total.toFixed(2)} KES`,
            change: '',
            isPositive: true,
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            title: 'Pending Clearance',
            value: `${earningsStats.pending.toFixed(2)} KES`,
            isPositive: true,
            icon: Activity,
            color: 'text-warning-500',
            bg: 'bg-yellow-500/10'
        }
    ];

    const recentPayments = (transactions || []).slice(0, 5).map((t) => ({
        id: t.id,
        client: t.client_email || 'Client',
        amount: `${t.destination_amount} ${t.destination_currency}`,
        status: t.status,
        date: new Date(t.created_at).toLocaleDateString(),
        via: 'Interledger -> M-Pesa'
    }));

    const mpesaDisplay = profile?.mpesa_phone || '+254 7xx xxx xxx';

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="card border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent animate-fade-in relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <h2 className="text-2xl font-bold mb-2">
                    Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
                </h2>
                <p className="text-slate-400 max-w-2xl">
                    Your M-Pesa account{' '}
                    <span className="text-emerald-400 font-medium">{mpesaDisplay}</span> is
                    ready to receive payments globally via Rafiki ILP nodes.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="card p-5 animate-fade-in" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                    <Icon size={20} />
                                </div>
                                {stat.change && (
                                    <div className="flex items-center gap-1 text-sm font-medium">
                                        <span className="text-emerald-400">{stat.change}</span>
                                        <ArrowUpRight size={16} className="text-emerald-400" />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-sm font-medium text-slate-400 mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Payments */}
                    <div className="card animate-fade-in" style={{ animationDelay: '300ms' }}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">Incoming Payments</h2>
                            <Link href="/dashboard/freelancer/history" className="text-sm text-emerald-400 hover:text-emerald-300">View All</Link>
                        </div>

                        <div className="space-y-4">
                            {loading && (
                                <div className="text-sm text-slate-400">Loading payments…</div>
                            )}
                            {!loading && !recentPayments.length && (
                                <div className="text-sm text-slate-400">
                                    No payments received yet.
                                </div>
                            )}
                            {recentPayments.map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 border border-white/10">
                                            {payment.client.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-200">{payment.client}</p>
                                            <p className="text-xs text-slate-500">{payment.date} • {payment.via}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-emerald-400">{payment.amount}</p>
                                        <div className="flex items-center justify-end gap-2 mt-1">
                                            <span className={`status-dot ${payment.status === 'completed' ? 'active' : 'pending'}`} />
                                            <span className="text-xs text-slate-400 capitalize">{payment.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    {/* M-Pesa Settings */}
                    <div className="card animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <h2 className="text-lg font-semibold mb-4">Payout Method</h2>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-500/20 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">M-PESA</div>
                                <div className="text-green-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-green-200/60 mb-1">Registered Number</p>
                                <p className="text-lg font-mono font-semibold text-green-100 tracking-wider">+254 712 345 678</p>
                            </div>
                        </div>
                        <Link href="/dashboard/freelancer/profile" className="btn btn-outline w-full mt-4 text-xs py-2">
                            Update Number
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
