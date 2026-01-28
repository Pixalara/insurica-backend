'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { HealthTable } from './_components/health-table'
import { HealthPolicy } from './types'

// Mock Data for demonstration
const MOCK_POLICIES: HealthPolicy[] = [
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
        insurer: 'Star Health'
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
        insurer: 'HDFC Ergo'
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
        insurer: 'Niva Bupa'
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
        insurer: 'ICICI Lombard'
    }
]

export default function HealthInsurancePage() {
    const [policies, setPolicies] = useState<HealthPolicy[]>(MOCK_POLICIES)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredPolicies = policies.filter(policy =>
        policy.holderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.planType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Health Insurance</h1>
                    <p className="text-slate-500 text-sm">Manage health policies, renewal dates, and claims.</p>
                </div>
                <Link
                    href="/dashboard/insurance/health/new"
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2"
                >
                    <span>+ New Health Policy</span>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search by name, policy number, or plan type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                />
            </div>

            <HealthTable
                policies={filteredPolicies}
                onDelete={(id) => setPolicies(policies.filter(p => p.id !== id))}
            />
        </div>
    )
}