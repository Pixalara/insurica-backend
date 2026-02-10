'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface RevenuePieChartProps {
    data: {
        name: string
        value: number
    }[]
}

const COLOR_MAP: Record<string, string> = {
    'General': '#3B82F6', 
    'Health': '#10B981', 
    'Life': '#F59E0B',    
}
const DEFAULT_COLOR = '#6366F1' 

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export function RevenuePieChart({ data }: RevenuePieChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])

    if (!mounted) return <div className="h-[400px] w-full bg-white p-4 rounded-xl border border-slate-200" />

    return (
        <div className="h-[400px] w-full min-w-0 bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Revenue Distribution</h3>
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLOR_MAP[entry.name] || DEFAULT_COLOR} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number | string | undefined) => formatCurrency(Number(value || 0))}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
