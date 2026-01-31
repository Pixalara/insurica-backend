'use client'

import { useState, useEffect, Suspense } from 'react'
import { Search } from 'lucide-react'
import { LifeTable } from './_components/life-table'
import { LifePolicy } from './types'
import { getClients, deleteClient } from '../../clients/actions'
import { Client } from '../../clients/types'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

export default function LifeInsurancePage() {
    return (
        <Suspense fallback={
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">Loading...</p>
            </div>
        }>
            <LifeInsuranceContent />
        </Suspense>
    )
}

function LifeInsuranceContent() {
  const searchParams = useSearchParams()
  const [policies, setPolicies] = useState<LifePolicy[]>([])
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [loading, setLoading] = useState(true)

  const fetchPolicies = async () => {
    try {
      setLoading(true)

      const { clients } = await getClients({ product: 'Life Insurance' })
      
      const lifePolicies: LifePolicy[] = clients.map((c: Client) => {

        let insurerName = 'Unknown Insurer'
        const companiesData = c.companies

        if (companiesData) {
            if (Array.isArray(companiesData) && companiesData.length > 0) {
                insurerName = companiesData[0]?.name || 'Unknown Insurer'
            } else if (!Array.isArray(companiesData) && typeof companiesData === 'object' && companiesData.name) {
                insurerName = companiesData.name
            }
        }

        return {
          id: c.id,
          policyNumber: c.policy_number,
          holderName: c.name,
          contactNumber: c.phone || '',
          email: c.email || '',
          planType: c.product_name || 'Term Life',
          sumAssured: c.sum_insured || 0,
          premiumAmount: c.premium_amount || 0,
          premiumFrequency: 'Yearly', // Defaulting as not in DB
          startDate: c.start_date || new Date().toISOString(),
          maturityDate: c.end_date || new Date(new Date().setFullYear(new Date().getFullYear() + 20)).toISOString(),
          nextDueDate: c.end_date || new Date().toISOString(), // Using end_date as proxy for now
          nominee: 'Not Specified', // Not in DB
          status: c.status || 'Active',
          insurer: insurerName
        }
      })
      
      setPolicies(lifePolicies)
    } catch (error) {
      console.error('Failed to fetch life insurance policies:', error)
      toast.error('Failed to fetch policies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolicies()
  }, [])

  const filteredPolicies = policies.filter(policy =>
    policy.holderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.planType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Life Insurance</h1>
          <p className="text-slate-500 text-sm">Manage life insurance policies, premiums, and renewals.</p>
        </div>
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

      {loading ? (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">Loading policies...</p>
        </div>
      ) : (
        <LifeTable
            policies={filteredPolicies}
            onDelete={handleDelete}
        />
      )}
    </div>
  )
}
