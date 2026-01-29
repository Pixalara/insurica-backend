'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ClientStats } from './_components/client-stats'
import { ClientTable } from './_components/client-table'
import { Client } from './types'
import { ClientStorage } from './client-storage'

/**
 * Insurica Client Directory
 * Displays all clients managed by the authenticated agent.
 */
import { ClientFilters } from './_components/client-filters'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [productFilter, setProductFilter] = useState('All')

  useEffect(() => {
    // Load clients from local storage on mount
    const loadClients = () => {
      const data = ClientStorage.getClients()
      setClients(data)
      setLoading(false)
    }

    loadClients()

    // Listen for storage events to sync across tabs/windows if needed
    window.addEventListener('storage', loadClients)
    return () => window.removeEventListener('storage', loadClients)
  }, [])

  // Filter Logic
  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.phone && client.phone.includes(searchQuery))

    const matchesStatus = statusFilter === 'All' || client.policyStatus === statusFilter

    // Exact match for product or substring match for flexibility
    const matchesProduct = productFilter === 'All' ||
      (client.productType && client.productType.includes(productFilter.replace(' Insurance', ''))) ||
      client.productType === productFilter

    return matchesSearch && matchesStatus && matchesProduct
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Client Directory</h1>
          <p className="text-slate-500 text-sm">Manage your client relationships, policies, and portfolios.</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          <span>+ Add New Client</span>
        </Link>
      </div>

      <ClientStats totalClients={clients.length} />

      <ClientFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        productFilter={productFilter}
        setProductFilter={setProductFilter}
        resetFilters={() => {
          setSearchQuery('')
          setStatusFilter('All')
          setProductFilter('All')
        }}
      />

      <ClientTable clients={filteredClients} onRefresh={() => setClients(ClientStorage.getClients())} />
    </div>
  )
}
