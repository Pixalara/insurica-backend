'use client'

import { DataTable } from './data-table'

interface Transaction {
    id: string
    customer: string
    policy: string
    amount: number
    date: string
    status: string
}

const transactionColumns = [
    { key: 'id', label: 'Policy Number', render: (val: unknown) => <span className="font-mono text-xs">{val as string}</span> },
    { key: 'customer', label: 'Insured', render: (val: unknown) => <span className="font-medium text-slate-900">{val as string}</span> },
    { key: 'policy', label: 'Policy Type' },
    { key: 'amount', label: 'Premium', render: (val: unknown) => <span className="font-bold text-slate-900">₹{(val as number).toLocaleString('en-IN')}</span> },
    { key: 'date', label: 'Issued On', render: (val: unknown) => <span className="text-slate-500 text-xs">{val as string}</span> },
    {
        key: 'status',
        label: 'Status',
        render: (val: unknown) => {
            const status = (val as string).toLowerCase()
            let colorClass = 'bg-slate-100 text-slate-800' // Default / Inactive

            if (status === 'active') colorClass = 'bg-green-100 text-green-800'
            else if (status === 'expired') colorClass = 'bg-orange-100 text-orange-800'
            else if (status === 'cancelled') colorClass = 'bg-slate-100 text-slate-800'
            
            return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${colorClass}`}>
                    {val as string}
                </span>
            )
        }
    },
]

export function RecentTransactions({ data }: { data: Transaction[] }) {
    return (
        <DataTable
            title="Latest Policy Activity"
            columns={transactionColumns}
            data={data as unknown as Record<string, unknown>[]}
            viewAllLink="/dashboard/clients"
        />
    )
}
