export interface Renewal {
  policy_id: string
  customer_id: string
  policy_number: string | null
  product: string | null
  insurance_company: string
  policy_type: 'General' | 'Health' | 'Life'
  premium: number | null
  start_date: string | null
  end_date: string | null
  status: string
  days_to_expiry: number
  // Joined customer data
  customer?: {
    full_name: string
    mobile_number: string
    email: string | null
  }
}

export type RenewalFilter = 'this_month' | 'next_month' | 'expired' | 'lost'
