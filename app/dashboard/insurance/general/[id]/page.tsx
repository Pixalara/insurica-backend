'use client'

import { ArrowLeft, Phone, Mail, Calendar, Info, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Mock data (in a real app, this would be fetched from Supabase)
const MOCK_POLICIES = [
    {
        id: '1',
        policyNumber: 'GI-2024-001',
        holderName: 'Rajesh Kumar',
        contactNumber: '+91 98765 43210',
        email: 'rajesh.k@example.com',
        type: 'Health',
        startDate: '2024-01-15',
        endDate: '2025-01-14',
        amountPaid: 15000,
        status: 'Active',
        coverage: 'Includes critical illness and hospitalization',
        insurer: 'Star Health Insurance',
        paymentMethod: 'UPI'
    },
    {
        id: '2',
        policyNumber: 'GI-2024-002',
        holderName: 'Priya Sharma',
        contactNumber: '+91 98123 45678',
        email: 'priya.s@example.com',
        type: 'Motor',
        startDate: '2023-11-20',
        endDate: '2024-11-19',
        amountPaid: 8500,
        status: 'Active',
        coverage: 'Comprehensive car insurance for Honda City',
        insurer: 'ICICI Lombard',
        paymentMethod: 'Credit Card'
    },
    {
        id: '3',
        policyNumber: 'GI-2023-089',
        holderName: 'Amit Patel',
        contactNumber: '+91 99887 76655',
        email: 'amit.p@example.com',
        type: 'Travel',
        startDate: '2023-12-01',
        endDate: '2023-12-15',
        amountPaid: 2500,
        status: 'Expired',
        coverage: 'International travel to Thailand',
        insurer: 'Tata AIG',
        paymentMethod: 'Debit Card'
    },
    {
        id: '4',
        policyNumber: 'GI-2024-015',
        holderName: 'Sneha Gupta',
        contactNumber: '+91 98765 12345',
        email: 'sneha.g@example.com',
        type: 'Health',
        startDate: '2024-02-01',
        endDate: '2025-01-31',
        amountPaid: 22000,
        status: 'Active',
        coverage: 'Family floater plan',
        insurer: 'HDFC Ergo',
        paymentMethod: 'Net Banking'
    }
]

export default function PolicyDetailsPage() {
    const params = useParams()
    const id = params.id as string
    const policy = MOCK_POLICIES.find(p => p.id === id)

    if (!policy) {
        return (
            <div className="p-8 text-center bg-slate-50 border border-dashed rounded-xl">
                <h2 className="text-xl font-bold text-slate-800">Policy not found</h2>
                <Link href="/dashboard/general" className="text-blue-600 hover:underline mt-2 inline-block">
                    Return to list
                </Link>
            </div>
        )
    }

    const isActive = policy.status === 'Active'

    // Format currency
    const formattedAmount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(policy.amountPaid)

    // Format date helper
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Link href="/dashboard/general" className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Policies
                </Link>
            </div>

            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                                {policy.type} Insurance
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium border flex items-center gap-1 ${isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                                }`}>
                                {isActive ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                {policy.status}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">{policy.holderName}</h1>
                        <p className="text-slate-500 mt-1">Policy ID: {policy.policyNumber}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500 mb-1">Premium Amount</p>
                        <p className="text-2xl font-bold text-slate-900">{formattedAmount}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/50">
                    <div className="p-5">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Dates</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-slate-500">Start Date</p>
                                <p className="font-medium text-slate-900">{formatDate(policy.startDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">End Date</p>
                                <p className="font-medium text-slate-900">{formatDate(policy.endDate)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Contact Details</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-700">{policy.contactNumber}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-700">{policy.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Policy Info</h3>
                        <div className="space-y-2">
                            <div>
                                <p className="text-sm text-slate-500">Insurer</p>
                                <p className="font-medium text-slate-900">{policy.insurer}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Payment</p>
                                <p className="font-medium text-slate-900">{policy.paymentMethod}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <h3 className="text-lg font-bold text-slate-900">Coverage Details</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                    {policy.coverage}. <br /><br />
                    This policy covers accidental damages, third-party liabilities, and other standard inclusions as per the {policy.insurer} policy wording document.
                </p>
            </div>

        </div>
    )
}
