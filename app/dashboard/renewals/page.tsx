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
    const filter = (params.filter || '30') as RenewalFilter

    const { renewals, stats } = await getRenewals(filter)

    const filterLabels: Record<RenewalFilter, string> = {
        '30': 'Next 30 Days',
        '60': 'Next 60 Days',
        '90': 'Next 90 Days',
        'overdue': 'Overdue Policies',
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

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
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
