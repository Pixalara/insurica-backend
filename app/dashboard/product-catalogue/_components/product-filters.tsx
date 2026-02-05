'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export function ProductFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [query, setQuery] = useState(searchParams.get('query') || '')
    const category = searchParams.get('category') || 'All'
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
            router.push(`/dashboard/product-catalogue?${params.toString()}`)
        })
    }

    const handleCategoryChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === 'All') {
            params.delete('category')
        } else {
            params.set('category', value)
        }
        startTransition(() => {
            router.push(`/dashboard/product-catalogue?${params.toString()}`)
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
            router.push(`/dashboard/product-catalogue?${params.toString()}`)
        })
    }

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">Search Products</label>
                    <input
                        type="text"
                        placeholder="Search by name or insurer..."
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Categories</option>
                        <option value="General">General Insurance</option>
                        <option value="Health">Health Insurance</option>
                        <option value="Life">Life Insurance</option>
                    </select>
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
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
