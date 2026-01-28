'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Monitor, Heart, Filter, Search, Edit, Eye, Plus } from 'lucide-react'

// Unified policy type for display 
type UnifiedPolicy = {
    id: string
    category: 'Health' | 'General'
    policyNumber: string
    holderName: string
    contact: string
    type: string // 'Individual', 'Family Floater' or 'Motor', 'Fire' etc
    expiryDate: string
    status: 'Active' | 'Expired' | 'Pending' | 'Grace Period'
    amount: number
}

const MOCK_POLICIES: UnifiedPolicy[] = [
    {
        id: '1',
        category: 'Health',
        policyNumber: 'HI-2024-001',
        holderName: 'Vikram Singh',
        contact: '+91 98765 00001',
        type: 'Family Floater',
        expiryDate: '2025-02-28',
        status: 'Active',
        amount: 12500
    },
    {
        id: '1', // General ID mock
        category: 'General',
        policyNumber: 'GI-2024-001',
        holderName: 'Rajesh Kumar',
        contact: '+91 98765 43210',
        type: 'Health', // General Health
        expiryDate: '2025-01-14',
        status: 'Active',
        amount: 15000
    },
    {
        id: '2',
        category: 'Health',
        policyNumber: 'HI-2024-042',
        holderName: 'Anjali Desai',
        contact: '+91 98123 99999',
        type: 'Individual',
        expiryDate: '2024-06-14',
        status: 'Active',
        amount: 8000
    },
    {
        id: '2',
        category: 'General',
        policyNumber: 'GI-2024-002',
        holderName: 'Priya Sharma',
        contact: '+91 98123 45678',
        type: 'Motor',
        expiryDate: '2024-11-19',
        status: 'Active',
        amount: 8500
    },
    {
        id: '3',
        category: 'Health',
        policyNumber: 'HI-2023-112',
        holderName: 'Ramesh Gupta',
        contact: '+91 99887 11223',
        type: 'Senior Citizen',
        expiryDate: '2024-01-09',
        status: 'Expired',
        amount: 18000
    }
]

export default function PoliciesPage() {
    const [filter, setFilter] = useState<'All' | 'Health' | 'General'>('All')
    const [search, setSearch] = useState('')

    const filteredPolicies = MOCK_POLICIES.filter(policy => {
        const matchesCategory = filter === 'All' || policy.category === filter
        const matchesSearch = policy.holderName.toLowerCase().includes(search.toLowerCase()) ||
            policy.policyNumber.toLowerCase().includes(search.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">All Policies</h1>
                    <p className="text-slate-500 text-sm">Centralized view of all health and general insurance policies.</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/dashboard/general/new"
                        className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> General Policy
                    </Link>
                    <Link
                        href="/dashboard/health/new"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Health Policy
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setFilter('All')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'All' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('Health')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'Health' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Health
                    </button>
                    <button
                        onClick={() => setFilter('General')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'General' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        General
                    </button>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        placeholder="Search details..."
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Policy Holder</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Policy Number</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Expiry</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPolicies.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-slate-400">
                                    No policies found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            filteredPolicies.map((policy, idx) => (
                                <tr key={`${policy.category}-${policy.id}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${policy.category === 'Health' ? 'bg-pink-50 text-pink-700' : 'bg-blue-50 text-blue-700'
                                            }`}>
                                            {policy.category === 'Health' ? <Heart className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                                            {policy.category}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-semibold text-slate-900">{policy.holderName}</p>
                                        <p className="text-xs text-slate-500 md:hidden">{policy.policyNumber}</p>
                                    </td>
                                    <td className="p-4 text-slate-600 text-sm hidden md:table-cell font-mono">{policy.policyNumber}</td>
                                    <td className="p-4 text-slate-600 text-sm">{new Date(policy.expiryDate).toLocaleDateString()}</td>
                                    <td className="p-4 font-medium text-slate-900">{formatCurrency(policy.amount)}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${policy.status === 'Active' ? 'bg-green-50 text-green-700' :
                                                policy.status === 'Expired' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-700'
                                            }`}>
                                            {policy.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/${policy.category.toLowerCase()}/${policy.id}`}
                                                className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/dashboard/${policy.category.toLowerCase()}/${policy.id}/edit`}
                                                className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
                                                title="Edit Policy"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}