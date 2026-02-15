'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface RenewalStatsProps {
    stats: {
        this_month: number
        next_month: number
        expired: number
        lost: number
    }
}

export function RenewalStats({ stats }: RenewalStatsProps) {
    const searchParams = useSearchParams()
    const activeFilter = searchParams.get('filter') || 'this_month'

    const statCards = [
        { label: 'This Month', value: stats.this_month, filter: 'this_month', color: 'text-blue-600' },
        { label: 'Next Month', value: stats.next_month, filter: 'next_month', color: 'text-orange-600' },
        { label: 'Expired', value: stats.expired, filter: 'expired', color: 'text-red-700' },
        { label: 'Lost / Cancelled', value: stats.lost, filter: 'lost', color: 'text-slate-500' },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statCards.map((card) => {
                const isActive = activeFilter === card.filter
                return (
                    <Link
                        key={card.filter}
                        href={`/dashboard/renewals?filter=${card.filter}`}
                        className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${isActive
                            ? 'bg-blue-50 border-blue-500 shadow-md'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                            }`}
                    >
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                        <p className={`text-3xl font-black ${isActive ? 'text-blue-600' : card.color} mt-2`}>
                            {card.value}
                        </p>
                    </Link>
                )
            })}
        </div>
    )
}
