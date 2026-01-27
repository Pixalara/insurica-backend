'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const data = [
    { name: 'Family Floater', count: 120 },
    { name: 'Motor', count: 98 },
    { name: 'Individual', count: 86 },
    { name: 'Term Life', count: 54 },
    { name: 'Travel', count: 32 },
]

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1', '#EC4899']

export function TopProductsChart() {
    return (
        <div className="h-[300px] w-full bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Most Popular Policies</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{
                        top: 5,
                        right: 30,
                        left: 40,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip
                        cursor={{ fill: '#F1F5F9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
