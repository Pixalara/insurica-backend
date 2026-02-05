import Link from 'next/link'
import { PolicyTable } from './_components/policy-table'
import { PolicyFilters } from './_components/policy-filters'
import { PolicyStats } from './_components/policy-stats'
import { getPolicies, getPolicyStats } from './actions'

export default async function PoliciesPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; category?: string; status?: string; page?: string }>
}) {
    const params = await searchParams
    const { query, category, status, page } = params
    const currentPage = Number(page) || 1

    const { policies, totalCount } = await getPolicies({ query, category, status, page: currentPage })
    const stats = await getPolicyStats()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">All Policies</h1>
                    <p className="text-slate-500 text-sm">Manage all insurance policies across categories</p>
                </div>
                <Link
                    href="/dashboard/policies/new"
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                    <span>+ Add New Policy</span>
                </Link>
            </div>

            <PolicyStats stats={stats} />

            <PolicyFilters />

            <PolicyTable policies={policies} />

            <div className="text-center text-xs text-slate-400 mt-4">
                Showing {policies.length} of {totalCount} policies
            </div>
        </div>
    )
}
