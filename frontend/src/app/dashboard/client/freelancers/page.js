'use client';

import Link from 'next/link';
import { Search, MapPin, Star, ShieldCheck } from 'lucide-react';

export default function FreelancerList() {
    const freelancers = [
        { id: '1', name: 'Alex Kariuki', role: 'Full Stack Developer', rating: 4.9, active: true, verified: true, skills: ['React', 'Node.js', 'PostgreSQL'] },
        { id: '2', name: 'Grace Njuguna', role: 'UI/UX Designer', rating: 4.8, active: true, verified: true, skills: ['Figma', 'Prototyping', 'User Research'] },
        { id: '3', name: 'David Ochieng', role: 'Smart Contract Engineer', rating: 5.0, active: false, verified: true, skills: ['Solidity', 'Web3.js', 'Auditing'] },
        { id: '4', name: 'Joy Mutuku', role: 'Technical Writer', rating: 4.7, active: true, verified: false, skills: ['API Docs', 'Tutorials', 'Markdown'] },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                <div className="w-full md:w-96 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search freelancers by name or skill..."
                        className="form-input pl-10 bg-black/20"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <button className="badge badge-primary shrink-0">All Roles</button>
                    <button className="badge bg-black/20 text-slate-300 border border-white/5 shrink-0 hover:bg-white/5">Developers</button>
                    <button className="badge bg-black/20 text-slate-300 border border-white/5 shrink-0 hover:bg-white/5">Designers</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {freelancers.map((freelancer, i) => (
                    <div key={freelancer.id} className="card p-0 overflow-hidden flex flex-col animate-fade-in group" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-700 flex items-center justify-center text-lg font-bold">
                                        {freelancer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition-colors">
                                                {freelancer.name}
                                            </h3>
                                            {freelancer.verified && (
                                                <ShieldCheck size={16} className="text-emerald-500" fill="currentColor" fillOpacity={0.2} />
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-400">{freelancer.role}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                                <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    <span>Kenya</span>
                                </div>
                                <div className="flex items-center gap-1 text-amber-500">
                                    <Star size={14} fill="currentColor" />
                                    <span className="font-medium text-amber-400">{freelancer.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className={`status-dot ${freelancer.active ? 'active' : ''}`} />
                                    <span>{freelancer.active ? 'Available' : 'Busy'}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {freelancer.skills.map((skill) => (
                                    <span key={skill} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-slate-300">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/5 bg-black/10 flex gap-3">
                            <button className="flex-1 btn btn-outline btn-sm py-2 text-sm">View Profile</button>
                            <Link
                                href={`/dashboard/client/pay?freelancer=${freelancer.id}`}
                                className="flex-1 btn btn-primary btn-sm py-2 text-sm justify-center"
                            >
                                Send Payment
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
