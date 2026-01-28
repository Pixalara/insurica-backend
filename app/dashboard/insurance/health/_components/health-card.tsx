import Link from 'next/link'
import { HealthPolicy } from '../types'
import { Phone, Mail, Calendar, Heart, Shield, Users, ArrowRight, Activity } from 'lucide-react'

interface HealthCardProps {
    policy: HealthPolicy
}

export function HealthCard({ policy }: HealthCardProps) {
    const isActive = policy.status === 'Active'

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    // Format dates
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

 

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-semibold rounded-bl-lg ${isActive ? 'bg-green-100 text-green-700' :
                    policy.status === 'Grace Period' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-50 text-red-600'
                }`}>
                {policy.status}
            </div>

            <div className="flex items-start gap-4 mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{policy.holderName}</h3>
                    <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded inline-block">
                        {policy.policyNumber}
                    </p>
                </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 mb-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-500">Sum Insured</span>
                    </div>
                    <span className="font-semibold text-slate-900">{formatCurrency(policy.sumInsured)}</span>
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-slate-100 pt-2">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-500">Members</span>
                    </div>
                    <span className="font-medium text-slate-900">{policy.membersCovered} Covered</span>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-xs">
                        Exp: {formatDate(policy.endDate)}
                    </span>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">{policy.planType}</span>
                <Link
                    href={`/dashboard/health/${policy.id}`}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                    View Details <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
