'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Client } from '../types'
import { createClient } from '@/utils/supabase/client'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface ClientTableProps {
    clients: Client[]
    onRefresh?: () => void
}

export function ClientTable({ clients: initialClients, onRefresh }: ClientTableProps) {
    const [clients, setClients] = useState(initialClients)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const router = useRouter()

    // Internal state sync
    useEffect(() => {
        setClients(initialClients)
    }, [initialClients])

    const handleDelete = async (id: string) => {
        setConfirmDeleteId(null) // Close modal
        setDeletingId(id)
        const toastId = toast.loading('Deleting client...')

        try {
            // Local Storage Delete
            const { ClientStorage } = await import('../client-storage')
            ClientStorage.deleteClient(id)

            /* Backend Code (Commented out)
            const { error } = await supabase.from('clients').delete().eq('id', id)
            if (error) throw error
            */

            toast.success('Client deleted successfully', { id: toastId })

            if (onRefresh) {
                onRefresh()
            } else {
                setClients((prev) => prev.filter((c) => c.id !== id))
                router.refresh()
            }
        } catch (error: any) {
            console.error('Delete error:', error)
            toast.error(error.message || 'Failed to delete client', { id: toastId })
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

    const getStatusStyle = (status?: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700'
            case 'Inactive': return 'bg-gray-100 text-gray-700'
            case 'Expired': return 'bg-red-100 text-red-700'
            default: return 'bg-blue-100 text-blue-700'
        }
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
                            <th className="px-4 py-3">Product Type</th>
                            <th className="px-4 py-3">Insurer</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {clients.map((client) => {
                            const displayStatus = client.policyStatus || 'Active'
                            const displayProduct = client.productType || 'Health Insurance'
                            const displayInsurer = client.insurer || 'Start Health'

                            return (
                                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-900">{client.name}</td>
                                    <td className="px-4 py-3">
                                        <div className="text-xs text-slate-600">{client.email || 'No Email'}</div>
                                        <div className="text-xs text-slate-500">{client.phone || 'No Phone'}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(displayStatus)}`}>
                                            {displayStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {displayProduct}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">
                                        {displayInsurer}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/dashboard/clients/${client.id}/edit`}
                                                className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <button
                                                onClick={() => setConfirmDeleteId(client.id)}
                                                disabled={deletingId === client.id}
                                                className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
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
