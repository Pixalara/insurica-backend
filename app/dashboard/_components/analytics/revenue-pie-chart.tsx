'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const data = [
    { name: 'Health', value: 450000 },
    { name: 'Motor', value: 300000 },
    { name: 'Life', value: 250000 },
    { name: 'General', value: 150000 },
]

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1']

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export function RevenuePieChart() {
    return (
        <div className="h-[400px] w-full bg-white p-4 rounded-xl border border-slate-200 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Revenue Distribution</h3>
            <div className="flex-1 min-h-0">
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
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: any) => formatCurrency(value)}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
