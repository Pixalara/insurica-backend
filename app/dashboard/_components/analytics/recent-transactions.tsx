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
    { key: 'id', label: 'Policy Number', render: (val: string) => <span className="font-mono text-xs">{val}</span> },
    { key: 'customer', label: 'Insured', render: (val: string) => <span className="font-medium text-slate-900">{val}</span> },
    { key: 'policy', label: 'Policy Type' },
    { key: 'amount', label: 'Premium', render: (val: number) => <span className="font-bold text-slate-900">₹{val.toLocaleString('en-IN')}</span> },
    { key: 'date', label: 'Issued On', render: (val: string) => <span className="text-slate-500 text-xs">{val}</span> },
    {
        key: 'status',
        label: 'Status',
        render: (val: string) => {
            const status = val.toLowerCase()
            let colorClass = 'bg-slate-100 text-slate-800' // Default / Inactive

            if (status === 'active') colorClass = 'bg-green-100 text-green-800'
            else if (status === 'expired') colorClass = 'bg-red-100 text-red-800'
            
            return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${colorClass}`}>
                    {val}
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
            data={data}
            viewAllLink="/dashboard/clients"
        />
    )
}
