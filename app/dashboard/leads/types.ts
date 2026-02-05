export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  interest: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
  source: string
  notes?: string
  created_at: string
  updated_at?: string
}

export interface LeadFormData {
  name: string
  email: string
  phone: string
  interest: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'
  source: string
  notes?: string
}
