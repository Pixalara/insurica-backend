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
export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading clients...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Client Directory</h1>
          <p className="text-slate-500 text-sm">Manage your client relationships and portfolios.</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2"
        >
          <span>+ Add New Client</span>
        </Link>
      </div>

      <ClientStats totalClients={clients.length} />

      <ClientTable clients={clients} onRefresh={() => setClients(ClientStorage.getClients())} />
    </div>
  )
}
