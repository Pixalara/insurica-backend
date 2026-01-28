import Link from 'next/link'
import { GeneralPolicy } from '../types'
import { Phone, Mail, Calendar, CreditCard, Shield, FileText, ArrowRight } from 'lucide-react'

interface InsuranceCardProps {
    policy: GeneralPolicy
}

export function InsuranceCard({ policy }: InsuranceCardProps) {
    const isActive = policy.status === 'Active'

    // Format currency
    const formattedAmount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(policy.amountPaid)

    // Format dates
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Health': return 'text-red-600 bg-red-50'
            case 'Motor': return 'text-blue-600 bg-blue-50'
            case 'Travel': return 'text-yellow-600 bg-yellow-50'
            default: return 'text-slate-600 bg-slate-50'
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-lg ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>
                {policy.status}
            </div>

            <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${getTypeColor(policy.type)}`}>
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{policy.holderName}</h3>
                    <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded inline-block">
                        {policy.policyNumber}
                    </p>
                </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 mb-5">
                <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{policy.contactNumber}</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{policy.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-xs">
                        {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
                    </span>
                </div>
                <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-900">{formattedAmount}</span>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">{policy.type} Insurance</span>
                <Link
                    href={`/dashboard/general/${policy.id}`}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                    View Details <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
