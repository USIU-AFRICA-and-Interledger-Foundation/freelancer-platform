'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchTransactions } from '../../../../lib/api';

export default function ClientHistoryPage() {
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
          <h1 className="text-xl font-semibold">Payment History</h1>
          <p className="text-sm text-muted">
            All payments you have sent to freelancers.
          </p>
        </div>
        <Link href="/dashboard/client" className="btn btn-ghost text-xs">
          Back to overview
        </Link>
      </div>

      <div className="card">
        {loading && <p className="text-sm text-muted">Loading transactions…</p>}
        {error && <p className="form-error">{error}</p>}
        {!loading && !transactions.length && !error && (
          <p className="text-sm text-muted">No transactions yet.</p>
        )}

        {!loading && transactions.length > 0 && (
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-black/20">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Date</th>
                  <th className="px-4 py-3">Freelancer</th>
                  <th className="px-4 py-3">You sent</th>
                  <th className="px-4 py-3">To freelancer</th>
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
                        {t.freelancer_email || 'Freelancer'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {t.source_amount} {t.source_currency}
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
import { Search, Filter, Download, ArrowUpRight } from 'lucide-react';

export default function ClientHistory() {
    const [filter, setFilter] = useState('all');

    const transactions = [
        { id: '1', ref: 'RFK-8X9P-V2M1', date: 'Oct 24, 2023', freelancer: 'Alex Kariuki', amount: '$450.00', currency: 'USD', fee: '$11.25', status: 'completed' },
        { id: '2', ref: 'RFK-M2N4-99K2', date: 'Oct 23, 2023', freelancer: 'Grace Njuguna', amount: '€320.00', currency: 'EUR', fee: '€8.00', status: 'processing' },
        { id: '3', ref: 'RFK-7B3Q-Z1R8', date: 'Oct 20, 2023', freelancer: 'David Ochieng', amount: '0.015', currency: 'BTC', fee: '0.000375 BTC', status: 'completed' },
        { id: '4', ref: 'RFK-P9L1-W5Y4', date: 'Oct 15, 2023', freelancer: 'Joy Mutuku', amount: '$150.00', currency: 'USD', fee: '$3.75', status: 'failed' },
        { id: '5', ref: 'RFK-2C6V-T8N3', date: 'Oct 10, 2023', freelancer: 'Alex Kariuki', amount: '$600.00', currency: 'USD', fee: '$15.00', status: 'completed' },
    ];

    const filteredTxs = transactions.filter(tx => filter === 'all' || tx.status === filter);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold">Transaction History</h2>

                <div className="flex items-center gap-3">
                    <button className="btn btn-outline py-2 h-10 flex items-center gap-2">
                        <Download size={16} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="card p-0 overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-black/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search by ref or freelancer..."
                            className="form-input pl-9 h-10 text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <Filter size={16} className="text-slate-500 mr-2 shrink-0" />
                        <button
                            onClick={() => setFilter('all')}
                            className={`badge py-1.5 px-3 shrink-0 cursor-pointer ${filter === 'all' ? 'badge-primary' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`badge py-1.5 px-3 shrink-0 cursor-pointer ${filter === 'completed' ? 'badge-success' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            Completed
                        </button>
                        <button
                            onClick={() => setFilter('processing')}
                            className={`badge py-1.5 px-3 shrink-0 cursor-pointer ${filter === 'processing' ? 'badge-warning' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            Processing
                        </button>
                        <button
                            onClick={() => setFilter('failed')}
                            className={`badge py-1.5 px-3 shrink-0 cursor-pointer ${filter === 'failed' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                        >
                            Failed
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-black/40">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Reference</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Freelancer</th>
                                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTxs.map((tx, idx) => (
                                <tr key={tx.id} className="hover:bg-white/5 transition-colors group cursor-pointer" style={{ animationDelay: `${idx * 50}ms` }}>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400 group-hover:text-blue-400 transition-colors">
                                        {tx.ref}
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {tx.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold border border-white/10">
                                                {tx.freelancer.charAt(0)}
                                            </div>
                                            <span className="font-medium text-white">{tx.freelancer}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="font-medium text-white flex justify-end items-center gap-1">
                                            {tx.amount} <span className="text-slate-500 text-xs">{tx.currency}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">Fee: {tx.fee}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${tx.status === 'completed' ? 'badge-success' :
                                                tx.status === 'processing' ? 'badge-warning' :
                                                    'bg-red-500/10 text-red-400 border border-red-500/20'
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
                            No transactions found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
