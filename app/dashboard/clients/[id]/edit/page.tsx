'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function EditClientPage() {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const supabase = createClient()
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    useEffect(() => {
        const fetchClient = async () => {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                alert('Error fetching client: ' + error.message)
                router.push('/dashboard/clients')
            } else if (data) {
                setName(data.name || '')
                setPhone(data.phone || '')
                setEmail(data.email || '')
            }
            setLoading(false)
        }

        if (id) fetchClient()
    }, [id, router, supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const { error } = await supabase
            .from('clients')
            .update({ name, phone, email })
            .eq('id', id)

        if (error) {
            alert(error.message)
            setSaving(false)
        } else {
            router.push('/dashboard/clients')
            router.refresh()
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

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-5">
                <div>
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
