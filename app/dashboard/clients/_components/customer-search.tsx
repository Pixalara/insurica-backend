'use client'

import { useState } from 'react'
import { findCustomerByPhone } from '../actions'
import { toast } from 'sonner'

interface CustomerSearchProps {
    onCustomerFound: (customer: { id: string; name: string; phone: string; email: string | null }) => void
    onCustomerNotFound: () => void
}

export function CustomerSearch({ onCustomerFound, onCustomerNotFound }: CustomerSearchProps) {
    const [phone, setPhone] = useState('')
    const [searching, setSearching] = useState(false)

    const handleSearch = async () => {
        if (!phone.trim()) {
            toast.error('Please enter a phone number')
            return
        }

        setSearching(true)
        try {
            const result = await findCustomerByPhone(phone)

            if (result.found && result.customer) {
                toast.success('Customer found!')
                onCustomerFound(result.customer)
            } else {
                toast.info('No customer found with this number')
                onCustomerNotFound()
            }
        } catch (error) {
            toast.error('Error searching for customer')
            console.error(error)
        } finally {
            setSearching(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Universal Customer ID Lookup</h3>
                <p className="text-sm text-slate-600">Enter mobile number to check existing customer</p>
            </div>

            <div className="flex gap-3">
                <div className="flex-1">
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter phone number (e.g., +91-9876543210)"
                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        disabled={searching}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={searching || !phone.trim()}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {searching ? 'Searching...' : 'Search Customer'}
                </button>
            </div>

            <p className="text-xs text-slate-500 mt-3">
                💡 Tip: If customer exists, their details will be auto-filled and locked
            </p>
        </div>
    )
}
