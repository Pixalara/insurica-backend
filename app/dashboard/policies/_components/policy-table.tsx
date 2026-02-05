'use client'

import { useState } from 'react'
import { deletePolicy } from '../actions'
import { toast } from 'sonner'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Policy } from '../types'

interface PolicyTableProps {
    policies: Policy[]
}

export function PolicyTable({ policies }: PolicyTableProps) {
    const [deleting, setDeleting] = useState<string | null>(null)

    const handleDelete = async (id: string, policyNumber: string) => {
        if (!confirm(`Are you sure you want to delete policy "${policyNumber}"?`)) return

        setDeleting(id)
        const result = await deletePolicy(id)

        if (result.success) {
            toast.success('Policy deleted successfully')
        } else {
            toast.error(result.error || 'Failed to delete policy')
        }
        setDeleting(null)
    }

    const formatCurrency = (val?: number) => {
        if (!val) return '-'
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val)
    }

    if (policies.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No policies found. Add your first policy to get started.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
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
                                Start Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                End Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {policies.map((policy) => (
                            <tr key={policy.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-900">{policy.policy_number}</div>
                                    {policy.vehicle_number && (
                                        <div className="text-xs text-slate-500">{policy.vehicle_number}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{policy.name}</div>
                                    <div className="text-xs text-slate-500">{policy.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${policy.category?.includes('Health')
                                        ? 'bg-green-100 text-green-800'
                                        : policy.category?.includes('Life')
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {policy.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                    {formatCurrency(policy.premium_amount)}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {policy.start_date ? format(new Date(policy.start_date), 'MMM dd, yyyy') : '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {policy.end_date ? format(new Date(policy.end_date), 'MMM dd, yyyy') : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${policy.status === 'Active'
                                        ? 'bg-green-100 text-green-800'
                                        : policy.status === 'Expired'
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {policy.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link
                                        href={`/dashboard/policies/${policy.id}/edit`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(policy.id, policy.policy_number)}
                                        disabled={deleting === policy.id}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                                    >
                                        {deleting === policy.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
