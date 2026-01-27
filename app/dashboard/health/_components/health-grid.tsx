import { HealthPolicy } from '../types'
import { HealthCard } from './health-card'

interface HealthGridProps {
    policies: HealthPolicy[]
}

export function HealthGrid({ policies }: HealthGridProps) {
    if (policies.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <h3 className="text-lg font-medium text-slate-900">No health policies found</h3>
                <p className="text-slate-500">Create a new health policy to get started.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {policies.map((policy) => (
                <HealthCard key={policy.id} policy={policy} />
            ))}
        </div>
    )
}
