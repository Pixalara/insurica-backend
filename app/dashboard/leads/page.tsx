
import { getLeads, getLeadMetrics } from './actions'
import { LeadStats } from './_components/lead-stats'
import { LeadsFilter } from './_components/leads-filter'
import { LeadsTable } from './_components/leads-table'
import { AddLeadButton } from './_components/add-lead-button'

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; status?: string; page?: string }>
}) {
  const params = await searchParams;
  const query = params.query || ''
  const status = params.status || 'All'
  const currentPage = Number(params.page) || 1

  const { leads, totalCount } = await getLeads({
    query,
    status,
    page: currentPage,
  })

  const stats = await getLeadMetrics()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
            <p className="text-slate-500 text-sm">All Your Leads in One Place</p>
        </div>
        <AddLeadButton />
      </div>

      <LeadStats stats={stats} />

      <LeadsFilter />

      <LeadsTable leads={leads} />
      
      <div className="text-center text-xs text-slate-400 mt-4">
        Showing {leads.length} of {totalCount} leads
      </div>
    </div>
  )
}