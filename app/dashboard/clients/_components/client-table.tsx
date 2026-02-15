'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Customer, Policy } from '../types'
import { deleteCustomer } from '../actions'
import { ChevronDown, ChevronUp, Edit, Trash2, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface ClientTableProps {
    customers: Customer[]
}

export function ClientTable({ customers }: ClientTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        setConfirmDeleteId(null)
        setDeletingId(id)
        const toastId = toast.loading('Deleting customer...')

        try {
            await deleteCustomer(id)
            toast.success('Customer deleted successfully', { id: toastId })
        } catch (error) {
            console.error('Delete error:', error)
            const message = error instanceof Error ? error.message : 'Failed to delete customer'
            toast.error(message, { id: toastId })
        } finally {
            setDeletingId(null)
        }
    }

    const toggleExpand = (id: string) => {
        setExpandedCustomerId(expandedCustomerId === id ? null : id)
    }

    if (customers.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <h3 className="text-lg font-medium text-slate-900">No clients found</h3>
                <p className="text-slate-500">Add a new client to get started.</p>
            </div>
        )
    }

    return (
        <>
            <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                <table className="w-full text-sm text-left min-w-[800px]">
                    <thead className="bg-slate-50 text-slate-700 font-medium">
                        <tr>
                            <th className="px-4 py-3 w-10"></th>
                            <th className="px-4 py-3">Client Name</th>
                            <th className="px-4 py-3">Contact Details</th>
                            <th className="px-4 py-3">Policies</th>
                            <th className="px-4 py-3">Total Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {customers.map((customer) => {
                            const isExpanded = expandedCustomerId === customer.customer_id
                            const policyCount = customer.policies?.length || 0
                            const activePolicies = customer.policies?.filter(p => p.status === 'Active').length || 0

                            // Generate initials
                            const initials = customer.full_name
                                .split(' ')
                                .map(n => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()

                            return (
                                <React.Fragment key={customer.customer_id}>
                                    <tr className={`hover:bg-slate-50 transition-colors group ${isExpanded ? 'bg-slate-50' : ''}`}>
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => toggleExpand(customer.customer_id)}
                                                className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                                            >
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{customer.full_name}</div>
                                                    <div className="text-xs text-slate-500">ID: {customer.customer_id.slice(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm text-slate-700 font-medium">{customer.mobile_number}</div>
                                            <div className="text-xs text-slate-500">{customer.email || 'No Email'}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {policyCount} Policy(s)
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2">
                                                {activePolicies > 0 ? (
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                                                        {activePolicies} Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                                        Inactive
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    href={`/dashboard/clients/${customer.customer_id}/edit`} // Need customer edit page or policy edit?
                                                    // Assuming we edit customer details or add policy
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors flex items-center gap-1"
                                                >
                                                    <Edit size={14} /> Edit
                                                </Link>
                                                <button
                                                    onClick={() => setConfirmDeleteId(customer.customer_id)}
                                                    disabled={deletingId === customer.customer_id}
                                                    className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-1"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Policies View */}
                                    {isExpanded && (
                                        <tr>
                                            <td colSpan={6} className="px-0 py-0 bg-slate-50 border-b border-slate-200">
                                                <div className="p-4 sm:p-6 sm:pl-16 space-y-3">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">policies</h4>
                                                    </div>

                                                    {(!customer.policies || customer.policies.length === 0) ? (
                                                        <div className="text-sm text-slate-500 italic">No policies found for this client.</div>
                                                    ) : (
                                                        <div className="grid gap-3">
                                                            {customer.policies.map(policy => (
                                                                <div key={policy.policy_id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                                                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                                        <div>
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <span className={`w-2 h-2 rounded-full ${policy.policy_type === 'Health' ? 'bg-rose-500' :
                                                                                    policy.policy_type === 'Life' ? 'bg-blue-500' : 'bg-amber-500'
                                                                                    }`} />
                                                                                <span className="text-sm font-bold text-slate-900">{policy.product || 'Unknown Product'}</span>
                                                                                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                                                    {policy.policy_number}
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-xs text-slate-500">
                                                                                {policy.insurance_company} • {policy.policy_type}
                                                                                {policy.vehicle_number && ` • ${policy.vehicle_number}`}
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center justify-between sm:justify-end gap-6">
                                                                            <div className="text-right">
                                                                                <div className="text-sm font-bold text-slate-900">
                                                                                    {policy.premium ? `₹${policy.premium.toLocaleString('en-IN')}` : 'N/A'}
                                                                                </div>
                                                                                <div className={`text-xs font-semibold ${policy.status === 'Active' ? 'text-green-600' :
                                                                                    policy.status === 'Expired' ? 'text-red-600' : 'text-slate-500'
                                                                                    }`}>
                                                                                    {policy.status}
                                                                                </div>
                                                                            </div>

                                                                            <Link
                                                                                href={`/dashboard/policies/${policy.policy_id}/edit`}
                                                                                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                                                            >
                                                                                <ExternalLink size={16} />
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-3 text-xs text-slate-400 border-t border-slate-100 pt-2 flex gap-4">
                                                                        <span>Start: {policy.start_date ? format(new Date(policy.start_date), 'dd MMM yyyy') : 'N/A'}</span>
                                                                        <span>End: {policy.end_date ? format(new Date(policy.end_date), 'dd MMM yyyy') : 'N/A'}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {confirmDeleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Client?</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            Are you sure you want to delete this client?
                            <span className="block mt-2 text-red-600 font-medium">Warning: This will delete ALL policies associated with this client.</span>
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
                                Delete Client
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
