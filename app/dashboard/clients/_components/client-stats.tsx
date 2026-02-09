import { Users, FileCheck, AlertCircle, IndianRupee } from 'lucide-react'

interface ClientStatsProps {
    stats: {
        totalClients: number
        activePolicies: number
        pendingRenewals: number
        totalPremium: number
    }
}

export function ClientStats({ stats: { totalClients, activePolicies, pendingRenewals, totalPremium } }: ClientStatsProps) {

    const formatPremium = (amount: number) => {
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(1)}L`
        }
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
    }

    const statsData = [
        {
            label: "Total Clients",
            value: totalClients,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: "Total registered clients"
        },
        {
            label: "Active Policies",
            value: activePolicies,
            icon: FileCheck,
            color: "text-green-600",
            bg: "bg-green-50",
            trend: "Currently active policies"
        },
        {
            label: "Pending Renewals",
            value: pendingRenewals,
            icon: AlertCircle,
            color: "text-amber-600",
            bg: "bg-amber-50",
            trend: "Expiring in 30 days"
        },
        {
            label: "Total Premium",
            value: formatPremium(totalPremium),
            icon: IndianRupee,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            trend: "Total premium volume"
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
