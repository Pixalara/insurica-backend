export interface Product {
  id: string
  name: string
  product_category: 'General' | 'Health' | 'Life'
  insurer: string
  description?: string
  pdf_url?: string
  pdf_filename?: string
  agent_id?: string
  created_at: string
  updated_at?: string
}

export interface ProductFormData {
  name: string
  product_category: 'General' | 'Health' | 'Life'
  insurer: string
  description?: string
  pdf_url?: string | null
  pdf_filename?: string | null
}
