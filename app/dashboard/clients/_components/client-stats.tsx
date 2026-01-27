import { Users, UserPlus, UserCheck } from 'lucide-react'

interface ClientStatsProps {
    totalClients: number
}

export function ClientStats({ totalClients }: ClientStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-600 text-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm font-medium">Total Clients</p>
                        <h3 className="text-3xl font-bold">{totalClients}</h3>
                    </div>
                </div>
            </div>

            {/* Mock stats for visual completeness as requested */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Active Policy Holders</p>
                        <h3 className="text-3xl font-bold text-slate-900">{totalClients > 0 ? totalClients - 1 : 0}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">New This Month</p>
                        <h3 className="text-3xl font-bold text-slate-900">{totalClients > 0 ? 1 : 0}</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}
