import { RenewalStats } from './_components/renewal-stats'
import { RenewalTable } from './_components/renewal-table'
import { getRenewals } from './actions'
import type { RenewalFilter } from './types'

export default async function RenewalsPage({
    searchParams,
}: {
    searchParams: Promise<{ filter?: string }>
}) {
    const params = await searchParams
    const filter = (params.filter || 'this_month') as RenewalFilter

    const { renewals, stats } = await getRenewals(filter)

    const filterLabels: Record<RenewalFilter, string> = {
        'this_month': 'Renewals This Month',
        'next_month': 'Upcoming Next Month',
        'expired': 'Expired Policies',
        'lost': 'Lost / Cancelled',
    }

    return (
        <div className="space-y-6 overflow-x-hidden">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Policy Renewals</h1>
                    <p className="text-slate-500 text-sm">Track and manage upcoming policy renewals</p>
                </div>
            </div>

            <RenewalStats stats={stats} />

            <div className="flex gap-2 mb-6 overfloaw-x-auto pb-2">
                {(Object.keys(filterLabels) as RenewalFilter[]).map((key) => (
                    <a
                        key={key}
                        href={`/dashboard/renewals?filter=${key}`}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === key
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {filterLabels[key]}
                    </a>
                ))}
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
                <p className="text-sm font-medium text-blue-800">
                    Showing renewals for: <span className="font-bold">{filterLabels[filter]}</span>
                </p>
            </div>

            <RenewalTable renewals={renewals} />

            <div className="text-center text-xs text-slate-400 mt-4">
                {renewals.length} {renewals.length === 1 ? 'renewal' : 'renewals'} found
            </div>
        </div>
    )
}
