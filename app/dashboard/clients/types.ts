export type Client = {
  [x: string]: string | undefined
  id: string
  created_at: string
  name: string 
  phone: string 
  email: string
  // We'll mock this for now or map it from existing data if available
  // In a real app, this would change based on database schema
  registrationStatus?: 'Registered' | 'Not Registered'
  dob?: string
  gender?: 'Male' | 'Female' | 'Other'
  address?: string
  city?: string
  state?: string
  zip?: string
  notes?: string
  // Standard columns from DB
  policyStatus?: 'Active' | 'Inactive' | 'Expired'
  productType?: string
  insurer?: string // mapped from 'company' or specific column if needed
}
