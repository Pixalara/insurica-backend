'use client'

import { useState } from 'react'
import { LifePolicy } from '../types'
import { X } from 'lucide-react'

interface LifeFormProps {
    initialData?: LifePolicy | null
    onSubmit: (data: Omit<LifePolicy, 'id'>) => void
    onCancel: () => void
}

export function LifeForm({ initialData, onSubmit, onCancel }: LifeFormProps) {
    const [formData, setFormData] = useState<Omit<LifePolicy, 'id'>>(() => {
        if (initialData) {
            return {
                policyNumber: initialData.policyNumber,
                holderName: initialData.holderName,
                contactNumber: initialData.contactNumber,
                email: initialData.email,
                planType: initialData.planType,
                sumAssured: initialData.sumAssured,
                premiumAmount: initialData.premiumAmount,
                premiumFrequency: initialData.premiumFrequency,
                startDate: initialData.startDate.split('T')[0],
                maturityDate: initialData.maturityDate.split('T')[0],
                nextDueDate: initialData.nextDueDate.split('T')[0],
                nominee: initialData.nominee,
                status: initialData.status,
                insurer: initialData.insurer,
                customer_id: initialData.customer_id,
                policy_id: initialData.policy_id,
            }
        }
        return {
            policyNumber: '',
            holderName: '',
            contactNumber: '',
            email: '',
            planType: 'Term Life',
            sumAssured: 0,
            premiumAmount: 0,
            premiumFrequency: 'Yearly',
            startDate: new Date().toISOString().split('T')[0],
            maturityDate: '',
            nextDueDate: '',
            nominee: '',
            status: 'Active',
            insurer: '',
            customer_id: '',
            policy_id: '',
        }
    })



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'sumAssured' || name === 'premiumAmount' ? Number(value) : value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="text-xl font-semibold text-slate-900">
                        {initialData ? 'Edit Policy' : 'New Life Insurance Policy'}
                    </h2>
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Policy Details */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy Number</label>
                            <input
                                type="text"
                                name="policyNumber"
                                required
                                value={formData.policyNumber}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="e.g. LIF-2024-001"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Insurer</label>
                            <input
                                type="text"
                                name="insurer"
                                required
                                value={formData.insurer}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="e.g. LIC"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Holder Name</label>
                            <input
                                type="text"
                                name="holderName"
                                required
                                value={formData.holderName}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Nominee</label>
                            <input
                                type="text"
                                name="nominee"
                                required
                                value={formData.nominee}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Contact Number</label>
                            <input
                                type="tel"
                                name="contactNumber"
                                required
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Plan Type</label>
                            <select
                                name="planType"
                                value={formData.planType}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            >
                                <option value="Term Life">Term Life</option>
                                <option value="Whole Life">Whole Life</option>
                                <option value="Endowment">Endowment</option>
                                <option value="ULIP">ULIP</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Sum Assured (₹)</label>
                            <input
                                type="number"
                                name="sumAssured"
                                min="0"
                                required
                                value={formData.sumAssured}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Premium Amount (₹)</label>
                            <input
                                type="number"
                                name="premiumAmount"
                                min="0"
                                required
                                value={formData.premiumAmount}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Premium Frequency</label>
                            <select
                                name="premiumFrequency"
                                value={formData.premiumFrequency}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Half-Yearly">Half-Yearly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                required
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Maturity Date</label>
                            <input
                                type="date"
                                name="maturityDate"
                                required
                                value={formData.maturityDate}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Next Due Date</label>
                            <input
                                type="date"
                                name="nextDueDate"
                                required
                                value={formData.nextDueDate}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            >
                                <option value="Active">Active</option>
                                <option value="Grace Period">Grace Period</option>
                                <option value="Lapsed">Lapsed</option>
                                <option value="Matured">Matured</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            {initialData ? 'Save Changes' : 'Create Policy'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
