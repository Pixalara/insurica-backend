'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2, Edit2, Save, X } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { GENERAL_INSURERS, GENERAL_PRODUCTS } from '../../constants'

export default function EditGeneralPolicyPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [formData, setFormData] = useState({
        holderName: '',
        contactNumber: '',
        email: '',
        insurer: '',
        product: '',
        policyNumber: '',
        startDate: '',
        endDate: '',
        premium: '',
        sumInsured: '',
        status: 'Active',
        notes: ''
    })

    const [duration, setDuration] = useState('')

    useEffect(() => {
        // Simulate fetching data
        setTimeout(() => {
            setFormData({
                holderName: 'Rajesh Kumar',
                contactNumber: '+91 98765 43210',
                email: 'rajesh.k@example.com',
                insurer: 'HDFC ERGO General Insurance',
                product: 'Health Insurance',
                policyNumber: 'GI-2024-001',
                startDate: '2024-01-15',
                endDate: '2025-01-14',
                premium: '15000',
                sumInsured: '500000',
                status: 'Active',
                notes: 'Customer requested critical illness cover to be added next year.'
            })
            setLoading(false)
        }, 500)
    }, [id])

    // Auto-calculate duration
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate)
            const end = new Date(formData.endDate)
            const diffTime = Math.abs(end.getTime() - start.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (!isNaN(diffDays)) {
                if (diffDays >= 365) {
                    const years = (diffDays / 365).toFixed(1)
                    setDuration(`${years} Year(s)`)
                } else {
                    setDuration(`${diffDays} Days`)
                }
            }
        }
    }, [formData.startDate, formData.endDate])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        console.log('Updating Policy:', id, { ...formData, duration })
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSaving(false)
        setIsEditing(false) // Switch back to view mode
        router.refresh()
    }

    const handleDelete = async () => {
        console.log('Deleting Policy:', id)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setShowDeleteModal(false)
        router.push('/dashboard/insurance/general')
        router.refresh()
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Loading policy details...</div>

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Link href="/dashboard/insurance/general" className="text-slate-500 hover:text-slate-800 gap-2 mb-2 inline-flex items-center">
                        <ArrowLeft className="w-4 h-4" /> Back to Policies
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Policy Details</h1>
                </div>
                {!isEditing && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium transition-colors shadow-sm"
                        >
                            <Edit2 size={16} /> Modify
                        </button>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-8 relative">
                {/* Read-only Overlay if not editing */}
                {!isEditing && (
                    <div className="absolute inset-0 z-10 bg-transparent cursor-default" />
                )}

                {/* Section: Insured Details */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Insured Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Insured Name</label>
                            <input
                                required
                                name="holderName"
                                disabled={!isEditing}
                                className={`w-full border rounded-xl px-4 py-3.5 transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-blue-500/20' : 'bg-transparent border-transparent px-0 text-slate-900 text-lg'}`}
                                value={formData.holderName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                            <input
                                required
                                name="contactNumber"
                                disabled={!isEditing}
                                className={`w-full border rounded-xl px-4 py-3.5 transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-blue-500/20' : 'bg-transparent border-transparent px-0 text-slate-900'}`}
                                value={formData.contactNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                disabled={!isEditing}
                                className={`w-full border rounded-xl px-4 py-3.5 transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-blue-500/20' : 'bg-transparent border-transparent px-0 text-slate-900'}`}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Policy Information */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Policy Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Insurer Name</label>
                            <select
                                required
                                name="insurer"
                                disabled={!isEditing}
                                className={`w-full border rounded-xl px-4 py-3.5 transition-all font-medium appearance-none ${isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-blue-500/20' : 'bg-transparent border-transparent px-0 text-slate-900'}`}
                                value={formData.insurer}
                                onChange={handleChange}
                            >
                                <option value="">Select Insurer</option>
                                {GENERAL_INSURERS.map(insurer => (
                                    <option key={insurer} value={insurer}>{insurer}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Product Opted</label>
                            <select
                                required
                                name="product"
                                disabled={!isEditing}
                                className={`w-full border rounded-xl px-4 py-3.5 transition-all font-medium appearance-none ${isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-blue-500/20' : 'bg-transparent border-transparent px-0 text-slate-900'}`}
                                value={formData.product}
                                onChange={handleChange}
                            >
                                <option value="">Select Product</option>
                                {GENERAL_PRODUCTS.map(product => (
                                    <option key={product} value={product}>{product}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy Number</label>
                            <input
                                required
                                name="policyNumber"
                                disabled={!isEditing}
                                className={`w-full border rounded-xl px-4 py-3.5 transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-blue-500/20' : 'bg-transparent border-transparent px-0 text-slate-900'}`}
                                value={formData.policyNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy Start Date</label>
                            <input
                                required
                                type="date"
                                name="startDate"
                                disabled={!isEditing}
                                className={`w-full border rounded-xl px-4 py-3.5 transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-blue-500/20' : 'bg-transparent border-transparent px-0 text-slate-900'}`}
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy End Date</label>
                            <input
                                required
                                type="date"
                                name="endDate"
                                disabled={!isEditing}
                                className={`w-full border rounded-xl px-4 py-3.5 transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-blue-500/20' : 'bg-transparent border-transparent px-0 text-slate-900'}`}
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy Duration</label>
                            <input
                                readOnly
                                disabled
                                className={`w-full border rounded-xl px-4 py-3.5 transition-all font-medium ${isEditing ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-transparent border-transparent px-0 text-slate-900'}`}
                                value={duration || 'Auto-calculated'}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Sum Insured</label>
                            <input
                                required
                                type="number"
                                name="sumInsured"
                                disabled={!isEditing}
                                className={`w-full border rounded-xl px-4 py-3.5 transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-blue-500/20' : 'bg-transparent border-transparent px-0 text-slate-900'}`}
                                value={formData.sumInsured}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Premium Collected (incl. taxes)</label>
                            <input
                                required
                                type="number"
                                name="premium"
                                disabled={!isEditing}
                                className={`w-full border rounded-xl px-4 py-3.5 transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-blue-500/20' : 'bg-transparent border-transparent px-0 text-slate-900'}`}
                                value={formData.premium}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                            <select
                                name="status"
                                disabled={!isEditing}
                                className={`w-full border rounded-xl px-4 py-3.5 transition-all font-medium appearance-none ${isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-blue-500/20' : 'bg-transparent border-transparent px-0 text-slate-900'}`}
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Expired">Expired</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section: Additional Notes */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Additional Information</h3>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Notes</label>
                        <textarea
                            rows={3}
                            name="notes"
                            disabled={!isEditing}
                            className={`w-full border rounded-xl px-4 py-3.5 transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-blue-500/20' : 'bg-transparent border-transparent px-0 text-slate-900'}`}
                            placeholder="Enter any additional notes here..."
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="pt-6 flex gap-4 border-t border-slate-100 mt-4 relative z-20">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-2 px-8 py-3 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <X size={18} /> Cancel
                        </button>
                    </div>
                )}
            </form>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Policy?</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            Are you sure you want to delete this policy permanently? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
