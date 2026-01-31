
'use client'

import { useState } from 'react'
import { LeadDialog } from './lead-dialog'

export function AddLeadButton() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
                <span>+ Add New Lead</span>
            </button>
            <LeadDialog 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
            />
        </>
    )
}
