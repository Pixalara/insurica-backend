'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { LifeTable } from './_components/life-table'
import { LifeForm } from './_components/life-form'
import { LifePolicy } from './types'

// Mock Data
const MOCK_DATA: LifePolicy[] = [
  {
    id: '1',
    policyNumber: 'LIC-78901234',
    holderName: 'Rajesh Kumar',
    contactNumber: '+91 98765 43210',
    email: 'rajesh.k@example.com',
    planType: 'Endowment',
    sumAssured: 1000000,
    premiumAmount: 25000,
    premiumFrequency: 'Yearly',
    startDate: '2020-05-15',
    maturityDate: '2040-05-15',
    nextDueDate: '2024-05-15',
    nominee: 'Sunita Kumar',
    status: 'Active',
    insurer: 'LIC'
  },
  {
    id: '2',
    policyNumber: 'HDFC-LIFE-456',
    holderName: 'Priya Sharma',
    contactNumber: '+91 98123 45678',
    email: 'priya.s@example.com',
    planType: 'Term Life',
    sumAssured: 10000000,
    premiumAmount: 12000,
    premiumFrequency: 'Yearly',
    startDate: '2022-01-10',
    maturityDate: '2052-01-10',
    nextDueDate: '2024-01-10',
    nominee: 'Rahul Sharma',
    status: 'Active',
    insurer: 'HDFC Life'
  },
  {
    id: '3',
    policyNumber: 'SBI-SMART-999',
    holderName: 'Amit Patel',
    contactNumber: '+91 76543 21098',
    email: 'amit.p@example.com',
    planType: 'ULIP',
    sumAssured: 500000,
    premiumAmount: 5000,
    premiumFrequency: 'Monthly',
    startDate: '2023-08-01',
    maturityDate: '2033-08-01',
    nextDueDate: '2024-03-01',
    nominee: 'Sneha Patel',
    status: 'Grace Period',
    insurer: 'SBI Life'
  }
]

export default function LifeInsurancePage() {
  const [policies, setPolicies] = useState<LifePolicy[]>(MOCK_DATA)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<LifePolicy | null>(null)

  const filteredPolicies = policies.filter(policy =>
    policy.holderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.planType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.policyNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = (data: Omit<LifePolicy, 'id'>) => {
    const newPolicy: LifePolicy = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    }
    setPolicies([newPolicy, ...policies])
    setIsFormOpen(false)
  }

  const handleUpdate = (data: Omit<LifePolicy, 'id'>) => {
    if (!editingPolicy) return

    setPolicies(policies.map(p =>
      p.id === editingPolicy.id
        ? { ...data, id: editingPolicy.id }
        : p
    ))
    setEditingPolicy(null)
    setIsFormOpen(false)
  }

  const handleDelete = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id))
  }

  const openCreateModal = () => {
    setEditingPolicy(null)
    setIsFormOpen(true)
  }

  const openEditModal = (policy: LifePolicy) => {
    setEditingPolicy(policy)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Life Insurance</h1>
          <p className="text-slate-500 text-sm">Manage life insurance policies, premiums, and renewals.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          <span>New Life Policy</span>
        </button>
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

      <LifeTable
        policies={filteredPolicies}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <LifeForm
          initialData={editingPolicy}
          onSubmit={editingPolicy ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingPolicy(null)
          }}
        />
      )}
    </div>
  )
}