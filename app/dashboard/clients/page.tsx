import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function ClientsPage() {
  const supabase = createClient()
  
  // Fetch clients for the logged-in agent
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Clients</h1>
        <Link 
          href="/dashboard/clients/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add New Client
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Name</th>
              <th className="p-4 font-semibold text-slate-700">Phone</th>
              <th className="p-4 font-semibold text-slate-700">Email</th>
              <th className="p-4 font-semibold text-slate-700">Joined</th>
            </tr>
          </thead>
          <tbody>
            {clients?.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No clients found. Click "+ Add New Client" to start.
                </td>
              </tr>
            ) : (
              clients?.map((client) => (
                <tr key={client.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-medium">{client.name}</td>
                  <td className="p-4 text-slate-600">{client.phone || '-'}</td>
                  <td className="p-4 text-slate-600">{client.email || '-'}</td>
                  <td className="p-4 text-slate-500 text-sm">
                    {new Date(client.created_at).toLocaleDateString()}
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