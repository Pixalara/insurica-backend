export type Client = {
  id: string
  created_at: string
  name: string 
  email: string | null
  phone: string | null
  policy_number: string
  company_id: string
  category: 'General' | 'Health' | 'Life'
  product_name: string | null
  sum_insured: number | null
  premium_amount: number | null
  start_date: string | null
  end_date: string | null
  policy_duration: string | null
  notes: string | null
  status: 'Active' | 'Inactive' | 'Expired'
  agent_id: string
  companies?: {
    name: string
    type?: string
  }[] | { name: string, type?: string }
}
