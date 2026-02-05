
import { Users, UserPlus, Calendar, CheckCircle } from 'lucide-react'
import { LeadMetrics } from '../types'

interface LeadStatsProps {
    stats: LeadMetrics
}

export function LeadStats({ stats }: LeadStatsProps) {
    const statsData = [
        {
            label: "Total Leads",
            value: stats.totalLeads,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: "All time records"
        },
        {
            label: `New Leads (${new Date().toLocaleString('default', { month: 'long' })})`,
            value: stats.newLeadsThisMonth,
            icon: UserPlus,
            color: "text-green-600",
            bg: "bg-green-50",
            trend: "Added this month"
        },
        {
            label: "Follow-ups Due",
            value: stats.followUpsDue,
            icon: Calendar,
            color: "text-amber-600",
            bg: "bg-amber-50",
            trend: "Requires attention"
        },
        {
            label: "Deals Closed",
            value: stats.dealsClosed,
            icon: CheckCircle,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            trend: "Converted to sales"
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsData.map((stat, i) => {
                const Icon = stat.icon
                return (
                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                            </div>
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                <Icon size={20} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs">
                            <span className="text-slate-400 font-medium">{stat.trend}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
