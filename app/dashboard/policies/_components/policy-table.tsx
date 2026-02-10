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
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        setConfirmDeleteId(null)
        setDeletingId(id)
        const toastId = toast.loading('Deleting policy...')

        try {
            const result = await deletePolicy(id)
            if (result.success) {
                toast.success('Policy deleted successfully', { id: toastId })
            } else {
                toast.error(result.error || 'Failed to delete policy', { id: toastId })
            }
        } catch (error) {
            console.error('Delete error:', error)
            toast.error('An unexpected error occurred', { id: toastId })
        } finally {
            setDeletingId(null)
        }
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
        <>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
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
                                <tr key={policy.policy_id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">{policy.policy_number || 'N/A'}</div>
                                        {policy.product && (
                                            <div className="text-xs text-slate-500">{policy.product}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{policy.customer?.full_name || 'Unknown'}</div>
                                        <div className="text-xs text-slate-500">{policy.customer?.email || 'No email'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${policy.policy_type === 'Health'
                                            ? 'bg-green-100 text-green-800'
                                            : policy.policy_type === 'Life'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {policy.policy_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                        {formatCurrency(policy.premium || 0)}
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
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                href={`/dashboard/policies/${policy.policy_id}/edit`}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => setConfirmDeleteId(policy.policy_id)}
                                                disabled={deletingId === policy.policy_id}
                                                className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === policy.policy_id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {confirmDeleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Policy?</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            Are you sure you want to delete this policy? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDeleteId)}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                            >
                                Delete Policy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
