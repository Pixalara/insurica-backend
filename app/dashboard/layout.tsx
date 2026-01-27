import Link from 'next/link'
import LogoutButton from '../../components/LogoutButton'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Premium Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col fixed h-full shadow-2xl">
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tighter text-blue-400">Insurica.</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
            Admin Portal
          </p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="block p-3 hover:bg-slate-800 rounded-xl transition-colors font-medium">
            Overview
          </Link>
          <Link href="/dashboard/clients" className="block p-3 hover:bg-slate-800 rounded-xl transition-colors font-medium">
            Clients
          </Link>
          <Link href="/dashboard/general" className="block p-3 hover:bg-slate-800 rounded-xl transition-colors font-medium">
            General
          </Link>
          <Link href="/dashboard/health" className="block p-3 hover:bg-slate-800 rounded-xl transition-colors font-medium">
            Health
          </Link>
          <Link href="/dashboard/policies" className="block p-3 hover:bg-slate-800 rounded-xl transition-colors font-medium">
            Policies
          </Link>
        </nav>

        {/* Logout Option integrated here */}
        <div className="mt-auto pb-4">
          <LogoutButton />
        </div>

        <div className="border-t border-slate-800 pt-6">
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-[0.2em]">
            Digital Experiences.
          </p>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-[0.2em]">
            Engineered to Scale.
          </p>
          <p className="text-xs text-blue-400 mt-2 font-bold italic">Pixalara.com</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-10">
        {children}
      </main>
    </div>
  )
}