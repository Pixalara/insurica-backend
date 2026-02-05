
'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export function LeadsFilter() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    
    if (status && status !== 'All') {
      params.set('status', status)
    } else {
      params.delete('status')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('query')?.toString()}
          placeholder="Search leads by name, email, or phone..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <select 
            onChange={(e) => handleStatusChange(e.target.value)}
            defaultValue={searchParams.get('status')?.toString() || 'All'}
            className="w-full md:w-40 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Follow Up">Follow Up</option>
          <option value="Closed">Closed</option>
          <option value="Lost">Lost</option>
        </select>
      </div>
    </div>
  )
}
