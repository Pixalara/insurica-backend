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
    { key: 'id', label: 'Transaction ID', render: (val: string) => <span className="font-mono text-xs">{val}</span> },
    { key: 'customer', label: 'Customer Name', render: (val: string) => <span className="font-medium text-slate-900">{val}</span> },
    { key: 'policy', label: 'Policy Type' },
    { key: 'amount', label: 'Amount', render: (val: number) => <span className="font-bold text-slate-900">₹{val.toLocaleString('en-IN')}</span> },
    { key: 'date', label: 'Date', render: (val: string) => <span className="text-slate-500 text-xs">{val}</span> },
    {
        key: 'status',
        label: 'Status',
        render: (val: string) => (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${val === 'Completed' ? 'bg-green-100 text-green-800' :
                    val === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                {val}
            </span>
        )
    },
]

export function RecentTransactions({ data }: { data: Transaction[] }) {
    return (
        <DataTable
            title="Recent Transactions"
            columns={transactionColumns}
            data={data}
        />
    )
}
