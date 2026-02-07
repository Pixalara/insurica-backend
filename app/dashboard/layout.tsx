"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '../../components/ui/LogoutButton'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', exact: true },
    { name: 'Clients', href: '/dashboard/clients' },
    { name: 'Product Catalogue', href: '/dashboard/product-catalogue' },
    { name: 'Policies', href: '/dashboard/policies' },
    { name: 'Renewals', href: '/dashboard/renewals' },
    { name: 'Lead Management', href: '/dashboard/leads' },
  ]

  const isActive = (item: { href: string; exact?: boolean }) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname.startsWith(item.href)
  }

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
          {navItems.map((item) => {
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block p-3 rounded-xl transition-all font-medium cursor-pointer select-none border-l-4 ${
                  active 
                    ? 'bg-blue-600/10 text-blue-400 border-blue-500 shadow-inner' 
                    : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
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
