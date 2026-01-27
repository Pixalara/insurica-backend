import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function ClientsPage() {
  // Await the client for Next.js 16 compatibility
  const supabase = await createClient()
  
  // Fetch clients belonging to this agent, ordered by newest first
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error loading clients:', error.message)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Client Directory</h1>
          <p className="text-slate-500 text-sm">Manage your book of business.</p>
        </div>
        <Link 
          href="/dashboard/clients/new" 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Add New Client
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Client Name</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Phone Number</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Email ID</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Registration Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!clients || clients.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-12 text-center text-slate-400 italic">
                  No clients onboarded yet.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-semibold text-slate-900">{client.name}</td>
                  <td className="p-4 text-slate-600">{client.phone || 'N/A'}</td>
                  <td className="p-4 text-slate-600">{client.email || 'N/A'}</td>
                  <td className="p-4 text-slate-500 text-sm">
                    {new Date(client.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}