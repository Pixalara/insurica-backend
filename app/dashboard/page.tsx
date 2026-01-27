import { createClient } from '@/utils/supabase/server'
import { SalesTrendChart } from './_components/analytics/sales-trend-chart'
import { TopProductsChart } from './_components/analytics/top-products-chart'
import { RevenuePieChart } from './_components/analytics/revenue-pie-chart'
import { RecentTransactions } from './_components/analytics/recent-transactions'

export default async function DashboardOverview() {
  const supabase = await createClient()

  // Fetching real-time counts from Project ID: qlaslhiuacihctyhfzuk
  const { count: clientCount } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  const { count: policyCount } = await supabase
    .from('policies')
    .select('*', { count: 'exact', head: true })

  // Mock Data for Table
  const recentTransactions = [
    { id: 'TXN-001', customer: 'Vikram Singh', policy: 'Health Family Floater', amount: 12500, date: '2024-03-01', status: 'Completed' },
    { id: 'TXN-002', customer: 'Rajesh Kumar', policy: 'General Health', amount: 15000, date: '2024-02-28', status: 'Completed' },
    { id: 'TXN-003', customer: 'Anjali Desai', policy: 'Individual Health', amount: 8000, date: '2024-02-25', status: 'Pending' },
    { id: 'TXN-004', customer: 'Priya Sharma', policy: 'Motor Insurance', amount: 8500, date: '2024-02-20', status: 'Completed' },
    { id: 'TXN-005', customer: 'Kavita Reddy', policy: 'Critical Illness', amount: 22000, date: '2024-02-18', status: 'Completed' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Agent Dashboard</h1>
          <p className="text-slate-500 mt-1">Performance Overview & Analytics</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-slate-500">Total Revenue (YTD)</p>
          <p className="text-2xl font-black text-blue-600">₹12,45,000</p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Clients</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{clientCount || 128}</p>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center">↑ 12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Policies</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{policyCount || 345}</p>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center">↑ 5% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Policies Sold (Feb)</p>
          <p className="text-3xl font-black text-slate-900 mt-1">42</p>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center">↑ 8% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Conversion Rate</p>
          <p className="text-3xl font-black text-slate-900 mt-1">24%</p>
          <p className="text-xs text-slate-400 font-medium mt-2 flex items-center">─ Consistent</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesTrendChart />
        <RevenuePieChart />
      </div>

      {/* Charts Row 2 & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TopProductsChart />
        </div>
        <div className="lg:col-span-2 min-h-[400px]">
          <RecentTransactions data={recentTransactions} />
        </div>
      </div>
    </div>
  )
}