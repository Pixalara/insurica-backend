
'use client'

import { useState } from 'react'
import { Lead } from '../types'
import { deleteLead } from '../actions'

import { toast } from 'sonner'
import { LeadDialog } from './lead-dialog'

interface LeadsTableProps {
    leads: Lead[]
}

export function LeadsTable({ leads }: LeadsTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const [editingLead, setEditingLead] = useState<Lead | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleDelete = async (id: string) => {
        setConfirmDeleteId(null)
        setDeletingId(id)
        const toastId = toast.loading('Deleting lead...')

        try {
            await deleteLead(id)
            toast.success('Lead deleted successfully', { id: toastId })
        } catch (error) {
            console.error('Delete error:', error)
            toast.error('Failed to delete lead', { id: toastId })
        } finally {
            setDeletingId(null)
        }
    }

    const handleEdit = (lead: Lead) => {
        setEditingLead(lead)
        setIsDialogOpen(true)
    }

    const closeDialog = () => {
        setIsDialogOpen(false)
        setEditingLead(null)
    }

    if (leads.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <h3 className="text-lg font-medium text-slate-900">No leads found</h3>
                <p className="text-slate-500">Add a new lead to get started.</p>
            </div>
        )
    }

    return (
        <>
            <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                <table className="w-full text-sm text-left min-w-[700px]">
                    <thead className="bg-slate-50 text-slate-700 font-medium">
                        <tr>
                            <th className="px-4 py-3">Lead Name</th>
                            <th className="px-4 py-3">Phone Number</th>
                            <th className="px-4 py-3">Email ID</th>
                            <th className="px-4 py-3">Product Interest</th>
                            <th className="px-4 py-3">Premium Quoted</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {leads.map((lead) => {
                            // Generate initials
                            const initials = lead.name
                                .split(' ')
                                .map(n => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()

                            return (
                                <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {initials}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900">{lead.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-slate-700 font-medium">{lead.phone || 'No Phone'}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-slate-700 font-medium">{lead.email || 'No Email'}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-slate-700 font-medium">{lead.product_name || 'N/A'}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm text-slate-700 font-medium">
                                            {lead.premium_quoted
                                                ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(lead.premium_quoted)
                                                : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${lead.status === 'Closed' ? 'bg-green-50 text-green-700 border-green-200' :
                                            lead.status === 'Lost' ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleEdit(lead)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setConfirmDeleteId(lead.id)}
                                                disabled={deletingId === lead.id}
                                                className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === lead.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <LeadDialog
                isOpen={isDialogOpen}
                onClose={closeDialog}
                leadToEdit={editingLead}
            />

            {/* Custom Delete Confirmation Modal */}
            {confirmDeleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Lead?</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            Are you sure you want to delete this lead? This action cannot be undone.
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
                                Delete Lead
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
