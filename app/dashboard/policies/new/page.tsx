'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Search, User, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { getClients, getCompanies, createClient } from '../../clients/actions'

const CATEGORIES = ['General', 'Health', 'Life'] as const
const SUM_INSURED_OPTIONS = [
    { label: '₹1 Lakh', value: 100000 },
    { label: '₹2 Lakhs', value: 200000 },
    { label: '₹3 Lakhs', value: 300000 },
    { label: '₹5 Lakhs', value: 500000 },
    { label: '₹10 Lakhs', value: 1000000 },
    { label: '₹25 Lakhs', value: 2500000 },
    { label: '₹50 Lakhs', value: 5000000 },
    { label: '₹1 Crore', value: 10000000 },
]

type Customer = {
    id: string
    name: string
    email: string
    phone: string
}

type Company = {
    id: string
    name: string
    type: 'General' | 'Health' | 'Life'
}

export default function NewPolicyPage() {
    // Customer Search
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Customer[]>([])
    const [searching, setSearching] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

    // Policy Fields
    const [productName, setProductName] = useState('')
    const [category, setCategory] = useState<typeof CATEGORIES[number] | ''>('')
    const [companies, setCompanies] = useState<Company[]>([])
    const [selectedCompanyId, setSelectedCompanyId] = useState('')
    const [sumInsured, setSumInsured] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [premiumAmount, setPremiumAmount] = useState('')
    const [policyNumber, setPolicyNumber] = useState('')
    const [claimStatus, setClaimStatus] = useState('')
    const [remarks, setRemarks] = useState('')

    const [loading, setLoading] = useState(false)
    const [fetchingCompanies, setFetchingCompanies] = useState(false)

    const router = useRouter()

    // Search customers
    const searchCustomers = async () => {
        if (!searchQuery.trim()) {
            toast.error('Please enter a search query')
            return
        }

        setSearching(true)
        try {
            const result = await getClients({ query: searchQuery, limit: 10 })
            // Unique customers by name and phone
            const uniqueCustomers = result.clients.reduce((acc: Customer[], curr: any) => {
                const exists = acc.find(c => c.phone === curr.phone || c.email === curr.email)
                if (!exists && (curr.name || curr.phone)) {
                    acc.push({
                        id: curr.id,
                        name: curr.name,
                        email: curr.email,
                        phone: curr.phone
                    })
                }
                return acc
            }, [])
            setSearchResults(uniqueCustomers)
            if (uniqueCustomers.length === 0) {
                toast.info('No customers found. Create a new client first.')
            }
        } catch (error) {
            toast.error('Failed to search customers')
        } finally {
            setSearching(false)
        }
    }

    // Fetch companies when category changes
    useEffect(() => {
        async function fetchCompanies() {
            if (!category) {
                setCompanies([])
                setSelectedCompanyId('')
                return
            }

            setFetchingCompanies(true)
            try {
                const data = await getCompanies(category)
                setCompanies(data as Company[])
            } catch (err) {
                toast.error('Failed to load insurance companies')
            } finally {
                setFetchingCompanies(false)
            }
        }
        fetchCompanies()
    }, [category])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedCustomer) {
            toast.error('Please select a customer first')
            return
        }
        if (!category) {
            toast.error('Please select a policy type')
            return
        }
        if (!selectedCompanyId) {
            toast.error('Please select an insurance company')
            return
        }
        if (!policyNumber) {
            toast.error('Please enter a policy number')
            return
        }

        setLoading(true)
        const toastId = toast.loading('Creating policy...')

        try {
            await createClient({
                name: selectedCustomer.name,
                email: selectedCustomer.email,
                phone: selectedCustomer.phone,
                policy_number: policyNumber,
                category,
                company_id: selectedCompanyId,
                product_name: productName,
                sum_insured: sumInsured,
                premium_amount: premiumAmount,
                start_date: startDate,
                end_date: endDate,
                notes: remarks + (claimStatus ? ` | Claim Status: ${claimStatus}` : ''),
                status: 'Active'
            })

            toast.success('Policy created successfully!', { id: toastId })
            router.push('/dashboard/policies')
        } catch (error: any) {
            toast.error('Failed to create policy: ' + error.message, { id: toastId })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="mb-6">
                <Link href="/dashboard/policies" className="text-slate-500 hover:text-slate-800 gap-2 mb-2 inline-flex items-center">
                    <ArrowLeft className="w-4 h-4" /> Back to Policies
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">Add New Policy</h1>
                <p className="text-slate-500 text-sm mt-1">Link a policy to an existing customer</p>
            </div>

            {/* Step 1: Customer Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                    Step 1: Select Customer
                </h3>

                {selectedCustomer ? (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                                <div>
                                    <h4 className="font-bold text-green-900">{selectedCustomer.name}</h4>
                                    <p className="text-sm text-green-700">
                                        {selectedCustomer.phone} • {selectedCustomer.email || 'No email'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="text-sm text-green-700 hover:text-green-900 underline"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex gap-3 mb-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && searchCustomers()}
                                placeholder="Search by name, phone or email..."
                                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={searchCustomers}
                                disabled={searching}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                <Search className="w-4 h-4" />
                                {searching ? 'Searching...' : 'Search'}
                            </button>
                        </div>

                        {searchResults.length > 0 && (
                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                                {searchResults.map((customer) => (
                                    <button
                                        key={customer.id}
                                        onClick={() => {
                                            setSelectedCustomer(customer)
                                            setSearchResults([])
                                        }}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 text-left"
                                    >
                                        <User className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="font-medium text-slate-900">{customer.name}</p>
                                            <p className="text-sm text-slate-500">{customer.phone} • {customer.email || 'No email'}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        <p className="text-xs text-slate-500 mt-3">
                            💡 Can't find the customer? <Link href="/dashboard/clients/new" className="text-blue-600 hover:underline">Create new client first</Link>
                        </p>
                    </>
                )}
            </div>

            {/* Step 2: Policy Form */}
            {selectedCustomer && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                        Step 2: Policy Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Policy Number */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Policy Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                value={policyNumber}
                                onChange={(e) => setPolicyNumber(e.target.value)}
                                placeholder="e.g., POL-123456"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Product Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Product Name
                            </label>
                            <input
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="e.g., Comprehensive Motor Insurance"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Policy Type */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Policy Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Type</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Insurance Company */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Insurance Company <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                disabled={!category || fetchingCompanies}
                                value={selectedCompanyId}
                                onChange={(e) => setSelectedCompanyId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                            >
                                <option value="">
                                    {fetchingCompanies ? 'Loading...' : (category ? 'Select Company' : 'Select Policy Type First')}
                                </option>
                                {companies.map(comp => (
                                    <option key={comp.id} value={comp.id}>{comp.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sum Insured */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Sum Insured
                            </label>
                            <select
                                value={sumInsured}
                                onChange={(e) => setSumInsured(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Amount</option>
                                {SUM_INSURED_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Premium */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Premium Amount
                            </label>
                            <input
                                type="number"
                                value={premiumAmount}
                                onChange={(e) => setPremiumAmount(e.target.value)}
                                placeholder="e.g., 15000"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Claim Status */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Claim Status (Optional)
                            </label>
                            <select
                                value={claimStatus}
                                onChange={(e) => setClaimStatus(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">No Claim</option>
                                <option value="Pending">Claim Pending</option>
                                <option value="Approved">Claim Approved</option>
                                <option value="Rejected">Claim Rejected</option>
                            </select>
                        </div>

                        {/* Remarks */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                Remarks (Optional)
                            </label>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Any additional notes..."
                                rows={3}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 flex gap-3 border-t border-slate-100 mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {loading ? 'Creating...' : 'Create Policy'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}
