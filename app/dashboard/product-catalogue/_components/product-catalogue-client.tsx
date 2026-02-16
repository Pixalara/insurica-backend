'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Upload, Package, Search, X, Filter } from 'lucide-react'
import { ProductModal } from './product-modal'
import { ProductCard } from './product-card'
import { deleteProduct } from '../actions'
import { getCompanies } from '../../clients/actions'
import { toast } from 'sonner'
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



export function ProductCatalogueClient({
    products,
    totalCount,
    initialQuery,
    initialCategory,
    initialInsurer
}: ProductCatalogueClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [searchValue, setSearchValue] = useState(initialQuery)
    const [companies, setCompanies] = useState<{ id: string; name: string }[]>([])
    const [loadingCompanies, setLoadingCompanies] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Fetch companies from DB, filtered by selected category
    useEffect(() => {
        async function fetchCompanies() {
            setLoadingCompanies(true)
            try {
                const categoryFilter = initialCategory && initialCategory !== 'All'
                    ? initialCategory as 'General' | 'Health' | 'Life'
                    : undefined
                const data = await getCompanies(categoryFilter)
                const companyList = data as { id: string; name: string }[]
                setCompanies(companyList)
            } catch (error) {
                console.error('Failed to fetch companies:', error)
                toast.error('Failed to load insurance companies')
            } finally {
                setLoadingCompanies(false)
            }
        }
        fetchCompanies()
    }, [initialCategory])

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === 'All' || value === '') {
            params.delete(key)
        } else {
            params.set(key, value)
        }
        // If category changes, also reset the insurer filter
        if (key === 'category') {
            params.delete('insurer')
        }
        router.push(`/dashboard/product-catalogue?${params.toString()}`)
    }

    const handleSearch = () => {
        updateFilter('query', searchValue)
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setIsModalOpen(true)
    }

    const handleDelete = async () => {
        if (!confirmDeleteId) return

        setIsDeleting(true)
        const toastId = toast.loading('Deleting product...')
        const { success, error } = await deleteProduct(confirmDeleteId)

        setIsDeleting(false)
        if (success) {
            toast.success('Product deleted successfully', { id: toastId })
            setConfirmDeleteId(null)
            router.refresh()
        } else {
            toast.error('Failed to delete product: ' + error, { id: toastId })
        }
    }

    const handleOpenModal = () => {
        setEditingProduct(null)
        setIsModalOpen(true)
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
                    onClick={handleOpenModal}
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
                            disabled={loadingCompanies}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-slate-100 disabled:text-slate-400"
                        >
                            <option value="All">
                                {loadingCompanies ? 'Loading...' : 'All Companies'}
                            </option>
                            {companies.map((comp) => (
                                <option key={comp.id} value={comp.name}>{comp.name}</option>
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
                                    Search: &quot;{initialQuery}&quot;
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
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onEdit={handleEdit}
                            onDelete={(id) => setConfirmDeleteId(id)}
                        />
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
                            onClick={handleOpenModal}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Product
                        </button>
                    </div>
                </div>
            )}

            {/* Product Modal (Upload/Edit) */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={editingProduct}
            />

            {/* Custom Delete Confirmation Modal */}
            {confirmDeleteId && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Product?</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            Are you sure you want to delete this product? This action cannot be undone and the brochure will be removed from the catalogue.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
