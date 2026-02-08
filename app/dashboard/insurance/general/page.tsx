'use client'

import { useState, useEffect, Suspense } from 'react'
import { Search } from 'lucide-react'
import { GeneralTable } from './_components/general-table'
import { GeneralPolicy } from './types'
import { Client } from '../../clients/types'
import { getClients, deleteClient } from '../../clients/actions'
import { toast } from 'sonner'

import { useSearchParams } from 'next/navigation'

export default function GeneralInsurancePage() {
    return (
        <Suspense fallback={
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">Loading...</p>
            </div>
        }>
            <GeneralInsuranceContent />
        </Suspense>
    )
}

function GeneralInsuranceContent() {
    const searchParams = useSearchParams()
    const [policies, setPolicies] = useState<GeneralPolicy[]>([])
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
    const [loading, setLoading] = useState(true)

    const fetchPolicies = async () => {
        try {
            setLoading(true)

            const { clients } = await getClients({ product: 'General Insurance' })
            
            const generalPolicies: GeneralPolicy[] = clients.map((c: Client) => {
                // Get insurer name from the backward compat mapping
                let insurerName = c.insurance_company || 'Unknown Insurer'
                const companiesData = c.companies
                if (Array.isArray(companiesData) && companiesData.length > 0) {
                    insurerName = (companiesData[0] as { name: string }).name || insurerName
                } else if (typeof companiesData === 'object' && companiesData && 'name' in companiesData) {
                    insurerName = (companiesData as unknown as { name: string }).name
                }

                return {
                    id: c.id || c.policy_id,
                    policy_id: c.policy_id,
                    customer_id: c.customer_id,
                    policyNumber: c.policy_number || '',
                    holderName: c.name || 'Unknown',
                    contactNumber: c.phone || '',
                    email: c.email || '',
                    type: c.product_name || 'General',
                    insurerName: insurerName,
                    startDate: c.start_date || new Date().toISOString(),
                    endDate: c.end_date || new Date().toISOString(),
                    amountPaid: c.premium_amount || 0,
                    sumInsured: c.sum_insured || 0,
                    status: (c.status as 'Active' | 'Expired' | 'Cancelled') || 'Active'
                }
            })
            
            setPolicies(generalPolicies)
        } catch (error) {
            console.error('Failed to fetch general insurance policies:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPolicies()
    }, [])

    const handleDelete = async (id: string) => {
        try {
            await deleteClient(id)
            setPolicies(policies.filter(p => p.id !== id))
            toast.success('Policy deleted successfully')
        } catch (error) {
            console.error('Failed to delete policy:', error)
            toast.error('Failed to delete policy')
        }
    }

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

            {loading ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">Loading policies...</p>
                </div>
            ) : (
                <GeneralTable
                    policies={filteredPolicies}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}
