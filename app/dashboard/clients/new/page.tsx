'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const INSURANCE_COMPANIES = [
  'LIC',
  'HDFC Life',
  'Star Health',
  'ICICI Lombard',
  'Bajaj Allianz',
  'Max Life',
  'Tata AIA',
  'Niva Bupa',
  'Aditya Birla',
  'Other'
]

const PRODUCT_TYPES = [
  'Life Insurance',
  'General Insurance',
  'Health Insurance'
]

export default function NewClientPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [company, setCompany] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [notes, setNotes] = useState('')

  // New Fields
  const [productType, setProductType] = useState('')
  const [policyStatus, setPolicyStatus] = useState('Active')

  const [loading, setLoading] = useState(false)

  /* Supabase Code - Commented out for Local Storage Mode
  const supabase = createClient() 
  */
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const toastId = toast.loading('Saving client details...')

    try {
      // Dynamically import storage to avoid SSR issues if any
      const { ClientStorage } = await import('../client-storage')

      ClientStorage.addClient({
        name,
        phone,
        email,
        dob,
        gender: gender as any,
        // company, // Use company as insurer
        address,
        city,
        state,
        zip,
        notes,
        registrationStatus: 'Registered',
        policyStatus: policyStatus as any,
        productType: productType,
        insurer: company
      })

      toast.success('Client created locally', { id: toastId })
      router.push('/dashboard/clients')
      router.refresh()
    } catch (error: any) {
      console.error('Save error', error)
      toast.error('Failed to save client locally', { id: toastId })
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <Link href="/dashboard/clients" className="text-slate-500 hover:text-slate-800 gap-2 mb-2 inline-flex items-center">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Add New Client</h1>
        <p className="text-slate-500 text-sm mt-1">Enter client basic information and insurance portfolio details.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">

        {/* Basic Information Section */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Name <span className="text-red-500">*</span></label>
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

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Gender</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Company Dropdown */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Insurance Company / Organization</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              >
                <option value="">Select Company</option>
                {INSURANCE_COMPANIES.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Policy Details Section */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Policy Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Product Type</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
              >
                <option value="">Select Product Type</option>
                {PRODUCT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Policy Status</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                value={policyStatus}
                onChange={(e) => setPolicyStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
        </div>


        {/* Address Section */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Address Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Street Address</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Apt 4B"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">City</label>
              <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">State</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="MH"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Zip Code</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="400001"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Additional Notes</h3>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Remarks</label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium min-h-[100px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific requirements or existing medical conditions..."
            />
          </div>
        </div>

        <div className="pt-4 flex gap-3 border-t border-slate-100 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading ? 'Saving Client...' : 'Save Client'}
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
