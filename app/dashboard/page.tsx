import { createClient } from '@/utils/supabase/server'

export default async function DashboardOverview() {
  const supabase = createClient()

  // Fetch real counts from Supabase
  const { count: clientCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  const { count: policyCount } = await supabase
    .from('policies')
    .select('*', { count: 'exact', head: true })

  // Calculate Total Premium
  const { data: premiumData } = await supabase
    .from('policies')
    .select('premium_amount')

  const totalPremium = premiumData?.reduce((acc, curr) => acc + Number(curr.premium_amount), 0) || 0

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Insurica Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <p className="text-sm text-slate-500 font-medium uppercase">Total Clients</p>
          <p className="text-3xl font-bold mt-1">{clientCount || 0}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <p className="text-sm text-slate-500 font-medium uppercase">Active Policies</p>
          <p className="text-3xl font-bold mt-1">{policyCount || 0}</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <p className="text-sm text-slate-500 font-medium uppercase">Total Premium Managed</p>
          <p className="text-3xl font-bold mt-1 text-green-600">
            ₹{totalPremium.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  )
}