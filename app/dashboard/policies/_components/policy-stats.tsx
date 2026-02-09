'use client'

interface PolicyStatsProps {
    stats: {
        total: number
        active: number
        expired: number
        cancelled: number
    }
}

export function PolicyStats({ stats }: PolicyStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Policies</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active</p>
                <p className="text-3xl font-black text-green-600 mt-2">{stats.active}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expired</p>
                <p className="text-3xl font-black text-orange-600 mt-2">{stats.expired}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cancelled</p>
                <p className="text-3xl font-black text-gray-600 mt-2">{stats.cancelled}</p>
            </div>
        </div>
    )
}
