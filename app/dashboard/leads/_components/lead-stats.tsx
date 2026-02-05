'use client'

interface LeadStatsProps {
    stats: {
        total: number
        new: number
        contacted: number
        qualified: number
        converted: number
    }
}

export function LeadStats({ stats }: LeadStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Leads</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">New</p>
                <p className="text-3xl font-black text-blue-600 mt-2">{stats.new}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contacted</p>
                <p className="text-3xl font-black text-yellow-600 mt-2">{stats.contacted}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qualified</p>
                <p className="text-3xl font-black text-purple-600 mt-2">{stats.qualified}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Converted</p>
                <p className="text-3xl font-black text-green-600 mt-2">{stats.converted}</p>
            </div>
        </div>
    )
}
