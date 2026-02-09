"use client"
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '../../components/ui/LogoutButton'
import { Menu, X } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <h2 className="text-xl font-bold tracking-tighter text-blue-400">Insurica.</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed h-full z-50 bg-slate-900 text-white p-6 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        w-64 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:block
      `}>
        {/* Logo - hidden on mobile since it's in the header */}
        <div className="mb-10 hidden lg:block">
          <h2 className="text-2xl font-bold tracking-tighter text-blue-400">Insurica.</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
            Admin Portal
          </p>
        </div>

        {/* Mobile spacing for header */}
        <div className="lg:hidden h-4" />

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`block p-3 rounded-xl transition-all font-medium cursor-pointer select-none border-l-4 ${active
                    ? 'bg-blue-600/10 text-blue-400 border-blue-500 shadow-inner'
                    : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
                  }`}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Logout Option */}
        <div className="mt-auto pb-4">
          <LogoutButton />
        </div>

        <div className="border-t border-slate-800 pt-6 hidden lg:block">
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
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-10 pt-20 lg:pt-10">
        {children}
      </main>
    </div>
  )
}
