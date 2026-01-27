import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Insurica Server Client
 * This client is used in Server Components, Server Actions, and API Routes.
 * It handles session persistence via cookies.
 */
export async function createClient() {
  // In Next.js 15 and 16, cookies() is a Promise and MUST be awaited.
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Setting cookies from a Server Component can be ignored 
            // as the middleware handles session refreshing.
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // This error is expected when calling set/remove from Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // This error is expected when calling set/remove from Server Components
          }
        },
      },
    }
  )
}