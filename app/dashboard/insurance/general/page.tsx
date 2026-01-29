'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { GeneralTable } from './_components/general-table'
import { GeneralPolicy } from './types'

// Mock Data for demonstration
const MOCK_POLICIES: GeneralPolicy[] = [
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
        sumInsured: 500000,
        status: 'Active'
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
        sumInsured: 300000,
        status: 'Active'
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
        sumInsured: 100000,
        status: 'Expired'
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
        sumInsured: 750000,
        status: 'Active'
    }
]

export default function GeneralInsurancePage() {
    const [policies, setPolicies] = useState<GeneralPolicy[]>(MOCK_POLICIES)
    const [searchQuery, setSearchQuery] = useState('')

    // Load clients from storage and merge
    useEffect(() => {
        import('../../clients/client-storage').then(({ ClientStorage }) => {
            const clients = ClientStorage.getClients()
            const generalClients = clients
                .filter(c => c.productType === 'General Insurance')
                .map(c => ({
                    id: c.id,
                    policyNumber: `GI-${c.id.substring(0, 8).toUpperCase()}`,
                    holderName: c.name,
                    contactNumber: c.phone,
                    email: c.email,
                    type: 'Health' as const, // Default to Health or random as subtype isn't in client yet
                    startDate: c.created_at || new Date().toISOString(),
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
                    amountPaid: 10000,
                    sumInsured: 300000,
                    status: (c.policyStatus as any) || 'Active'
                } as GeneralPolicy))

            setPolicies(prev => {
                const existingIds = new Set(MOCK_POLICIES.map(p => p.id))
                const newClients = generalClients.filter(c => !existingIds.has(c.id))
                return [...MOCK_POLICIES, ...newClients]
            })
        })
    }, [])

    const filteredPolicies = policies.filter(policy =>
        policy.holderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">General Insurance</h1>
                    <p className="text-slate-500 text-sm">Manage health, motor, and other general insurance policies.</p>
                </div>

            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search by name, policy number, or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                />
            </div>

            <GeneralTable
                policies={filteredPolicies}
                onDelete={(id) => setPolicies(policies.filter(p => p.id !== id))}
            />
        </div>
    )
}