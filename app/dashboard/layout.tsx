"use client"
import Link from 'next/link'
import { useState } from 'react';
import LogoutButton from '../../components/ui/LogoutButton'


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [openInsurance, setOpenInsurance] = useState(false);

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
          {/* Overview */}
          <Link
            href="/dashboard"
            className="block p-3 hover:bg-slate-800 rounded-xl transition-colors font-medium cursor-pointer select-none"
          >
            Overview
          </Link>

          {/* Clients */}
          <Link
            href="/dashboard/clients"
            className="block p-3 hover:bg-slate-800 rounded-xl transition-colors font-medium cursor-pointer select-none"
          >
            Clients
          </Link>

          {/* Insurance Dropdown */}
          <div>
            <button
              onClick={() => setOpenInsurance(!openInsurance)}
              className="w-full flex justify-between items-center p-3 hover:bg-slate-800 rounded-xl transition-colors font-medium cursor-pointer select-none"
            >
              Insurance
              <span
                className={`transition-transform ${openInsurance ? "rotate-180" : ""
                  }`}
              >
                ▼
              </span>
            </button>

            {openInsurance && (
              <div className="ml-4 mt-2 space-y-1">
                <Link
                  href="/dashboard/insurance/general"
                  className="block p-2 hover:bg-slate-800 rounded-lg transition-colors text-sm cursor-pointer select-none"
                >
                  General Insurance
                </Link>

                <Link
                  href="/dashboard/insurance/health"
                  className="block p-2 hover:bg-slate-800 rounded-lg transition-colors text-sm cursor-pointer select-none"
                >
                  Health Insurance
                </Link>

                <Link
                  href="/dashboard/insurance/life"
                  className="block p-2 hover:bg-slate-800 rounded-lg transition-colors text-sm cursor-pointer select-none"
                >
                  Life Insurance
                </Link>
              </div>
            )}
          </div>

          {/* Lead Management */}
          <Link
            href="/dashboard/leads"
            className="block p-3 hover:bg-slate-800 rounded-xl transition-colors font-medium cursor-pointer select-none"
          >
            Lead Management
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