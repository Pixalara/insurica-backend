'use client'

import Link from 'next/link'

interface Column {
    key: string
    label: string
    render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
    columns: Column[]
    data: any[]
    title: string
    viewAllLink?: string
}

export function DataTable({ columns, data, title, viewAllLink }: DataTableProps) {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                {viewAllLink ? (
                    <Link href={viewAllLink} className="text-sm text-blue-600 font-medium hover:text-blue-700">
                        View All
                    </Link>
                ) : (
                    <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
                )}
            </div>
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-400">
                                    No data available.
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    {columns.map((col) => (
                                        <td key={`${idx}-${col.key}`} className="px-6 py-4 text-sm text-slate-700">
                                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
