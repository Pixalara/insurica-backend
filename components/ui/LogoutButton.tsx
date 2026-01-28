'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  
  // Initialize client with your project credentials
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button 
      onClick={handleLogout}
      className="w-full text-left p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium flex items-center gap-3 group"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" height="18" 
        viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" strokeWidth="2" 
        strokeLinecap="round" strokeLinejoin="round"
        className="group-hover:translate-x-1 transition-transform"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Sign Out
    </button>
  )
}