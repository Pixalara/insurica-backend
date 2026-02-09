'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Client } from '../types'
import { deleteClient } from '../actions'

import { toast } from 'sonner'

interface ClientTableProps {
    clients: Client[]
}

export function ClientTable({ clients }: ClientTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        setConfirmDeleteId(null)
        setDeletingId(id)
        const toastId = toast.loading('Deleting client...')

        try {
            await deleteClient(id)
            toast.success('Client deleted successfully', { id: toastId })
        } catch (error) {
            console.error('Delete error:', error)
            const message = error instanceof Error ? error.message : 'Failed to delete client'
            toast.error(message, { id: toastId })
        } finally {
            setDeletingId(null)
        }
    }

    if (clients.length === 0) {
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
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-medium">
                        <tr>
                            <th className="px-4 py-3">Client Name</th>
                            <th className="px-4 py-3">Contact Details</th>
                            <th className="px-4 py-3">Policy Status</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Insurer</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {clients.map((client) => {
                            let displayInsurer = 'N/A'
                            if (client.companies) {
                                if (Array.isArray(client.companies) && client.companies.length > 0) {
                                    displayInsurer = client.companies[0].name
                                } else if (!Array.isArray(client.companies)) {
                                    displayInsurer = (client.companies as unknown as { name: string }).name
                                }
                            }

                            // Generate initials
                            const initials = client.name
                                .split(' ')
                                .map(n => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()

                            return (
                                <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {initials}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{client.name}</div>
                                                <div className="text-xs text-slate-500">{client.email || 'No Email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-slate-700 font-medium">{client.phone || 'No Phone'}</div>
                                        <div className="text-xs text-slate-500">{client.policy_number}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${client.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                                            client.status === 'Expired' ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-slate-100 text-slate-700 border-slate-200'
                                            }`}>
                                            {client.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-slate-700 font-medium">{client.product_name || 'N/A'}</div>
                                        <div className="text-xs text-slate-500">{client.category}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                            <span className="text-sm text-slate-600 font-medium">{displayInsurer}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                href={`/dashboard/clients/${client.id}/edit`}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => setConfirmDeleteId(client.id)}
                                                disabled={deletingId === client.id}
                                                className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === client.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
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
                            Are you sure you want to delete this client? This action cannot be undone.
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
