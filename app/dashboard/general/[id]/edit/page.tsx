'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function EditGeneralPolicyPage() {
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
        type: 'Health',
        startDate: '',
        endDate: '',
        amountPaid: '',
        status: 'Active',
        coverage: ''
    })

    useEffect(() => {
        // Simulate fetching data
        // In real app: const { data } = await supabase.from('policies').select('*').eq('id', id).single()

        // Mock data population
        setTimeout(() => {
            setFormData({
                holderName: 'Rajesh Kumar',
                policyNumber: 'GI-2024-001',
                contactNumber: '+91 98765 43210',
                email: 'rajesh.k@example.com',
                type: 'Health',
                startDate: '2024-01-15',
                endDate: '2025-01-14',
                amountPaid: '15000',
                status: 'Active',
                coverage: 'Includes critical illness and hospitalization'
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
        console.log('Updating Policy:', id, formData)

        await new Promise(resolve => setTimeout(resolve, 1000))

        router.push('/dashboard/general') // Or back to policies list
        router.refresh()
    }

    if (loading) return <div className="p-8 text-center">Loading policy details...</div>

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link href="/dashboard/policies" className="text-slate-500 hover:text-slate-800 gap-2 mb-2 inline-flex items-center">
                    <ArrowLeft className="w-4 h-4" /> Back to Policies
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Edit General Policy</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">

                {/* Section: Personal Details */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Policy Holder Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
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
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Policy Information</h3>
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
                            <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Type</label>
                            <select
                                name="type"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.type}
                                onChange={handleChange}
                            >
                                <option value="Health">Health Insurance</option>
                                <option value="Motor">Motor Insurance</option>
                                <option value="Travel">Travel Insurance</option>
                                <option value="Home">Home Insurance</option>
                                <option value="Fire">Fire Insurance</option>
                                <option value="Other">Other</option>
                            </select>
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
                            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                            <input
                                required
                                type="date"
                                name="endDate"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Premium Amount (₹)</label>
                            <input
                                required
                                type="number"
                                name="amountPaid"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.amountPaid}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                name="status"
                                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Expired">Expired</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section: Additional Info */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Coverage Summary</h3>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            name="coverage"
                            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.coverage}
                            onChange={handleChange}
                        />
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
