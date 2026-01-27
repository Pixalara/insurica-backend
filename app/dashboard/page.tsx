import { createClient } from '@/utils/supabase/server'

export default async function DashboardOverview() {
  const supabase = await createClient()

  // Fetching real-time counts from Project ID: qlaslhiuacihctyhfzuk
  const { count: clientCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  const { count: policyCount } = await supabase
    .from('policies')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back to the Insurica management suite.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Metric Card: Clients */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Clients</p>
          <p className="text-4xl font-black text-slate-900 mt-2">{clientCount || 0}</p>
        </div>

        {/* Metric Card: Policies */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Policies</p>
          <p className="text-4xl font-black text-slate-900 mt-2">{policyCount || 0}</p>
        </div>
      </div>
    </div>
  )
}