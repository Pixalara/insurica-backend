'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function EditClientPage() {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [productType, setProductType] = useState('')
    const [policyStatus, setPolicyStatus] = useState('Active')
    const [insurer, setInsurer] = useState('')

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)


    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    useEffect(() => {
        // Dynamically import storage to avoid SSR issues
        import('../../client-storage').then(({ ClientStorage }) => {
            const clients = ClientStorage.getClients()
            const client = clients.find(c => c.id === id)

            if (client) {
                setName(client.name || '')
                setPhone(client.phone || '')
                setEmail(client.email || '')
                setProductType(client.productType || '')
                setPolicyStatus(client.policyStatus || 'Active')
                setInsurer(client.insurer || '')
            } else {
                toast.error('Client not found')
                router.push('/dashboard/clients')
            }
            setLoading(false)
        })
    }, [id, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const { ClientStorage } = await import('../../client-storage')
            ClientStorage.updateClient(id, {
                name,
                phone,
                email,
                productType,
                policyStatus: policyStatus as any,
                insurer
            })

            toast.success('Client updated successfully')
            router.push('/dashboard/clients')
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error('Failed to update client')
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-6">
                <Link href="/dashboard/clients" className="text-slate-500 hover:text-slate-800 gap-2 mb-2 inline-flex items-center">
                    <ArrowLeft className="w-4 h-4" /> Back to Directory
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Edit Client: {name}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">

                {/* Personal Information */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Client Name</label>
                            <input
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                            <input
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
                            <input
                                type="email"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Policy Information */}
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
                                <option value="Life Insurance">Life Insurance</option>
                                <option value="General Insurance">General Insurance</option>
                                <option value="Health Insurance">Health Insurance</option>
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
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Insurer Name</label>
                            <select
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                                value={insurer}
                                onChange={(e) => setInsurer(e.target.value)}
                            >
                                <option value="">Select Company</option>
                                <option value="LIC">LIC</option>
                                <option value="HDFC Life">HDFC Life</option>
                                <option value="Star Health">Star Health</option>
                                <option value="ICICI Lombard">ICICI Lombard</option>
                                <option value="Bajaj Allianz">Bajaj Allianz</option>
                                <option value="Max Life">Max Life</option>
                                <option value="Tata AIA">Tata AIA</option>
                                <option value="Niva Bupa">Niva Bupa</option>
                                <option value="Aditya Birla">Aditya Birla</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex gap-3 border-t border-slate-100 mt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {saving ? 'Saving Changes...' : 'Save Changes'}
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
