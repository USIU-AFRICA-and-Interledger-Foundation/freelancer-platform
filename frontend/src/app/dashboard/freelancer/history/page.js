'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchTransactions } from '../../../../lib/api';

export default function FreelancerHistoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Incoming Payments</h1>
          <p className="text-sm text-muted">
            All payments you have received from clients.
          </p>
        </div>
        <Link href="/dashboard/freelancer" className="btn btn-ghost text-xs">
          Back to overview
        </Link>
      </div>

      <div className="card">
        {loading && <p className="text-sm text-muted">Loading payments…</p>}
        {error && <p className="form-error">{error}</p>}
        {!loading && !transactions.length && !error && (
          <p className="text-sm text-muted">No payments yet.</p>
        )}

        {!loading && transactions.length > 0 && (
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-black/20">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Date</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Amount (KES)</th>
                  <th className="px-4 py-3 rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-200">
                        {t.client_email || 'Client'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {t.destination_amount} {t.destination_currency}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          t.status === 'completed'
                            ? 'badge-success'
                            : t.status === 'processing'
                            ? 'badge-primary'
                            : 'badge-warning'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Search, Filter, Download, ArrowDownLeft } from 'lucide-react';

export default function FreelancerHistory() {
    const [filter, setFilter] = useState('all');

    const transactions = [
        { id: '1', ref: 'RFK-8X9P-V2M1', date: 'Oct 24, 2023', client: 'Global Tech Corp', amount: '+ 67,725 KES', original: '$450.00 USD', status: 'completed' },
        { id: '2', ref: 'RFK-M2N4-99K2', date: 'Oct 23, 2023', client: 'Acme Design', amount: '+ 50,560 KES', original: '€320.00 EUR', status: 'processing' },
        { id: '3', ref: 'RFK-2C6V-T8N3', date: 'Oct 10, 2023', client: 'Global Tech Corp', amount: '+ 90,300 KES', original: '$600.00 USD', status: 'completed' },
        { id: '4', ref: 'RFK-J7B2-X5Q9', date: 'Sep 28, 2023', client: 'Startup Inc', amount: '+ 37,625 KES', original: '$250.00 USD', status: 'completed' },
    ];

    const filteredTxs = transactions.filter(tx => filter === 'all' || tx.status === filter);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold">Payment History</h2>

                <div className="flex items-center gap-3">
                    <button className="btn btn-outline py-2 h-10 flex items-center gap-2 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 hover:border-emerald-500/50">
                        <Download size={16} />
                        <span>Download Statement</span>
                    </button>
                </div>
            </div>

            <div className="card p-0 overflow-hidden border-emerald-500/10">
                <div className="p-4 border-b border-white/5 bg-black/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search by ref or client..."
                            className="form-input pl-9 h-10 text-sm focus:border-emerald-500"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <Filter size={16} className="text-slate-500 mr-2 shrink-0" />
                        <button
                            onClick={() => setFilter('all')}
                            className={`badge py-1.5 px-3 shrink-0 cursor-pointer ${filter === 'all' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`badge py-1.5 px-3 shrink-0 cursor-pointer ${filter === 'completed' ? 'badge-success' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            Received
                        </button>
                        <button
                            onClick={() => setFilter('processing')}
                            className={`badge py-1.5 px-3 shrink-0 cursor-pointer ${filter === 'processing' ? 'badge-warning' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            Processing
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-black/40">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Reference</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Client</th>
                                <th className="px-6 py-4 font-semibold text-right">Received (KES)</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTxs.map((tx, idx) => (
                                <tr key={tx.id} className="hover:bg-white/5 transition-colors group cursor-pointer" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">
                                        {tx.ref}
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {tx.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold border border-white/10 text-slate-300">
                                                {tx.client.charAt(0)}
                                            </div>
                                            <span className="font-medium text-white">{tx.client}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="font-bold text-emerald-400 flex justify-end items-center gap-1">
                                            <ArrowDownLeft size={14} className="text-emerald-500 mr-1" />
                                            {tx.amount}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">From {tx.original}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${tx.status === 'completed' ? 'badge-success' : 'badge-warning'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredTxs.length === 0 && (
                        <div className="p-12 text-center text-slate-500">
                            No payments found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
