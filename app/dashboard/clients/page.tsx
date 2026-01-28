import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ClientStats } from './_components/client-stats'
import { ClientGrid } from './_components/client-grid'

/**
 * Insurica Client Directory
 * Displays all clients managed by the authenticated agent.
 */
export default async function ClientsPage() {
  // Initialize the async Supabase client for Next.js 16
  const supabase = await createClient()

  // Fetch clients from your Supabase Project ID: qlaslhiuacihctyhfzuk
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading clients:', error.message)
  }

  const clientList = clients || []

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

      <ClientStats totalClients={clientList.length} />

      <ClientGrid clients={clientList} />
    </div>
  )
}
