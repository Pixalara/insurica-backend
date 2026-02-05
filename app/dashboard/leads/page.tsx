import Link from 'next/link'
import { LeadTable } from './_components/lead-table'
import { LeadFilters } from './_components/lead-filters'
import { LeadStats } from './_components/lead-stats'
import { getLeads, getLeadStats } from './actions'

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; status?: string }>
}) {
  const params = await searchParams
  const { query, status } = params

  const { leads, totalCount } = await getLeads({ query, status })
  const stats = await getLeadStats()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-slate-500 text-sm">Track and manage potential clients</p>
        </div>
        <Link
          href="/dashboard/leads/new"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          <span>+ Add New Lead</span>
        </Link>
      </div>

      <LeadStats stats={stats} />

      <LeadFilters />

      <LeadTable leads={leads} />

      <div className="text-center text-xs text-slate-400 mt-4">
        Showing {leads.length} of {totalCount} leads
      </div>
    </div>
  )
}