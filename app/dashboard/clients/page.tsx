import Link from 'next/link'
import { ClientStats } from './_components/client-stats'
import { ClientTable } from './_components/client-table'
import { ClientFilters } from './_components/client-filters'
import { getClients, getClientMetrics } from './actions'
import { Client } from './types'

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; status?: string; product?: string; page?: string }>
}) {
  const params = await searchParams; // Next.js 15 requires awaiting params
  const query = params.query || ''
  const status = params.status || 'All'
  const product = params.product || 'All'
  const currentPage = Number(params.page) || 1

  const { clients, totalCount } = await getClients({
    query,
    status,
    product,
    page: currentPage,
  })

  const stats = await getClientMetrics()



  return (
    <div className="space-y-6 overflow-x-hidden">
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

      <ClientStats stats={stats} />

      <ClientFilters />

      <ClientTable clients={clients as Client[]} />

      <div className="text-center text-xs text-slate-400 mt-4">
        Showing {clients.length} of {totalCount} clients
      </div>
    </div>
  )
}
