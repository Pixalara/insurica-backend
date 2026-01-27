'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function EditHealthPolicyPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        holderName: '',
        policyNumber: '',
        contactNumber: '',
        email: '',
        planType: 'Individual',
        sumInsured: '',
        premiumAmount: '',
        startDate: '',
        endDate: '',
        renewalDate: '',
        membersCovered: 1,
        status: 'Active',
        insurer: '',
        preExistingDiseases: '',
        nominee: ''
    })

    useEffect(() => {
        // Mock data population
        setTimeout(() => {
            setFormData({
                holderName: 'Vikram Singh',
                policyNumber: 'HI-2024-001',
                contactNumber: '+91 98765 00001',
                email: 'vikram.s@example.com',
                planType: 'Family Floater',
                sumInsured: '500000',
                premiumAmount: '12500',
                startDate: '2024-03-01',
                endDate: '2025-02-28',
                renewalDate: '2025-02-28',
                membersCovered: 4,
                status: 'Active',
                insurer: 'Star Health',
                preExistingDiseases: 'None',
                nominee: 'Priya Singh'
            })
            setLoading(false)
        }, 500)
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        // TODO: Update in backend
        console.log('Updating Health Policy:', id, formData)

        await new Promise(resolve => setTimeout(resolve, 1000))

        router.push('/dashboard/health') // or policies
        router.refresh()
    }

    if (loading) return <div className="p-8 text-center">Loading policy details...</div>

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/dashboard/policies" className="text-slate-500 hover:text-slate-800 gap-2 mb-2 inline-flex items-center">
                    <ArrowLeft className="w-4 h-4" /> Back to Policies
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Edit Health Policy</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">

                {/* Section: Personal Details */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Proposer Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Policy Holder Name</label>
                            <input
                                required
                                name="holderName"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.holderName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                            <input
                                required
                                name="contactNumber"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.contactNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Policy Details */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Plan Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Policy Number</label>
                            <input
                                required
                                name="policyNumber"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.policyNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Insurer Company</label>
                            <input
                                required
                                name="insurer"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.insurer}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Plan Type</label>
                            <select
                                name="planType"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.planType}
                                onChange={handleChange}
                            >
                                <option value="Individual">Individual</option>
                                <option value="Family Floater">Family Floater</option>
                                <option value="Senior Citizen">Senior Citizen</option>
                                <option value="Critical Illness">Critical Illness</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Members Covered</label>
                            <input
                                required
                                type="number"
                                min="1"
                                name="membersCovered"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.membersCovered}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sum Insured (₹)</label>
                            <input
                                required
                                type="number"
                                name="sumInsured"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.sumInsured}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Premium Amount (₹)</label>
                            <input
                                required
                                type="number"
                                name="premiumAmount"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.premiumAmount}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                            <input
                                required
                                type="date"
                                name="startDate"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">End / Renewal Date</label>
                            <input
                                required
                                type="date"
                                name="endDate"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Medical Info */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Medical & Others</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Pre-existing Diseases</label>
                            <input
                                name="preExistingDiseases"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.preExistingDiseases}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nominee Name</label>
                            <input
                                required
                                name="nominee"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.nominee}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex gap-3 border-t border-slate-100 mt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2.5 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
