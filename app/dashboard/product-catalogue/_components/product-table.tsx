'use client'

import { useState } from 'react'
import { deleteProduct } from '../actions'
import { toast } from 'sonner'
import Link from 'next/link'
import type { Product } from '../types'

interface ProductTableProps {
    products: Product[]
}

export function ProductTable({ products }: ProductTableProps) {
    const [deleting, setDeleting] = useState<string | null>(null)

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return

        setDeleting(id)
        const result = await deleteProduct(id)

        if (result.success) {
            toast.success('Product deleted successfully')
        } else {
            toast.error(result.error || 'Failed to delete product')
        }
        setDeleting(null)
    }

    const formatCurrency = (val?: number) => {
        if (!val) return '-'
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val)
    }

    if (products.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No products found. Add your first product to get started.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Product Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Insurer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Coverage
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Premium Range
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-slate-900">{product.name}</div>
                                    {product.description && (
                                        <div className="text-xs text-slate-500 mt-1 line-clamp-1">{product.description}</div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.category === 'Health'
                                            ? 'bg-green-100 text-green-800'
                                            : product.category === 'Life'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-900">
                                    {product.insurer}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                                    {formatCurrency(product.coverage_amount)}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {product.premium_range_min && product.premium_range_max ? (
                                        <span>{formatCurrency(product.premium_range_min)} - {formatCurrency(product.premium_range_max)}</span>
                                    ) : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${product.status === 'Active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link
                                        href={`/dashboard/product-catalogue/${product.id}/edit`}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id, product.name)}
                                        disabled={deleting === product.id}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                                    >
                                        {deleting === product.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
