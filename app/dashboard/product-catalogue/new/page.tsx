'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct } from '../actions'//create product action
import { toast } from 'sonner'
import type { ProductFormData } from '../types'

export default function NewProductPage() {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        category: 'General',
        insurer: '',
        features: '',
        description: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        const result = await createProduct(formData)

        if (result.success) {
            toast.success('Product created successfully')
            router.push('/dashboard/product-catalogue')
        } else {
            toast.error(result.error || 'Failed to create product')
            setSubmitting(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
                <p className="text-slate-500 text-sm">Create a new insurance product offering</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Comprehensive Motor Insurance"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as 'General' | 'Health' | 'Life' })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="General">General Insurance</option>
                        <option value="Health">Health Insurance</option>
                        <option value="Life">Life Insurance</option>
                    </select>
                </div>

                {/* Insurer */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Insurer <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.insurer}
                        onChange={(e) => setFormData({ ...formData, insurer: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., HDFC ERGO, ICICI Lombard"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief description of the product"
                    />
                </div>

                {/* Features */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Features (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={formData.features}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Zero Depreciation, Roadside Assistance, NCB Protection"
                    />
                </div>


                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Creating...' : 'Create Product'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
