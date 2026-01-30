'use client'

import { use, useState, useEffect } from 'react'
import { getClient, updateClient, getCompanies } from '../../actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORIES = ['General', 'Health', 'Life'] as const

type Company = {
  id: string
  name: string
  type: 'General' | 'Health' | 'Life'
}

export default function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)

  // Fields
  const [name, setName] = useState('')
  const [policyNumber, setPolicyNumber] = useState('')
  const [category, setCategory] = useState<typeof CATEGORIES[number] | ''>('')
  
  // Dependent on Category
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState('')

  // Other Fields
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [productName, setProductName] = useState('')
  const [sumInsured, setSumInsured] = useState('')
  const [premiumAmount, setPremiumAmount] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [policyDuration, setPolicyDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('Active')

  const [initialLoad, setInitialLoad] = useState(true)

  const router = useRouter()

  // Fetch Client Data
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
        setSelectedCompanyId(client.company_id)
        setProductName(client.product_name || '')
        setSumInsured(client.sum_insured?.toString() || '')
        setPremiumAmount(client.premium_amount?.toString() || '')
        setStartDate(client.start_date || '')
        setEndDate(client.end_date || '')
        setPolicyDuration(client.policy_duration || '')
        setNotes(client.notes || '')
        setStatus(client.status || 'Active')

      } catch (error) {
        console.error('Error loading client:', error)
        toast.error('Failed to load client details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchClient()
    }
  }, [id])

  // Fetch companies when category changes
  useEffect(() => {
    async function fetchCompanies() {
      if (!category) {
        setCompanies([])
        return
      }

      try {
        const data = await getCompanies(category)
        setCompanies(data as any[]) 
      } catch (err) {
         console.error('Failed to fetch companies', err)
      }
    }

    fetchCompanies()
  }, [category])


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
    const toastId = toast.loading('Updating client/policy...')

    try {
      const formData = {
        name,
        email: email || null,
        phone: phone || null,
        policy_number: policyNumber,
        category,
        company_id: selectedCompanyId,
        product_name: productName || null,
        sum_insured: sumInsured,
        premium_amount: premiumAmount,
        start_date: startDate,
        end_date: endDate,
        policy_duration: policyDuration,
        notes: notes,
        status
      }

      await updateClient(id, formData)

      toast.success('Client updated successfully', { id: toastId })
      router.push('/dashboard/clients')
    } catch (error: any) {
      console.error('Update error', error)
      toast.error('Failed to update client: ' + error.message, { id: toastId })
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
        <h2 className="text-2xl font-bold text-slate-800">Client Not Found</h2>
        <Link href="/dashboard/clients" className="text-blue-600 mt-4 inline-block hover:underline">
          Back to Directory
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <Link href="/dashboard/clients" className="text-slate-500 hover:text-slate-800 gap-2 mb-2 inline-flex items-center">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Client / Policy</h1>
        <p className="text-slate-500 text-sm mt-1">Update client and policy details.</p>
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
                onChange={(e) => setCategory(e.target.value as any)}
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
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Jeevan Anand"
              />
            </div>

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
               <input
                type="date"
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
               />
            </div>
            <div>
               <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy End Date</label>
               <input
                type="date"
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
               />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy Duration</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                value={policyDuration}
                onChange={(e) => setPolicyDuration(e.target.value)}
                placeholder="e.g. 1 Year"
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
                <option value="Inactive">Inactive</option>
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
            {saving ? 'Updating...' : 'Update Client'}
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
