'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface RenewalStatsProps {
    stats: {
        upcoming30: number
        upcoming60: number
        upcoming90: number
        overdue: number
    }
}

export function RenewalStats({ stats }: RenewalStatsProps) {
    const searchParams = useSearchParams()
    const activeFilter = searchParams.get('filter') || '30'

    const statCards = [
        { label: 'Next 30 Days', value: stats.upcoming30, filter: '30', color: 'text-red-600' },
        { label: 'Next 60 Days', value: stats.upcoming60, filter: '60', color: 'text-orange-600' },
        { label: 'Next 90 Days', value: stats.upcoming90, filter: '90', color: 'text-yellow-600' },
        { label: 'Overdue', value: stats.overdue, filter: 'overdue', color: 'text-red-700' },
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
