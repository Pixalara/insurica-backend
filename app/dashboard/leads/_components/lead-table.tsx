'use client'

import { useState } from 'react'
import { deleteLead } from '../actions'
import { toast } from 'sonner'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Lead } from '../types'

interface LeadTableProps {
    leads: Lead[]
}

export function LeadTable({ leads }: LeadTableProps) {
    const [deleting, setDeleting] = useState<string | null>(null)

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete lead "${name}"?`)) return

        setDeleting(id)
        const result = await deleteLead(id)

        if (result.success) {
            toast.success('Lead deleted successfully')
        } else {
            toast.error(result.error || 'Failed to delete lead')
        }
        setDeleting(null)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New':
                return 'bg-blue-100 text-blue-800'
            case 'Contacted':
                return 'bg-yellow-100 text-yellow-800'
            case 'Qualified':
                return 'bg-purple-100 text-purple-800'
            case 'Converted':
                return 'bg-green-100 text-green-800'
            case 'Lost':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-slate-100 text-slate-800'
        }
    }

    if (leads.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No leads found. Add your first lead to get started.</p>
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
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Interest
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-900">{lead.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-slate-900">{lead.email}</div>
                                    <div className="text-xs text-slate-500">{lead.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-900">
                                    {lead.product_name}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {lead.created_at ? format(new Date(lead.created_at), 'MMM dd, yyyy') : '-'}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link
                                        href={`/dashboard/leads/${lead.id}/edit`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(lead.id, lead.name)}
                                        disabled={deleting === lead.id}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                                    >
                                        {deleting === lead.id ? 'Deleting...' : 'Delete'}
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
