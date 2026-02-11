'use client'

import { useState, useEffect } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { createProduct, updateProduct, uploadProductPDF, deleteProductPDF } from '../actions'
import { useRouter } from 'next/navigation'
import type { Product } from '../types'

interface ProductModalProps {
    isOpen: boolean
    onClose: () => void
    product?: Product | null
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
    const isEdit = !!product

    const [productName, setProductName] = useState(product?.name || '')
    const [productType, setProductType] = useState<'General' | 'Health' | 'Life' | ''>(product?.category || '')
    const [insurer, setInsurer] = useState(product?.insurer || '')
    const [coverageAmount, setCoverageAmount] = useState(product?.coverage_amount?.toString() || '')
    const [premiumMin, setPremiumMin] = useState(product?.premium_range_min?.toString() || '')
    const [premiumMax, setPremiumMax] = useState(product?.premium_range_max?.toString() || '')
    const [description, setDescription] = useState(product?.description || '')
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [existingPdfUrl, setExistingPdfUrl] = useState(product?.pdf_url || '')
    const [existingPdfName, setExistingPdfName] = useState(product?.pdf_filename || '')
    const [pdfToDelete, setPdfToDelete] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [errors, setErrors] = useState<string[]>([])

    // Update form when product prop changes or modal opens/closes
    useEffect(() => {
        if (product) {
            setProductName(product.name)
            setProductType(product.category)
            setInsurer(product.insurer)
            setCoverageAmount(product.coverage_amount?.toString() || '')
            setPremiumMin(product.premium_range_min?.toString() || '')
            setPremiumMax(product.premium_range_max?.toString() || '')
            setDescription(product.description || '')
            setExistingPdfUrl(product.pdf_url || '')
            setExistingPdfName(product.pdf_filename || '')
        } else {
            // Reset for new product
            setProductName('')
            setProductType('')
            setInsurer('')
            setCoverageAmount('')
            setPremiumMin('')
            setPremiumMax('')
            setDescription('')
            setExistingPdfUrl('')
            setExistingPdfName('')
        }
        setPdfFile(null)
        setPdfToDelete(null)
        setErrors([])
    }, [product, isOpen])

    const router = useRouter()

    const validateFile = (file: File): string[] => {
        const validationErrors: string[] = []

        // Check file type
        const isPdfMime = file.type === 'application/pdf'
        const isPdfExt = file.name.toLowerCase().endsWith('.pdf')

        if (!isPdfMime && !isPdfExt) {
            validationErrors.push('Only PDF files are allowed')
        }

        // Check file size (10MB max)
        const maxSize = 10 * 1024 * 1024 // 10MB in bytes
        if (file.size > maxSize) {
            validationErrors.push(`File size must be less than 10MB (current: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`)
        }

        return validationErrors
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validationErrors = validateFile(file)
        setErrors(validationErrors)

        if (validationErrors.length === 0) {
            setPdfFile(file)
            // If there was an existing PDF, mark it for deletion ONLY if we save
            if (existingPdfUrl) {
                setPdfToDelete(existingPdfUrl)
            }
            setExistingPdfUrl('') // Visual update only
            toast.success(`File selected: ${file.name}`)
        } else {
            setPdfFile(null)
            e.target.value = '' // Reset file input
        }
    }

    const handleRemovePdf = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (existingPdfUrl) {
            setPdfToDelete(existingPdfUrl)
        }

