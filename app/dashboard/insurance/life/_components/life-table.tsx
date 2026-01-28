'use client'

import React from 'react'
import { LifePolicy } from '../types'
import { Pencil, Trash2 } from 'lucide-react'

interface LifeTableProps {
    policies: LifePolicy[]
    onEdit: (policy: LifePolicy) => void
    onDelete: (id: string) => void
}

export function LifeTable({ policies, onEdit, onDelete }: LifeTableProps) {
    const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null)

    if (policies.length === 0) {
        return (
            <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <p className="text-slate-500">No life insurance policies found.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 font-medium">
                    <tr>
                        <th className="px-4 py-3">Policy No</th>
                        <th className="px-4 py-3">Holder Name</th>
                        <th className="px-4 py-3">Plan Type</th>
                        <th className="px-4 py-3">Sum Insured</th>
                        <th className="px-4 py-3">Premium</th>
                        <th className="px-4 py-3">Renewal Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                    {policies.map((policy) => (
                        <tr key={policy.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-900">{policy.policyNumber}</td>
                            <td className="px-4 py-3">
                                <div className="font-medium text-slate-900">{policy.holderName}</div>
                                <div className="text-xs text-slate-500">{policy.contactNumber}</div>
                            </td>
                            <td className="px-4 py-3">{policy.planType}</td>
                            <td className="px-4 py-3">₹{policy.sumAssured.toLocaleString()}</td>
                            <td className="px-4 py-3">
                                ₹{policy.premiumAmount.toLocaleString()}
                                <span className="text-xs text-slate-500 block">/{policy.premiumFrequency}</span>
                            </td>
                            <td className="px-4 py-3">{new Date(policy.nextDueDate).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                  ${policy.status === 'Active' ? 'bg-green-100 text-green-700' :
                                        policy.status === 'Lapsed' ? 'bg-red-100 text-red-700' :
                                            policy.status === 'Matured' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'}`}>
                                    {policy.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(policy)}
                                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => setConfirmDeleteId(policy.id)}
                                        className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delete Confirmation Modal */}
            {confirmDeleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Life Policy?</h3>
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
                                onClick={() => {
                                    onDelete(confirmDeleteId)
                                    setConfirmDeleteId(null)
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                            >
                                Delete Policy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
