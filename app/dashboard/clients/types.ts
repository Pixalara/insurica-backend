// Customer type - matches customers table (Universal Customer ID)
export type Customer = {
  customer_id: string
  full_name: string
  mobile_number: string
  email: string | null
  dob: string | null
  address: string | null
  agent_id: string
  created_at: string
  updated_at: string
  policies?: Policy[]
}

// Policy type - matches policies table
export type Policy = {
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
  customer?: Customer
}

// Combined view for displaying policy with customer info
export type PolicyWithCustomer = Policy & {
  customer: {
    full_name: string
    mobile_number: string
    email: string | null
  }
}

// Client type - backward compatible alias that includes mapped fields
// Used by components and pages that expect the old format
export type Client = {
  id: string
  policy_id: string
  customer_id: string
  name: string
  phone: string
  email: string
  policy_number: string
  category: 'General' | 'Health' | 'Life'
  product_name: string | null
  insurance_company: string
  sum_insured: number | null
  premium_amount: number | null
  start_date: string | null
  end_date: string | null
  status: 'Active' | 'Expired' | 'Cancelled'
  product_type?: string | null
  vehicle_number?: string | null
  created_at: string
  remarks?: string | null
  companies?: { name: string }[]
  customer?: {
    customer_id: string
    full_name: string
    mobile_number: string
    email: string | null
    address?: string | null
    dob?: string | null
  }
}
