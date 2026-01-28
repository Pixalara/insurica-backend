import Link from 'next/link'
import { InsuranceGrid } from './_components/insurance-grid'
import { GeneralPolicy } from './types'

// Mock Data for demonstration
const MOCK_POLICIES: GeneralPolicy[] = [
    {
        id: '1',
        policyNumber: 'GI-2024-001',
        holderName: 'Rajesh Kumar',
        contactNumber: '+91 98765 43210',
        email: 'rajesh.k@example.com',
        type: 'Health',
        startDate: '2024-01-15',
        endDate: '2025-01-14',
        amountPaid: 15000,
        status: 'Active'
    },
    {
        id: '2',
        policyNumber: 'GI-2024-002',
        holderName: 'Priya Sharma',
        contactNumber: '+91 98123 45678',
        email: 'priya.s@example.com',
        type: 'Motor',
        startDate: '2023-11-20',
        endDate: '2024-11-19',
        amountPaid: 8500,
        status: 'Active'
    },
    {
        id: '3',
        policyNumber: 'GI-2023-089',
        holderName: 'Amit Patel',
        contactNumber: '+91 99887 76655',
        email: 'amit.p@example.com',
        type: 'Travel',
        startDate: '2023-12-01',
        endDate: '2023-12-15',
        amountPaid: 2500,
        status: 'Expired'
    },
    {
        id: '4',
        policyNumber: 'GI-2024-015',
        holderName: 'Sneha Gupta',
        contactNumber: '+91 98765 12345',
        email: 'sneha.g@example.com',
        type: 'Health',
        startDate: '2024-02-01',
        endDate: '2025-01-31',
        amountPaid: 22000,
        status: 'Active'
    }
]

export default function GeneralInsurancePage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">General Insurance</h1>
                    <p className="text-slate-500 text-sm">Manage health, motor, and other general insurance policies.</p>
                </div>
                <Link
                    href="/dashboard/general/new"
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2"
                >
                    <span>+ New Policy</span>
                </Link>
            </div>

            <InsuranceGrid policies={MOCK_POLICIES} />
        </div>
    )
}