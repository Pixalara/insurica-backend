import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h2 className="text-xl font-bold text-blue-400 mb-8">Insurica Admin</h2>
        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="block p-2 hover:bg-slate-800 rounded">Overview</Link>
          <Link href="/dashboard/clients" className="block p-2 hover:bg-slate-800 rounded">Clients</Link>
          <Link href="/dashboard/policies" className="block p-2 hover:bg-slate-800 rounded">Policies</Link>
        </nav>
        <div className="border-t border-slate-700 pt-4">
          <p className="text-xs text-slate-400">Powered by Pixalara</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}