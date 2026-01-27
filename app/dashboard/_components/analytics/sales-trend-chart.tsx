'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const data = [
    { name: 'Jan', sales: 4 },
    { name: 'Feb', sales: 7 },
    { name: 'Mar', sales: 5 },
    { name: 'Apr', sales: 11 },
    { name: 'May', sales: 9 },
    { name: 'Jun', sales: 15 },
    { name: 'Jul', sales: 18 },
]

export function SalesTrendChart() {
    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4 px-2">Total Policies Sold Trend</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 10,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 11 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 11 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="sales" stroke="#2563EB" fill="#3B82F6" fillOpacity={0.1} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
