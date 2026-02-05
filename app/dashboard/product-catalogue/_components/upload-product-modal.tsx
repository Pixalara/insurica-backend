'use client'

import { useState } from 'react';
import { X, Upload, FileText, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { createProduct } from '../actions'
import { useRouter } from 'next/navigation'

interface UploadProductModalProps {
    isOpen: boolean
    onClose: () => void
}

export function UploadProductModal({ isOpen, onClose }: UploadProductModalProps) {
    const [productName, setProductName] = useState('')
    const [productType, setProductType] = useState<'General' | 'Health' | 'Life' | ''>('')
    const [insurer, setInsurer] = useState('')
    const [coverageAmount, setCoverageAmount] = useState('')
    const [premiumMin, setPremiumMin] = useState('')
    const [premiumMax, setPremiumMax] = useState('')
    const [description, setDescription] = useState('')
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [errors, setErrors] = useState<string[]>([])

    const router = useRouter()

    const validateFile = (file: File): string[] => {
        const validationErrors: string[] = []

        // Check file type
        if (file.type !== 'application/pdf') {
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
            toast.success(`File selected: ${file.name}`)
        } else {
            setPdfFile(null)
            e.target.value = '' // Reset file input
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Frontend validation
        const formErrors: string[] = []

        if (!productName.trim()) formErrors.push('Product name is required')
        if (!productType) formErrors.push('Product type is required')
        if (!insurer.trim()) formErrors.push('Insurance company is required')
        if (!pdfFile) formErrors.push('PDF file is required')

        if (formErrors.length > 0) {
            setErrors(formErrors)
            return
        }

        setUploading(true)
        const toastId = toast.loading('Uploading product...')

        try {
            // In a real implementation, you would:
            // 1. Upload file to Supabase Storage
            // 2. Get the public URL
            // 3. Save product record with PDF URL

            // For now, we'll create without PDF upload
            // You'll need to implement uploadProductPDF in actions.ts

            const formData = {
                name: productName,
                category: productType as 'General' | 'Health' | 'Life',
                insurer,
                coverage_amount: coverageAmount ? parseFloat(coverageAmount) : undefined,
                premium_range_min: premiumMin ? parseFloat(premiumMin) : undefined,
                premium_range_max: premiumMax ? parseFloat(premiumMax) : undefined,
                description: description || undefined, 
                features: '',
                status: 'Active' as const,
                // TODO: Add pdf_url and pdf_filename after implementing file upload
                pdf_filename: pdfFile?.name || ''
            }

            await createProduct(formData)

            toast.success('Product uploaded successfully!', { id: toastId })

            // Reset form
            setProductName('')
            setProductType('')
            setInsurer('')
            setCoverageAmount('')
            setPremiumMin('')
            setPremiumMax('')
            setDescription('')
            setPdfFile(null)
            setErrors([])

            onClose()
            router.refresh()
        } catch (error: any) {
            toast.error('Failed to upload product: ' + error.message, { id: toastId })
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
                        <h2 className="text-2xl font-bold text-slate-900">Upload Product</h2>
                        <p className="text-sm text-slate-500 mt-1">Add a new insurance product with PDF brochure</p>
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
                                onChange={(e) => setProductType(e.target.value as any)}
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
                            Upload PDF <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="pdf-upload"
                                required
                            />
                            <label htmlFor="pdf-upload" className="cursor-pointer">
                                {pdfFile ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <FileText className="w-8 h-8 text-green-600" />
                                        <div className="text-left">
                                            <p className="font-semibold text-slate-900">{pdfFile.name}</p>
                                            <p className="text-xs text-slate-500">{(pdfFile.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                                        <p className="font-semibold text-slate-700">Click to upload PDF</p>
                                        <p className="text-xs text-slate-500 mt-1">PDF only, max 10MB</p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {uploading ? 'Uploading...' : 'Upload Product'}
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
