'use client'

import { Download, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '../types'

interface ProductCardProps {
    product: Product
    onEdit: (product: Product) => void
    onDelete: (id: string) => void
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
    // Download PDF handler - forces actual file download
    const handleDownload = async () => {
        if (!product.pdf_url) {
            toast.error('PDF not available for this product')
            return
        }

        try {
            toast.loading('Downloading PDF...', { id: 'download' })

            // Fetch the PDF file
            const response = await fetch(product.pdf_url)
            if (!response.ok) throw new Error('Failed to fetch PDF')

            const blob = await response.blob()

            // Create download link
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = product.pdf_filename || `${product.name}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            toast.success('PDF downloaded!', { id: 'download' })
        } catch (error) {
            console.error('Download error:', error)
            // Fallback: open in new tab
            window.open(product.pdf_url, '_blank')
            toast.success('Opening PDF...', { id: 'download' })
        }
    }

    // WhatsApp share handler
    const handleWhatsAppShare = () => {
        // Build message with product details
        let message = `*${product.name}*\nBy ${product.insurer}`

        if (product.description) {
            message += `\n\n${product.description}`
        }

        if (product.pdf_url) {
            message += `\n\nDownload Brochure: ${product.pdf_url}`
        }

        // Use api.whatsapp.com which works on both desktop and mobile
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
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


                {/* Description */}
                {product.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 pt-2 border-t border-slate-50">
                        {product.description}
                    </p>
                )}

            </div>

            {/* Action Buttons */}
            <div className="p-4 flex gap-2">
                <button
                    onClick={handleDownload}
                    disabled={!product.pdf_url}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${product.pdf_url
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    <Download className="w-4 h-4" />
                    Download
                </button>

                <button
                    onClick={handleWhatsAppShare}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
                    title="Share via WhatsApp"
                >
                    <Share2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
