import { createClient } from '@/utils/supabase/server'

export default async function DashboardOverview() {
  // Await the client for Next.js 16 compatibility
  const supabase = await createClient()

  // 1. Fetch total clients count
  const { count: clientCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  // 2. Fetch total policies count
  const { count: policyCount } = await supabase
    .from('policies')
    .select('*', { count: 'exact', head: true })

  // 3. Fetch all premium amounts to calculate total
  const { data: premiumData } = await supabase
    .from('policies')
    .select('premium_amount')

  const totalPremium = premiumData?.reduce((acc, curr) => acc + Number(curr.premium_amount), 0) || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Insurica Overview</h1>
        <p className="text-slate-500">Real-time status of your insurance portfolio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Clients Card */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Clients</p>
          <p className="text-4xl font-bold mt-2 text-slate-900">{clientCount || 0}</p>
        </div>

        {/* Active Policies Card */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Policies</p>
          <p className="text-4xl font-bold mt-2 text-slate-900">{policyCount || 0}</p>
        </div>

        {/* Managed Premium Card */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Premium Managed</p>
          <p className="text-4xl font-bold mt-2 text-emerald-600">
            ₹{totalPremium.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  )
}