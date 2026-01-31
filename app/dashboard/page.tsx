import { createClient } from '@/utils/supabase/server'
import { SalesTrendChart } from './_components/analytics/sales-trend-chart'
import { TopProductsChart } from './_components/analytics/top-products-chart'
import { RevenuePieChart } from './_components/analytics/revenue-pie-chart'
import { RecentTransactions } from './_components/analytics/recent-transactions'
import { format, subDays, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns'
import { Users, Shield, ShoppingBag, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardOverview() {
  const supabase = await createClient()

 
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching dashboard data:', error)
   
  }

  const policies = clients || []


  const totalPremium = policies.reduce((sum, p) => sum + (Number(p.premium_amount) || 0), 0)
  const activePoliciesCount = policies.filter(p => p.status === 'Active').length
  const totalClientsCount = new Set(policies.map(p => p.email).filter(Boolean)).size // specific count by unique email
 
  
  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const lastMonthStart = startOfMonth(subMonths(now, 1))
  const lastMonthEnd = endOfMonth(subMonths(now, 1))

  const currentMonthPremium = policies
    .filter(p => new Date(p.created_at) >= currentMonthStart)
    .reduce((sum, p) => sum + (Number(p.premium_amount) || 0), 0)

  const lastMonthPremium = policies
    .filter(p => {
        const d = new Date(p.created_at)
        return d >= lastMonthStart && d <= lastMonthEnd
    })
    .reduce((sum, p) => sum + (Number(p.premium_amount) || 0), 0)

  const premiumGrowth = lastMonthPremium > 0 
    ? ((currentMonthPremium - lastMonthPremium) / lastMonthPremium) * 100 
    : 0

 
  
  const revenueByCategory = policies.reduce((acc, p) => {
    const cat = p.category || 'Other'
    acc[cat] = (acc[cat] || 0) + (Number(p.premium_amount) || 0)
    return acc
  }, {} as Record<string, number>)

  const pieChartData = Object.entries(revenueByCategory).map(([name, value]) => ({ name, value: Number(value) }))

 
  const sixMonthsAgo = subMonths(now, 6)
  const monthsInterval = eachMonthOfInterval({ start: sixMonthsAgo, end: now })
  
  const salesTrendData = monthsInterval.map((month: Date) => {
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)
      const count = policies.filter(p => {
          const d = new Date(p.created_at)
          return d >= monthStart && d <= monthEnd
      }).length
      return {
          name: format(month, 'MMM'),
          sales: count
      }
  })

 
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

  const upcomingRenewals = policies.filter(p => {
      if (!p.end_date) return false
      const end = new Date(p.end_date)
      return end >= now && end <= thirtyDaysFromNow && p.status === 'Active'
  }).slice(0, 5) 

 
  const recentTransactionsData = policies.slice(0, 5).map(p => ({
      id: p.policy_number || 'N/A', 
      customer: p.name,
      policy: p.category, 
      amount: Number(p.premium_amount) || 0,
      date: p.created_at ? format(new Date(p.created_at), 'yyyy-MM-dd') : 'N/A',
      status: p.status || 'Active'
  }))

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Agent Dashboard</h1>
          <p className="text-slate-500 mt-1">Performance Overview & Analytics</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-slate-500">Total Revenue (YTD)</p>
          <p className="text-2xl font-black text-blue-600">{formatCurrency(totalPremium)}</p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Clients</p>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-1">{totalClientsCount}</p>
          <p className="text-xs text-slate-400 font-medium mt-2 flex items-center">Unique insureds</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Policies</p>
              <div className="p-2 bg-green-50 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-1">{activePoliciesCount}</p>
          <p className="text-xs text-green-600 font-medium mt-2 flex items-center">
            {totalClientsCount > 0 ? `${Math.round((activePoliciesCount / policies.length) * 100)}% of total` : 'No policies'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Policies Sold ({format(now, 'MMMM')})</p>
              <div className="p-2 bg-purple-50 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-purple-600" />
              </div>
          </div>
           {/* Showing current month count */}
          <p className="text-3xl font-black text-slate-900 mt-1">
             {policies.filter(p => new Date(p.created_at) >= currentMonthStart).length}
          </p>
          <p className={`text-xs font-medium mt-2 flex items-center ${premiumGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
             {premiumGrowth >= 0 ? '↑' : '↓'} {Math.abs(Math.round(premiumGrowth))}% Revenue Growth
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Renewals Due</p>
              <div className="p-2 bg-orange-50 rounded-lg">
                <RefreshCw className="h-5 w-5 text-orange-600" />
              </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-1">{upcomingRenewals.length}</p>
          <p className="text-xs text-orange-600 font-medium mt-2 flex items-center">Next 30 Days</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesTrendChart data={salesTrendData} />
        <RevenuePieChart data={pieChartData} />
      </div>

      {/* Charts Row 2 & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
             {/* Replaced TopProducts with Upcoming Renewals List for better utility */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-full">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Renewals</h3>
                {upcomingRenewals.length === 0 ? (
                    <p className="text-sm text-slate-500">No renewals in the next 30 days.</p>
                ) : (
                    <div className="space-y-3">
                        {upcomingRenewals.map((policy) => {
                             // Determine the base URL based on category
                             let baseUrl = '/dashboard/insurance/general'
                             if (policy.category?.includes('Health')) baseUrl = '/dashboard/insurance/health'
                             if (policy.category?.includes('Life')) baseUrl = '/dashboard/insurance/life'

                             return (
                                <Link 
                                    href={`${baseUrl}?search=${encodeURIComponent(policy.policy_number || policy.name)}`}
                                    key={policy.id} 
                                    className="block"
                                >
                                    <div className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                        <div>
                                            <p className="font-medium text-slate-900 text-sm">
                                                {policy.name} <span className="text-xs text-slate-400 font-normal ml-1">({policy.category})</span>
                                            </p>
                                            <p className="text-xs text-slate-500">{policy.policy_number}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-semibold text-orange-600">
                                                {policy.end_date ? format(new Date(policy.end_date), 'MMM d') : '-'}
                                            </p>
                                            <p className="text-[10px] text-slate-400">Expires</p>
                                        </div>
                                    </div>
                                </Link>
                             )
                        })}
                    </div>
                )}
            </div>
        </div>
        <div className="lg:col-span-2 min-h-[400px]">
          <RecentTransactions data={recentTransactionsData} />
        </div>
      </div>
    </div>
  )
}