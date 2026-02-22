'use client'

import { use, useState, useEffect } from 'react'
import { getClient, updateClient, getCompanies } from '../../../clients/actions'
import { getProducts } from '../../../product-catalogue/actions'
import type { Product } from '../../../product-catalogue/types'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import { format } from 'date-fns'
import { toast } from 'sonner'

const CATEGORIES = ['General', 'Health', 'Life'] as const

type Company = {
  id: string
  name: string
  type: 'General' | 'Health' | 'Life'
}

export default function EditPolicyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [fetchingProducts, setFetchingProducts] = useState(false)

  // Fields
  const [name, setName] = useState('')
  const [policyNumber, setPolicyNumber] = useState('')
  const [category, setCategory] = useState<typeof CATEGORIES[number] | ''>('')
  const [productType, setProductType] = useState('')
  const [vehicleNumber, setVehicleNumber] = useState('')

  // Dependent on Category
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [insuranceCompany, setInsuranceCompany] = useState('')
  const [products, setProducts] = useState<Product[]>([])

  // Other Fields
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [productName, setProductName] = useState('')
  const [sumInsured, setSumInsured] = useState('')
  const [premiumAmount, setPremiumAmount] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('Active')

  const router = useRouter()

  useEffect(() => {
    async function fetchClient() {
      try {
        const client = await getClient(id)
        if (!client) {
          setNotFound(true)
          setLoading(false)
          return
        }

        setName(client.name)
        setPolicyNumber(client.policy_number)
        setEmail(client.email || '')
        setPhone(client.phone || '')
        setCategory(client.category)
        setProductType(client.product_type || '')
        setVehicleNumber(client.vehicle_number || '')
        setInsuranceCompany(client.insurance_company || '')
        setProductName(client.product_name || '')
        setSumInsured(client.sum_insured?.toString() || '')
        setPremiumAmount(client.premium_amount?.toString() || '')
        setStartDate(client.start_date ? new Date(client.start_date) : undefined)
        setEndDate(client.end_date ? new Date(client.end_date) : undefined)
        setNotes(client.remarks || '')
        setStatus(client.status || 'Active')

      } catch (error) {
        console.error('Error loading policy:', error)
        toast.error('Failed to load policy details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchClient()
    }
  }, [id])

  useEffect(() => {
    async function fetchCompanies() {
      if (!category) {
        setCompanies([])
        return
      }

      try {
        const data = await getCompanies(category)
        setCompanies(data as Company[])

        if (insuranceCompany && data) {
          const match = (data as Company[]).find(c =>
            c.name.toLowerCase() === insuranceCompany.toLowerCase()
          )
          if (match) {
            setSelectedCompanyId(match.id)
          }
        }
      } catch (err) {
        console.error('Failed to fetch companies', err)
      }
    }

    fetchCompanies()
  }, [category, insuranceCompany])

  // Fetch Products based on Category and Company
  useEffect(() => {
    async function fetchProducts() {
      if (!category || !selectedCompanyId) {
        setProducts([])
        return
      }

      setFetchingProducts(true)
      try {
        // Find the company name from the selected ID to filter by insurer name
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

  // Derive duration during render
  const calculateDuration = () => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (!isNaN(diffDays)) {
        if (diffDays >= 365) {
          const years = (diffDays / 365).toFixed(1)
          return `${years} Year(s)`
        } else {
          return `${diffDays} Days`
        }
      }
    }
    return ''
  }

  const policyDuration = calculateDuration()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!category) {
      toast.error('Please select a Policy Category')
      return
    }
    if (!selectedCompanyId) {
      toast.error('Please select an Insurance Company')
      return
    }

    setSaving(true)
    const toastId = toast.loading('Updating policy...')

    try {
      const formData: {
        name: string;
        email: string | null;
        phone: string | null;
        policy_number: string;
        category: "General" | "Health" | "Life";
        insurance_company: string;
        product_name: string | null;
        sum_insured: string;
        premium_amount: string;
        start_date: string;
        end_date: string;
        policy_duration: string;
        notes: string;
        status: string;
        product_type: string | null;
        vehicle_number: string | null;
      } = {
        name,
        email: email || null,
        phone: phone || null,
        policy_number: policyNumber,
        category,
        insurance_company: selectedCompanyId ? companies.find(c => c.id === selectedCompanyId)?.name || insuranceCompany : insuranceCompany,
        product_name: productName || null,
        sum_insured: sumInsured,
        premium_amount: premiumAmount,
        start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
        policy_duration: policyDuration,
        notes: notes,
        status,
        product_type: category === 'General' ? productType : null,
        vehicle_number: (category === 'General' && productType === 'Vehicle') ? vehicleNumber : null
      }

      await updateClient(id, formData)

      toast.success('Policy updated successfully', { id: toastId })
      router.push('/dashboard/policies')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Update error', error)
      toast.error('Failed to update: ' + errorMessage, { id: toastId })
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Policy Not Found</h2>
        <Link href="/dashboard/policies" className="text-blue-600 mt-4 inline-block hover:underline">
          Back to Policies
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <Link href="/dashboard/policies" className="text-slate-500 hover:text-slate-800 gap-2 mb-2 inline-flex items-center">
          <ArrowLeft className="w-4 h-4" /> Back to Policies
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Policy</h1>
        <p className="text-slate-500 text-sm mt-1">Update customer and policy details.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">

        {/* Basic Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Insured Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Insured Name <span className="text-red-500">*</span></label>
              <input
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
              <input
                type="email"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john@example.com"
              />
            </div>
          </div>
        </div>

        {/* Policy Information Section */}
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
                disabled={!category}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none disabled:bg-slate-100 disabled:text-slate-400"
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
              >
                <option value="">
                  {category ? 'Select Company' : 'Select Category First'}
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Product Opted </label>
              <select
                disabled={!category || !selectedCompanyId || fetchingProducts}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none disabled:bg-slate-100 disabled:text-slate-400"
                value={productName}
                onChange={(e) => {
                  const selectedName = e.target.value
                  setProductName(selectedName)
                  // Look up the selected product's product_type
                  const selectedProduct = products.find(p => p.name === selectedName)
                  setProductType(selectedProduct?.product_type || '')
                  // Clear vehicle number if product changes
                  setVehicleNumber('')
                }}
              >
                <option value="">
                  {fetchingProducts ? 'Loading Products...' : (selectedCompanyId ? 'Select Product' : 'Select Insurer First')}
                </option>
                {/* Handle pre-selected product that might not be in the list */}
                {productName && !products.find(p => p.name === productName) && !fetchingProducts && selectedCompanyId && (
                  <option value={productName}>{productName} (Current)</option>
                )}
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
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {saving ? 'Updating...' : 'Update Policy'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
