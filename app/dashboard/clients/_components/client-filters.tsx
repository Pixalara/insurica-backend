'use client'

import { Search, Filter, X } from 'lucide-react'

interface ClientFiltersProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    statusFilter: string
    setStatusFilter: (status: string) => void
    productFilter: string
    setProductFilter: (product: string) => void
    resetFilters: () => void
}

export function ClientFilters({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    productFilter,
    setProductFilter,
    resetFilters
}: ClientFiltersProps) {
    const hasActiveFilters = statusFilter !== 'All' || productFilter !== 'All' || searchQuery !== ''

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Expired">Expired</option>
                </select>

                <select
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                    <option value="All">All Products</option>
                    <option value="Life Insurance">Life Insurance</option>
                    <option value="Health Insurance">Health Insurance</option>
                    <option value="General Insurance">General Insurance</option>
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
