'use client'

import { ArrowLeft, Phone, Mail, Info, Heart, Users, Activity, CheckCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Mock data (in a real app, this would be fetched from Supabase)
const MOCK_POLICIES = [
    {
        id: '1',
        policyNumber: 'HI-2024-001',
        holderName: 'Vikram Singh',
        contactNumber: '+91 98765 00001',
        email: 'vikram.s@example.com',
        planType: 'Family Floater',
        sumInsured: 500000,
        premiumAmount: 12500,
        startDate: '2024-03-01',
        endDate: '2025-02-28',
        renewalDate: '2025-02-28',
        membersCovered: 4,
        status: 'Active',
        insurer: 'Star Health',
        preExistingDiseases: 'None',
        nominee: 'Priya Singh (Spouse)'
    },
    {
        id: '2',
        policyNumber: 'HI-2024-042',
        holderName: 'Anjali Desai',
        contactNumber: '+91 98123 99999',
        email: 'anjali.d@example.com',
        planType: 'Individual',
        sumInsured: 1000000,
        premiumAmount: 8000,
        startDate: '2023-06-15',
        endDate: '2024-06-14',
        renewalDate: '2024-06-14',
        membersCovered: 1,
        status: 'Active',
        insurer: 'HDFC Ergo',
        preExistingDiseases: 'Thyroid',
        nominee: 'Rohan Desai (Brother)'
    },
    {
        id: '3',
        policyNumber: 'HI-2023-112',
        holderName: 'Ramesh Gupta',
        contactNumber: '+91 99887 11223',
        email: 'ramesh.g@example.com',
        planType: 'Senior Citizen',
        sumInsured: 300000,
        premiumAmount: 18000,
        startDate: '2023-01-10',
        endDate: '2024-01-09',
        renewalDate: '2024-01-09',
        membersCovered: 2,
        status: 'Expired',
        insurer: 'Niva Bupa',
        preExistingDiseases: 'Diabetes, Hypertension',
        nominee: 'Suresh Gupta (Son)'
    },
    {
        id: '4',
        policyNumber: 'HI-2024-088',
        holderName: 'Kavita Reddy',
        contactNumber: '+91 98765 55443',
        email: 'kavita.r@example.com',
        planType: 'Critical Illness',
        sumInsured: 2500000,
        premiumAmount: 22000,
        startDate: '2024-02-01',
        endDate: '2025-01-31',
        renewalDate: '2025-01-31',
        membersCovered: 1,
        status: 'Active',
        insurer: 'ICICI Lombard',
        preExistingDiseases: 'None',
        nominee: 'Arjun Reddy (Husband)'
    }
]

export default function HealthPolicyDetailsPage() {
    const params = useParams()
    const id = params.id as string
    const policy = MOCK_POLICIES.find(p => p.id === id)

    if (!policy) {
        return (
            <div className="p-8 text-center bg-slate-50 border border-dashed rounded-xl">
                <h2 className="text-xl font-bold text-slate-800">Policy not found</h2>
                <Link href="/dashboard/health" className="text-blue-600 hover:underline mt-2 inline-block">
                    Return to list
                </Link>
            </div>
        )
    }

    const isActive = policy.status === 'Active'

    // Format currency
    const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(val)

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
                <Link href="/dashboard/health" className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-2 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Health Policies
                </Link>
            </div>

            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex items-center gap-1">
                                <Heart className="w-3 h-3" /> {policy.planType}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium border flex items-center gap-1 ${isActive ? 'bg-green-50 text-green-700 border-green-200' :
                                policy.status === 'Grace Period' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                                }`}>
                                {isActive ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                {policy.status}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">{policy.holderName}</h1>
                        <p className="text-slate-500 mt-1">Policy NO: {policy.policyNumber}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500 mb-1">Sum Insured</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(policy.sumInsured)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/50">
                    <div className="p-5">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Coverage Period</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-slate-500">Effective Date</p>
                                <p className="font-medium text-slate-900">{formatDate(policy.startDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Expiry / Renewal</p>
                                <p className="font-medium text-slate-900">{formatDate(policy.renewalDate)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Policy Contact</h3>
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
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Plan Details</h3>
                        <div className="space-y-2">
                            <div>
                                <p className="text-sm text-slate-500">Insurer</p>
                                <p className="font-medium text-slate-900">{policy.insurer}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Premium</p>
                                <p className="font-medium text-slate-900">{formatCurrency(policy.premiumAmount)} / yr</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical & Members Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-purple-500" />
                        <h3 className="text-lg font-bold text-slate-900">Members Covered</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mb-2">{policy.membersCovered}</p>
                    <p className="text-sm text-slate-500">
                        Total lives insured under this {policy.planType} policy.
                    </p>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-sm text-slate-500">Nominee</p>
                        <p className="font-medium text-slate-900">{policy.nominee}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-red-500" />
                        <h3 className="text-lg font-bold text-slate-900">Medical History</h3>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Pre-existing Diseases Declared</p>
                        <p className="font-medium text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            {policy.preExistingDiseases}
                        </p>
                    </div>
                    <div className="mt-4">
                        <div className="flex gap-2 items-start bg-blue-50 text-blue-700 p-3 rounded text-sm">
                            <Info className="w-4 h-4 mt-0.5 shrink-0" />
                            <p>Waiting periods may apply for specific treatments based on policy terms.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
