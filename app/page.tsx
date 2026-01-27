import { redirect } from 'next/navigation'

/**
 * Insurica Root Page
 * * This is the entry point for admin.insurica.in. 
 * To ensure a professional and premium agent experience, 
 * we immediately redirect all traffic to the login portal.
 * * Brand: Insurica
 * Tagline: Digital Experiences. Engineered to Scale.
 * Powered by: Pixalara
 */
export default function RootPage() {
  // Redirects the user from http://localhost:3000/ to http://localhost:3000/login
  redirect('/login')
}