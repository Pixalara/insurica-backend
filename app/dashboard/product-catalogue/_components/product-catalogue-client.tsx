'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Package, Shield, HeartPulse, Users, FileText, Download, Share2, Pencil, Trash2 } from 'lucide-react'
import { ProductModal } from './product-modal'
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
    errorMessage?: string | null
}

// Section configuration
const SECTIONS = [
    {
        key: 'General',
        label: 'General Insurance',
        icon: Shield,
        headerBg: 'bg-gradient-to-r from-blue-600 to-blue-700',
        accentColor: 'blue',
        emptyText: 'No general insurance products yet.',
    },
    {
        key: 'Life',
        label: 'Life Insurance',
        icon: Users,
        headerBg: 'bg-gradient-to-r from-purple-600 to-purple-700',
        accentColor: 'purple',
        emptyText: 'No life insurance products yet.',
    },
    {
        key: 'Health',
        label: 'Health Insurance',
        icon: HeartPulse,
        headerBg: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
        accentColor: 'emerald',
        emptyText: 'No health insurance products yet.',
    },
] as const

export function ProductCatalogueClient({
    products,
    totalCount,
    initialQuery,
    initialCategory,
    initialInsurer,
    errorMessage
}: ProductCatalogueClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

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

    // Download PDF handler
    const handleDownload = async (product: Product) => {
        if (!product.pdf_url) {
            toast.error('PDF not available for this product', { id: 'pdf-action' })
            return
        }
        try {
            toast.loading('Downloading PDF...', { id: 'pdf-action' })
            const response = await fetch(product.pdf_url)
            if (!response.ok) throw new Error('Failed to fetch PDF')
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = product.pdf_filename || `${product.name}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            toast.success('PDF downloaded!', { id: 'pdf-action' })
        } catch {
            window.open(product.pdf_url, '_blank')
            toast.success('Opening PDF...', { id: 'pdf-action' })
        }
    }

    // WhatsApp share handler
    const handleWhatsAppShare = (product: Product) => {
        const pdfName = product.pdf_filename || 'Brochure'
        let message = `📋 *${product.name}*\n🏢 ${product.insurer}`
        if (product.description) message += `\n\n${product.description}`
        if (product.pdf_url) {
            message += `\n\n📎 *${pdfName}*\n👇 Tap the link below to download the PDF directly:\n${product.pdf_url}`
        }
        message += `\n\n_Shared via Insurica_`
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
        toast.success('Opening WhatsApp...', { id: 'whatsapp-share' })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
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

            {/* Error Banner */}
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                    <strong>Error loading products:</strong> {errorMessage}
                </div>
            )}

            {/* Category Sections */}
            {SECTIONS.map((section) => {
                const sectionProducts = products.filter((p) => p.product_category === section.key)
                const SectionIcon = section.icon

                return (
                    <div key={section.key} className="space-y-3">
                        {/* Section Header */}
                        <div className={`${section.headerBg} rounded-xl px-5 py-4 flex items-center justify-between shadow-sm`}>
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <SectionIcon className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-white">{section.label}</h2>
                            </div>
                            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                                {sectionProducts.length} {sectionProducts.length === 1 ? 'Product' : 'Products'}
                            </span>
                        </div>

                        {/* PDF List */}
                        {sectionProducts.length > 0 ? (
                            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
                                {sectionProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                                    >
                                        {/* PDF Icon */}
                                        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${product.pdf_url
                                            ? 'bg-red-50 text-red-500'
                                            : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            <FileText className="w-5 h-5" />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-900 text-sm truncate">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {product.insurer}
                                                {product.pdf_filename && (
                                                    <span className="text-slate-400"> · {product.pdf_filename}</span>
                                                )}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {product.pdf_url ? (
                                                <>
                                                    <a
                                                        href={product.pdf_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                    >
                                                        View PDF
                                                    </a>
                                                    <button
                                                        onClick={() => handleDownload(product)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleWhatsAppShare(product)}
                                                        className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Share via WhatsApp"
                                                    >
                                                        <Share2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">No PDF</span>
                                            )}
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setConfirmDeleteId(product.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 text-center">
                                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm text-slate-400">{section.emptyText}</p>
                            </div>
                        )}
                    </div>
                )
            })}

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
