'use client'

import { format } from 'date-fns'
import Link from 'next/link'
import type { Renewal } from '../types'

interface RenewalTableProps {
    renewals: Renewal[]
}

export function RenewalTable({ renewals }: RenewalTableProps) {
    const formatCurrency = (val?: number) => {
        if (!val) return '-'
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val)
    }

    const getUrgencyColor = (days: number) => {
        if (days < 0) return 'bg-red-100 text-red-800'
        if (days <= 7) return 'bg-red-100 text-red-700'
        if (days <= 15) return 'bg-orange-100 text-orange-700'
        if (days <= 30) return 'bg-yellow-100 text-yellow-700'
        return 'bg-blue-100 text-blue-700'
    }

    if (renewals.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No renewals found for the selected time range.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Policy Number
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Client Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Premium
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Expiry Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Days Remaining
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {renewals.map((renewal) => (
                            <tr key={renewal.policy_id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-900">{renewal.policy_number || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{renewal.customer?.full_name || 'Unknown'}</div>
                                    <div className="text-xs text-slate-500">{renewal.customer?.email || 'No email'}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${renewal.policy_type === 'Health'
                                        ? 'bg-green-100 text-green-800'
                                        : renewal.policy_type === 'Life'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {renewal.policy_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                    {formatCurrency(renewal.premium || 0)}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                                    {renewal.end_date ? format(new Date(renewal.end_date), 'MMM dd, yyyy') : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getUrgencyColor(renewal.days_to_expiry)}`}>
                                        {renewal.days_to_expiry < 0
                                            ? `${Math.abs(renewal.days_to_expiry)} days overdue`
                                            : `${renewal.days_to_expiry} days`
                                        }
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link
                                        href={`/dashboard/policies/${renewal.policy_id}/edit`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Renew
                                    </Link>
                                    <a
                                        href={renewal.customer?.email ? `mailto:${renewal.customer.email}` : '#'}
                                        className={`text-green-600 hover:text-green-800 text-sm font-medium ${!renewal.customer?.email && 'opacity-50 cursor-not-allowed'}`}
                                    >
                                        Contact
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
