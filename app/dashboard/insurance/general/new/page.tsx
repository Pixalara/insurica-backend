'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { GENERAL_INSURERS, GENERAL_PRODUCTS } from '../constants'

export default function NewGeneralPolicyPage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
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
        setLoading(true)

        // TODO: Integrate with actual Supabase table 'policies' when ready
        // For now we simulate an API call
        console.log('Submitting Policy:', { ...formData, duration })

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        router.push('/dashboard/insurance/general')
        router.refresh()
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <Link href="/dashboard/insurance/general" className="text-slate-500 hover:text-slate-800 gap-2 mb-2 inline-flex items-center">
                    <ArrowLeft className="w-4 h-4" /> Back to Policies
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Create New Policy</h1>
                <p className="text-slate-500 text-sm">Enter the details for the new general insurance policy.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-8">

                {/* Section: Insured Details */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Insured Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Insured Name</label>
                            <input
                                required
                                name="holderName"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="e.g. Rahul Verma"
                                value={formData.holderName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                            <input
                                required
                                name="contactNumber"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="+91 98765 43210"
                                value={formData.contactNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="rahul@example.com"
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="GI-2024-XXXX"
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy Duration</label>
                            <input
                                readOnly
                                disabled
                                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-500 font-medium cursor-not-allowed"
                                value={duration || 'Auto-calculated'}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Sum Insured</label>
                            <input
                                required
                                type="number"
                                name="sumInsured"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="0.00"
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
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="0.00"
                                value={formData.premium}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                            <select
                                name="status"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
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
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            placeholder="Enter any additional notes here..."
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex gap-4 border-t border-slate-100 mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {loading ? 'Creating...' : 'Save Policy'}
                    </button>
                    {/* Modify and Delete buttons are more appropriate for the Edit/View page. For 'New', only Save/Cancel are clearer. The user request "Buttons: Save, Modify, Delete" implies a management view context, which I will fully implement in the Edit page. */}
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-3 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
