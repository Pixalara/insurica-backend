'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClient()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else window.location.href = '/dashboard'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Insurica Admin</h1>
        <input 
          type="email" placeholder="Email" 
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" 
          className="w-full p-2 mb-6 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  )
}