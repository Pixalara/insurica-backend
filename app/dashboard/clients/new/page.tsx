'use client'

import { useState, useEffect } from 'react'
import { createClient, getCompanies } from '../actions'
import { getProducts } from '../../product-catalogue/actions'
import type { Product } from '../../product-catalogue/types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Lock, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { CustomerSearch } from '../_components/customer-search'
import { DatePicker } from '@/components/ui/date-picker'
import { format } from 'date-fns'

const CATEGORIES = ['General', 'Health', 'Life'] as const

type Company = {
  id: string
  name: string
  type: 'General' | 'Health' | 'Life'
}

export default function NewClientPage() {
  // Customer Search State
  const [customerFound, setCustomerFound] = useState(false)
  const [foundCustomer, setFoundCustomer] = useState<{ id: string; name: string; phone: string; email: string | null; dob: string | null } | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Required Fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState<Date | undefined>(undefined)
  const [policyNumber, setPolicyNumber] = useState('')
  const [category, setCategory] = useState<typeof CATEGORIES[number] | ''>('')

  // Dependent on Category
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [productType, setProductType] = useState('')
  const [vehicleNumber, setVehicleNumber] = useState('')

  // Other Fields
  const [productName, setProductName] = useState('')
  const [sumInsured, setSumInsured] = useState('')
  const [premiumAmount, setPremiumAmount] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [policyDuration, setPolicyDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('Active')

  const [loading, setLoading] = useState(false)
  const [fetchingCompanies, setFetchingCompanies] = useState(false)
  const [fetchingProducts, setFetchingProducts] = useState(false)

  const router = useRouter()

  // Handle customer found
  const handleCustomerFound = (customer: { id: string; name: string; phone: string; email: string | null; dob?: string | null }) => {
    setCustomerFound(true)
    setFoundCustomer({ ...customer, dob: customer.dob || null })
    setShowForm(true)

    // Auto-fill customer data (read-only)
    setName(customer.name || '')
    setEmail(customer.email || '')
    // Strip +91 if present for display in the clean input
    setPhone(customer.phone ? customer.phone.replace('+91', '') : '')
    setDob(customer.dob ? new Date(customer.dob) : undefined)
  }

  // Handle customer not found
  const handleCustomerNotFound = () => {
    setCustomerFound(false)
    setFoundCustomer(null)
    setShowForm(true)

    // Clear form for new customer entry
    setName('')
    setEmail('')
    setPhone('')
    setDob(undefined)
  }

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
        console.error('Failed to fetch companies', err)
        toast.error('Failed to load companies')
      } finally {
        setFetchingCompanies(false)
      }
    }

    fetchCompanies()
  }, [category])

  // Fetch Products based on Category and Company
  useEffect(() => {
    async function fetchProducts() {
      if (!category || !selectedCompanyId) {
        setProducts([])
        setProductName('')
        return
      }

      setFetchingProducts(true)
      try {
        const selectedCompany = companies.find(c => c.id === selectedCompanyId)
        if (selectedCompany) {
          const { products } = await getProducts({ 
            category, 
            insurer: selectedCompany.name 
          })
          setProducts(products)
        }
      } catch (err) {
        console.error('Failed to fetch products', err)
        toast.error('Failed to load products')
      } finally {
        setFetchingProducts(false)
      }
    }

    fetchProducts()
  }, [category, selectedCompanyId, companies])

  useEffect(() => {
    if (startDate && endDate) {
      const start = startDate
      const end = endDate
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (!isNaN(diffDays)) {
        if (diffDays >= 365) {
          const years = (diffDays / 365).toFixed(1)
          setPolicyDuration(`${years} Year(s)`)
        } else {
          setPolicyDuration(`${diffDays} Days`)
        }
      }
    }
  }, [startDate, endDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validations
    if (!category) {
      toast.error('Please select a Policy Category first')
      return
    }
    if (!selectedCompanyId) {
      toast.error('Please select an Insurance Company')
      return
    }
    if (!name.trim()) {
      toast.error('Client Name is required')
      return
    }
    if (!phone || phone.length !== 10) {
      toast.error('Valid 10-digit Phone Number is required')
      return
    }
    if (!dob) {
      toast.error('Date of Birth is required')
      return
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Invalid Email Address')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Saving client/policy...')

    try {
      const formData = {
        name,
        email: email || null,
        phone: `+91${phone}`, // Append prefix for backend
        dob: dob ? format(dob, 'yyyy-MM-dd') : null,
        policy_number: policyNumber,
        category,
        insurance_company: companies.find(c => c.id === selectedCompanyId)?.name || selectedCompanyId,
        product_name: productName || null,
        product_type: productType || null,
        vehicle_number: (category === 'General' && productType === 'Vehicle') ? vehicleNumber : null,
        sum_insured: sumInsured,
        premium_amount: premiumAmount,
        start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
        policy_duration: policyDuration,
        notes: notes,
        status
      }

      await createClient(formData)

      toast.success(customerFound ? 'New policy added to existing customer' : 'New customer and policy created', { id: toastId })
      router.push('/dashboard/clients')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Save error', error)
      toast.error('Failed to save: ' + errorMessage, { id: toastId })
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-10 px-4 sm:px-0">
      <div className="mb-6">
        <Link href="/dashboard/clients" className="text-slate-500 hover:text-slate-800 gap-2 mb-2 inline-flex items-center">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Add New Client / Policy</h1>
        <p className="text-slate-500 text-sm mt-1">Search for existing customer or create new one - Zero re-entry guaranteed</p>
      </div>

      {/* Phase 1: Customer Search */}
      <div className="mb-6">
        <CustomerSearch
          onCustomerFound={handleCustomerFound}
          onCustomerNotFound={handleCustomerNotFound}
        />
      </div>

      {/* Customer Found Alert */}
      {customerFound && foundCustomer && (
        <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-bold text-green-900">Customer Found!</h3>
              <p className="text-sm text-green-700">Information has been auto-filled and locked. You can now add a new policy for this customer.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><span className="font-semibold">Name:</span> {foundCustomer.name}</div>
              <div><span className="font-semibold">Phone:</span> {foundCustomer.phone}</div>
              <div><span className="font-semibold">Email:</span> {foundCustomer.email || 'N/A'}</div>
              <div><span className="font-semibold">Customer ID:</span> {foundCustomer.id.slice(0, 8)}...</div>
            </div>
          </div>
        </div>
      )}

      {/* New Customer Alert */}
      {showForm && !customerFound && (
        <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">!</div>
            <div>
              <h3 className="font-bold text-blue-900">New Customer</h3>
              <p className="text-sm text-blue-700">No existing customer found. Please fill in all customer details below.</p>
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Form (shown after search) */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">

          {/* Customer Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Customer Details
              {customerFound && <Lock className="inline-block w-4 h-4 ml-2 text-amber-600" />}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Customer Name <span className="text-red-500">*</span>
                  {customerFound && <span className="ml-2 text-amber-600">(Locked)</span>}
                </label>
                <input
                  required
                  readOnly={customerFound}
                  className={`w-full border rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium ${customerFound ? 'bg-amber-50 border-amber-300 cursor-not-allowed' : 'bg-slate-50 border-slate-200'
                    }`}
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Phone Number {customerFound && <span className="ml-2 text-amber-600">(Locked)</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-slate-500 font-medium border-r border-slate-300 pr-2">+91</span>
                  </div>
                  <input
                    readOnly={customerFound}
                    className={`w-full border rounded-xl pl-14 pr-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium ${customerFound ? 'bg-amber-50 border-amber-300 cursor-not-allowed' : 'bg-slate-50 border-slate-200'
                      }`}
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setPhone(val)
                    }}
                    placeholder="98765 43210"
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Email Address {customerFound && <span className="ml-2 text-amber-600">(Locked)</span>}
                </label>
                <input
                  type="email"
                  readOnly={customerFound}
                  className={`w-full border rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium ${customerFound ? 'bg-amber-50 border-amber-300 cursor-not-allowed' : 'bg-slate-50 border-slate-200'
                    }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Date of Birth <span className="text-red-500">*</span>
                  {customerFound && <span className="ml-2 text-amber-600">(Locked)</span>}
                </label>
                <DatePicker
                  date={dob}
                  setDate={setDob}
                />
              </div>
            </div>
          </div>

          {/* Policy Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Policy Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Category <span className="text-red-500">*</span></label>
                <select
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as typeof CATEGORIES[number])}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Insurer Name <span className="text-red-500">*</span></label>
                <select
                  required
                  disabled={!category || fetchingCompanies}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none disabled:bg-slate-100 disabled:text-slate-400"
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                >
                  <option value="">
                    {fetchingCompanies ? 'Loading...' : (category ? 'Select Company' : 'Select Category First')}
                  </option>
                  {companies.map(comp => (
                    <option key={comp.id} value={comp.id}>{comp.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy Number <span className="text-red-500">*</span></label>
                <input
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  placeholder="e.g. POL-123456789"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Product Opted</label>
                <select
                  disabled={!category || !selectedCompanyId || fetchingProducts}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none disabled:bg-slate-100 disabled:text-slate-400"
                  value={productName}
                  onChange={(e) => {
                    const selectedName = e.target.value
                    setProductName(selectedName)
                    const selectedProduct = products.find(p => p.name === selectedName)
                    setProductType(selectedProduct?.product_type || '')
                    setVehicleNumber('')
                  }}
                >
                  <option value="">
                    {fetchingProducts ? 'Loading Products...' : (selectedCompanyId ? 'Select Product' : 'Select Insurer First')}
                  </option>
                  {products.map(product => (
                    <option key={product.id} value={product.name}>{product.name}</option>
                  ))}
                </select>
              </div>

              {/* Vehicle Number - only visible when Category is General and Product Type is Vehicle */}
              {category === 'General' && productType === 'Vehicle' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Vehicle Number <span className="text-red-500">*</span></label>
                  <input
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. KA01AB1234"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Sum Insured</label>
                <input
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  value={sumInsured}
                  onChange={(e) => setSumInsured(e.target.value)}
                  placeholder="e.g. 500000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Premium Collected (incl. taxes)</label>
                <input
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  value={premiumAmount}
                  onChange={(e) => setPremiumAmount(e.target.value)}
                  placeholder="e.g. 15000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy Start Date</label>
                <DatePicker
                  date={startDate}
                  setDate={setStartDate}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy End Date</label>
                <DatePicker
                  date={endDate}
                  setDate={setEndDate}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy Duration</label>
                <input
                  readOnly
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-500 font-medium cursor-not-allowed"
                  value={policyDuration}
                  placeholder="Auto-calculated"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy Status</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Notes</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes here..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3 border-t border-slate-100 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? 'Saving...' : (customerFound ? 'Add Policy to Customer' : 'Create Customer & Policy')}
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

