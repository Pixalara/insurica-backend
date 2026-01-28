import Link from 'next/link'
import { HealthGrid } from './_components/health-grid'
import { HealthPolicy } from './types'

// Mock Data for demonstration
const MOCK_POLICIES: HealthPolicy[] = [
    {
        id: '1',
        policyNumber: 'HI-2024-001',
        holderName: 'Vikram Singh',
        contactNumber: '+91 98765 00001',
        email: 'vikram.s@example.com',
        planType: 'Family Floater',
        sumInsured: 500000,
        premiumAmount: 12500,
        startDate: '2024-03-01',
        endDate: '2025-02-28',
        renewalDate: '2025-02-28',
        membersCovered: 4,
        status: 'Active',
        insurer: 'Star Health'
    },
    {
        id: '2',
        policyNumber: 'HI-2024-042',
        holderName: 'Anjali Desai',
        contactNumber: '+91 98123 99999',
        email: 'anjali.d@example.com',
        planType: 'Individual',
        sumInsured: 1000000,
        premiumAmount: 8000,
        startDate: '2023-06-15',
        endDate: '2024-06-14',
        renewalDate: '2024-06-14',
        membersCovered: 1,
        status: 'Active',
        insurer: 'HDFC Ergo'
    },
    {
        id: '3',
        policyNumber: 'HI-2023-112',
        holderName: 'Ramesh Gupta',
        contactNumber: '+91 99887 11223',
        email: 'ramesh.g@example.com',
        planType: 'Senior Citizen',
        sumInsured: 300000,
        premiumAmount: 18000,
        startDate: '2023-01-10',
        endDate: '2024-01-09',
        renewalDate: '2024-01-09',
        membersCovered: 2,
        status: 'Expired',
        insurer: 'Niva Bupa'
    },
    {
        id: '4',
        policyNumber: 'HI-2024-088',
        holderName: 'Kavita Reddy',
        contactNumber: '+91 98765 55443',
        email: 'kavita.r@example.com',
        planType: 'Critical Illness',
        sumInsured: 2500000,
        premiumAmount: 22000,
        startDate: '2024-02-01',
        endDate: '2025-01-31',
        renewalDate: '2025-01-31',
        membersCovered: 1,
        status: 'Active',
        insurer: 'ICICI Lombard'
    }
]

export default function HealthInsurancePage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Health Insurance</h1>
                    <p className="text-slate-500 text-sm">Manage health policies, renewal dates, and claims.</p>
                </div>
                <Link
                    href="/dashboard/health/new"
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2"
                >
                    <span>+ New Health Policy</span>
                </Link>
            </div>

            <HealthGrid policies={MOCK_POLICIES} />
        </div>
    )
}