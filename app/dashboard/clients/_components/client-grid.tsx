import { Client } from '../types'
import { ClientCard } from './client-card'

interface ClientGridProps {
    clients: Client[]
}

export function ClientGrid({ clients }: ClientGridProps) {
    if (clients.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <h3 className="text-lg font-medium text-slate-900">No clients found</h3>
                <p className="text-slate-500">Get started by adding a new client.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clients.map((client) => (
                <ClientCard key={client.id} client={client} />
            ))}
        </div>
    )
}