        setPdfFile(null)
        setExistingPdfUrl('')
        setExistingPdfName('')
        const fileInput = document.getElementById('pdf-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Frontend validation
        const formErrors: string[] = []

        if (!productName.trim()) formErrors.push('Product name is required')
        if (!productType) formErrors.push('Product type is required')
        if (!insurer.trim()) formErrors.push('Insurance company is required')
        if (!isEdit && !pdfFile) formErrors.push('PDF file is required')

        if (formErrors.length > 0) {
            setErrors(formErrors)
            return
        }

        setUploading(true)
        const toastId = toast.loading(isEdit ? 'Updating product...' : 'Uploading product...')

        try {
            let pdfUrl: string | undefined = existingPdfUrl
            let pdfFilename: string | undefined = existingPdfName

            // Upload PDF if a new file is selected
            if (pdfFile) {
                const uploadFormData = new FormData()
                uploadFormData.append('file', pdfFile)

                const uploadResult = await uploadProductPDF(uploadFormData)

                if (!uploadResult.success) {
                    toast.error(`Failed to upload PDF: ${uploadResult.error}`, { id: toastId })
                    setUploading(false)
                    return
                }

                pdfUrl = uploadResult.url
                pdfFilename = uploadResult.filename
            }

            const formData = {
                name: productName,
                category: productType as 'General' | 'Health' | 'Life',
                insurer,
                coverage_amount: coverageAmount ? parseFloat(coverageAmount) : undefined,
                premium_range_min: premiumMin ? parseFloat(premiumMin) : undefined,
                premium_range_max: premiumMax ? parseFloat(premiumMax) : undefined,
                description: description || undefined,
                features: '',
                // Use the new URL if uploaded, or the existing one (unless it was cleared)
                pdf_url: pdfFile ? (pdfUrl || null) : (existingPdfUrl || null),
                pdf_filename: pdfFile ? (pdfFilename || null) : (existingPdfName || null),
            }

            // Perform DB Update
            if (isEdit && product) {
                await updateProduct(product.id, formData)

                // NOW it is safe to delete the old PDF if needed
                if (pdfToDelete) {
                    try {
                        const url = new URL(pdfToDelete)
                        const pathParts = url.pathname.split('/')
                        const filename = pathParts[pathParts.length - 1]
                        if (filename) {
                            await deleteProductPDF(filename)
                        }
                    } catch (err) {
                        console.error('Error deleting old PDF:', err)
                        // Don't fail the whole operation if cleanup fails
                    }
                }

                toast.success('Product updated successfully!', { id: toastId })
            } else {
                await createProduct(formData)
                toast.success('Product uploaded successfully!', { id: toastId })
            }

            // Reset form
            setProductName('')
            setProductType('')
            setInsurer('')
            setCoverageAmount('')
            setPremiumMin('')
            setPremiumMax('')
            setDescription('')
            setPdfFile(null)
            setPdfToDelete(null)
            setErrors([])

            onClose()
            router.refresh()
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error'
            toast.error('Failed to upload product: ' + message, { id: toastId })
        } finally {
            setUploading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Product' : 'Upload Product'}</h2>
                        <p className="text-sm text-slate-500 mt-1">{isEdit ? 'Update product details and brochure' : 'Add a new insurance product with PDF brochure'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Validation Errors */}
                {errors.length > 0 && (
                    <div className="mx-6 mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-red-900 mb-2">Please fix the following errors:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {errors.map((error, idx) => (
                                        <li key={idx} className="text-sm text-red-700">{error}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Product Name */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="e.g., Comprehensive Motor Insurance"
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Product Type & Insurer */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                                Product Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={productType}
                                onChange={(e) => setProductType(e.target.value as 'General' | 'Health' | 'Life' | '')}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="General">General</option>
                                <option value="Health">Health</option>
                                <option value="Life">Life</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                                Insurance Company <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={insurer}
                                onChange={(e) => setInsurer(e.target.value)}
                                placeholder="e.g., HDFC ERGO"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Coverage & Premium Range */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                                Coverage Amount
                            </label>
                            <input
                                type="number"
                                value={coverageAmount}
                                onChange={(e) => setCoverageAmount(e.target.value)}
                                placeholder="e.g., 500000"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                                Premium Min
                            </label>
                            <input
                                type="number"
                                value={premiumMin}
                                onChange={(e) => setPremiumMin(e.target.value)}
                                placeholder="e.g., 8000"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                                Premium Max
                            </label>
                            <input
                                type="number"
                                value={premiumMax}
                                onChange={(e) => setPremiumMax(e.target.value)}
                                placeholder="e.g., 15000"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the product..."
                            rows={3}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* PDF Upload */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                            {isEdit ? 'Update PDF (Optional)' : 'Upload PDF'} {!isEdit && <span className="text-red-500">*</span>}
                        </label>
                        <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="pdf-upload"
                                required={!isEdit && !pdfFile && !existingPdfUrl}
                            />

                            {(pdfFile || existingPdfUrl) ? (
                                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-50 p-2 rounded-lg">
                                            <FileText className="w-6 h-6 text-red-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-slate-900 text-sm truncate max-w-[300px]">
                                                {pdfFile ? pdfFile.name : existingPdfName}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {pdfFile ? `${(pdfFile.size / 1024).toFixed(2)} KB` : 'Existing Brochure'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemovePdf}
                                        className="p-1.5 hover:bg-red-100 text-slate-400 hover:text-red-600 rounded-full transition-colors"
                                        title="Remove PDF"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor="pdf-upload" className="cursor-pointer block">
                                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                    <p className="font-semibold text-slate-700">Click to upload PDF</p>
                                    <p className="text-xs text-slate-500 mt-1">PDF only, max 10MB</p>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700  transition-colors"
                        >
                            {uploading ? (isEdit ? 'Updating...' : 'Uploading...') : (isEdit ? 'Save Changes' : 'Upload Product')}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
