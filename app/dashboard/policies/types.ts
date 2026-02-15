// Policy type matching the policies table with customer join
export interface Policy {
  policy_id: string
  customer_id: string
  policy_number: string | null
  product: string | null
  insurance_company: string
  policy_type: 'General' | 'Health' | 'Life'
  sum_insured: number | null
  start_date: string | null
  end_date: string | null
  premium: number | null
  claim_status: 'open' | 'closed' | null
  claim_settled_amount: number | null
  remarks: string | null
  status: 'Active' | 'Expired' | 'Cancelled'
  product_type?: string | null
  vehicle_number?: string | null
  created_at: string
  updated_at: string
  // Joined customer data
  customer?: {
    customer_id: string
    full_name: string
    mobile_number: string
    email: string | null
  }
}

export interface PolicyFormData {
  customer_id: string
  policy_number?: string
  product?: string
  insurance_company: string
  policy_type: 'General' | 'Health' | 'Life'
  sum_insured?: number
  start_date?: string
  end_date?: string
  premium?: number
  remarks?: string
  status: 'Active' | 'Expired' | 'Cancelled'
  
  // New fields
  product_type?: string | null
  vehicle_number?: string | null
}
