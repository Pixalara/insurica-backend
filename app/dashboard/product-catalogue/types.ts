export interface Product {
  id: string
  name: string
  category: 'General' | 'Health' | 'Life'
  insurer: string
  coverage_amount?: number
  premium_range_min?: number
  premium_range_max?: number
  features?: string[]
  description?: string
  status: 'Active' | 'Inactive'
  pdf_url?: string
  pdf_filename?: string
  created_at: string
  updated_at?: string
}

export interface ProductFormData {
  name: string
  category: 'General' | 'Health' | 'Life'
  insurer: string
  coverage_amount?: number
  premium_range_min?: number
  premium_range_max?: number
  features?: string
  description?: string
  status: 'Active' | 'Inactive'
  pdf_url?: string
  pdf_filename?: string
}
