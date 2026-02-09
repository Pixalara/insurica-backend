'use client'

import { Download, Share2, FileText } from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '../types'

interface ProductCardProps {
    product: Product
    onEdit: (product: Product) => void
    onDelete: (id: string) => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
    // Format currency in Indian style
    const formatCurrency = (val?: number) => {
        if (!val) return '-'
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`
        if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(val)
    }

    // Download PDF handler
    const handleDownload = () => {
        if (!product.pdf_url) {
            toast.error('PDF not available for this product')
            return
        }
        window.open(product.pdf_url, '_blank')
        toast.success('Opening PDF...')
    }

    // WhatsApp share handler
    const handleWhatsAppShare = () => {
        if (!product.pdf_url) {
            toast.error('PDF not available to share')
            return
        }

        const message = `*${product.name}*\nBy ${product.insurer}\nCoverage: ${formatCurrency(product.coverage_amount)}\n\nBrochure: ${product.pdf_url}`
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
        toast.success('Opening WhatsApp...')
    }

    // Get category badge color
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Health':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case 'Life':
                return 'bg-purple-50 text-purple-700 border-purple-200'
            default:
                return 'bg-blue-50 text-blue-700 border-blue-200'
        }
    }

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 overflow-hidden group">
            {/* Header */}
            <div className="p-5 border-b border-slate-100">
                <div className="flex items-start justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(product.category)}`}>
                        {product.category}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(product)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-semibold transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(product.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <h3 className="font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                </h3>

                <p className="text-sm text-slate-500 font-medium">
                    {product.insurer}
                </p>
            </div>

            {/* Details */}
            <div className="p-5 space-y-3">
                {/* Coverage */}
                {product.coverage_amount && (
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Coverage</span>
                        <span className="text-sm font-bold text-slate-900">
                            {formatCurrency(product.coverage_amount)}
                        </span>
                    </div>
                )}

                {/* Premium Range */}
                {product.premium_range_min && product.premium_range_max && (
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Premium</span>
                        <span className="text-sm font-semibold text-slate-700">
                            {formatCurrency(product.premium_range_min)} - {formatCurrency(product.premium_range_max)}
                        </span>
                    </div>
                )}

                {/* Description */}
                {product.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 pt-2 border-t border-slate-50">
                        {product.description}
                    </p>
                )}

                {/* PDF Status */}
                <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${product.pdf_url
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-amber-50 text-amber-600'
                    }`}>
                    <FileText className="w-3.5 h-3.5" />
                    {product.pdf_url ? 'PDF Brochure Available' : 'PDF Coming Soon'}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 flex gap-2">
                <button
                    onClick={handleDownload}
                    disabled={!product.pdf_url}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download
                </button>

                <button
                    onClick={handleWhatsAppShare}
                    disabled={!product.pdf_url}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
                    title="Share via WhatsApp"
                >
                    <Share2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
