'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export function LeadFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [query, setQuery] = useState(searchParams.get('query') || '')
    const status = searchParams.get('status') || 'All'

    const handleSearch = (value: string) => {
        setQuery(value)
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set('query', value)
        } else {
            params.delete('query')
        }
        startTransition(() => {
            router.push(`/dashboard/leads?${params.toString()}`)
        })
    }

    const handleStatusChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === 'All') {
            params.delete('status')
        } else {
            params.set('status', value)
        }
        startTransition(() => {
            router.push(`/dashboard/leads?${params.toString()}`)
        })
    }

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">Search Leads</label>
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">Status</label>
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
