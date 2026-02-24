import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export interface RenewalData {
    policy_number: string | null;
    customer_name: string;
    email: string | null;
    category: string;
    premium: number | null;
    expiry_date: string | null;
    days_remaining: number;
}

export function generateRenewalsExcel(renewals: RenewalData[]): Buffer {
    const data = renewals.map(r => ({
        'Policy Number': r.policy_number || 'N/A',
        'Client Name': r.customer_name,
        'Email': r.email || 'N/A',
        'Category': r.category,
        'Premium': r.premium ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(r.premium) : '-',
        'Expiry Date': r.expiry_date ? format(new Date(r.expiry_date), 'MMM dd, yyyy') : '-',
        'Days Remaining': r.days_remaining
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Renewals');

    // Generate buffer
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}
