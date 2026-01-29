'use client'

import { Search, Filter, X } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export function ClientFilters() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        params.set('page', '1')
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value && value !== 'All') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        params.set('page', '1')
        replace(`${pathname}?${params.toString()}`)
    }

    const resetFilters = () => {
        replace(pathname)
    }

    const searchQuery = searchParams.get('query')?.toString() || ''
    const statusFilter = searchParams.get('status')?.toString() || 'All'
    const productFilter = searchParams.get('product')?.toString() || 'All'
    
    const hasActiveFilters = searchQuery || statusFilter !== 'All' || productFilter !== 'All'

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    defaultValue={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <select
                    value={statusFilter}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Expired">Expired</option>
                </select>

                <select
                    value={productFilter}
                    onChange={(e) => handleFilterChange('product', e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                    <option value="All">All Products</option>
                    <option value="Life">Life Insurance</option>
                    <option value="Health">Health Insurance</option>
                    <option value="General">General Insurance</option>
                </select>
            </div>

            {hasActiveFilters && (
                <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap"
                >
                    <X size={14} />
                    <span>Clear</span>
                </button>
            )}
        </div>
    )
}
