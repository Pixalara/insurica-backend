import Link from 'next/link'
import { Client } from '../types'
import { User, Phone, Mail, CheckCircle, XCircle, Edit } from 'lucide-react'

interface ClientCardProps {
    client: Client
}

export function ClientCard({ client }: ClientCardProps) {
    const isRegistered = client.registrationStatus === 'Registered' || true // Defaulting to true as per requirements until data is available

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow relative group">
            <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                    <User className="w-6 h-6" />
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${isRegistered ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                    {isRegistered ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {isRegistered ? 'Registered' : 'Not Registered'}
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">{client.name}</h3>
            <p className="text-xs text-slate-500 mb-4">ID: {client.id.slice(0, 8)}...</p>

            <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{client.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{client.email || 'No email'}</span>
                </div>
            </div>

            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                    href={`/dashboard/clients/${client.id}/edit`}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors inline-block"
                    title="Edit Details"
                >
                    <Edit className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
