🛠 Insurica Project Setup & Installation Guide
1. Initial Repository Setup
If starting from a fresh clone of the Pixalara repository:

Bash
git clone https://github.com/Pixalara/insurica-backend.git
cd insurica-backend
2. Required Installation Commands
Run these commands to ensure all dependencies match the production environment:

Bash
# 1. Install core dependencies
npm install

# 2. Ensure Supabase SSR helpers are present
npm install @supabase/ssr @supabase/supabase-js

# 3. Initialize UI components (shadcn/ui)
npx shadcn-ui@latest init
# Settings: Style -> Default, Base Color -> Slate, CSS Variables -> Yes
📂 Folder & File Structure
Your project directory should follow this SaaS-grade structure. Each file serves a specific architectural purpose:

Plaintext
insurica-dashboard/
├── .env.local               # Private API keys (Git ignored)
├── package.json             # Locked dependency versions
├── src/
│   ├── middleware.ts        # Auth & Route protection (Security Guard)
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── login/           # Auth pages
│   │   └── dashboard/       # Main admin application
│   │       ├── layout.tsx   # Sidebar & Navigation wrapper
│   │       ├── page.tsx     # Overview (KPIs)
│   │       ├── clients/     # Client management module
│   │       └── policies/    # Policy tracking module
│   ├── components/          # Reusable UI (shadcn, forms, cards)
│   └── utils/
│       └── supabase/
│           ├── client.ts    # Client-side Supabase utility
│           └── server.ts    # Async Server-side Supabase utility
⚙️ Core Configuration Files
A. Environment Variables (.env.local)
Create this file in the root. Use your Pixalara Supabase project reference:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=https://qlaslhiuacihctyhfzuk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-shared-anon-key-here
B. Async Server Client (src/utils/supabase/server.ts)
This file is critical for Next.js 16 as it awaits the cookie store:

TypeScript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies() // Required async call for Next.js 16
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }) } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }) } catch (error) {}
        },
      },
    }
  )
}
C. The Security Guard (src/middleware.ts)
Place this in the src root to protect all /dashboard routes:

TypeScript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
🚀 Deployment & Running
To run locally:

Bash
npm run dev
To deploy to Vercel: Push your changes to GitHub. Vercel will automatically build and deploy the admin.insurica.in project.
