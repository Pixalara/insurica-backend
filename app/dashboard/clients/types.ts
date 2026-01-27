export type Client = {
  id: string
  created_at: string
  name: string
  phone: string | null
  email: string | null
  // We'll mock this for now or map it from existing data if available
  // In a real app, this would change based on database schema
  registrationStatus?: 'Registered' | 'Not Registered' 
}
