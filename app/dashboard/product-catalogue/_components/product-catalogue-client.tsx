'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Upload, Package, Search, X, Filter } from 'lucide-react'
import { UploadProductModal } from './upload-product-modal'
import { ProductCard } from './product-card'
import type { Product } from '../types'

interface ProductCatalogueClientProps {
    products: Product[]
    totalCount: number
    initialQuery: string
    initialCategory: string
    initialInsurer: string
}

// Category options
const CATEGORIES = [
    { value: 'All', label: 'All Types' },
    { value: 'General', label: 'General' },
    { value: 'Health', label: 'Health' },
    { value: 'Life', label: 'Life' },
]

// Insurance companies
const INSURERS = [
    { value: 'All', label: 'All Companies' },
    { value: 'HDFC ERGO', label: 'HDFC ERGO' },
    { value: 'Star Health', label: 'Star Health' },
    { value: 'HDFC Life', label: 'HDFC Life' },
    { value: 'ICICI Lombard', label: 'ICICI Lombard' },
    { value: 'Bajaj Allianz', label: 'Bajaj Allianz' },
    { value: 'LIC', label: 'LIC' },
    { value: 'Max Life', label: 'Max Life' },
    { value: 'Max Bupa', label: 'Max Bupa' },
    { value: 'Tata AIG', label: 'Tata AIG' },
]

export function ProductCatalogueClient({
    products,
    totalCount,
    initialQuery,
    initialCategory,
    initialInsurer
}: ProductCatalogueClientProps) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [searchValue, setSearchValue] = useState(initialQuery)
    const router = useRouter()
    const searchParams = useSearchParams()

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === 'All' || value === '') {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        router.push(`/dashboard/product-catalogue?${params.toString()}`)
    }

    const handleSearch = () => {
        updateFilter('query', searchValue)
    }

    const clearFilters = () => {
        setSearchValue('')
        router.push('/dashboard/product-catalogue')
    }

    const hasFilters = initialQuery || (initialCategory && initialCategory !== 'All') || (initialInsurer && initialInsurer !== 'All')

    return (
        <div className="space-y-6">
            {/* Header - Matches Dashboard Style */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Catalogue</h1>
                    <p className="text-slate-500 mt-1">Browse, download & share insurance product brochures</p>
                </div>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                >
                    <Upload className="w-4 h-4" />
                    Upload Product
                </button>
            </div>

            {/* Filters Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Search</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by product name or insurer..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Product Type</label>
                        <select
                            value={initialCategory || 'All'}
                            onChange={(e) => updateFilter('category', e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Insurance Company</label>
                        <select
                            value={initialInsurer || 'All'}
                            onChange={(e) => updateFilter('insurer', e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                            {INSURERS.map((ins) => (
                                <option key={ins.value} value={ins.value}>{ins.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Active Filters */}
                {hasFilters && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {initialQuery && (
                                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
                                    Search: "{initialQuery}"
                                </span>
                            )}
                            {initialCategory && initialCategory !== 'All' && (
                                <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium">
                                    {initialCategory}
                                </span>
                            )}
                            {initialInsurer && initialInsurer !== 'All' && (
                                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
                                    {initialInsurer}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={clearFilters}
                            className="text-xs text-slate-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                            Clear All
                        </button>
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                    Showing <span className="font-semibold text-slate-900">{products.length}</span> of {totalCount} products
                </p>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="bg-white p-12 rounded-xl border border-slate-100 shadow-sm text-center">
                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No Products Found</h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                        {hasFilters
                            ? 'No products match your current filters. Try adjusting your search criteria.'
                            : 'Get started by uploading your first insurance product.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Product
                        </button>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            <UploadProductModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </div>
    )
}
