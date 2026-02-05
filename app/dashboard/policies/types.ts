export interface Policy {
  id: string
  policy_number: string
  name: string
  email: string
  phone: string
  category: string
  insurer?: string
  premium_amount: number
  start_date: string
  end_date: string
  status: 'Active' | 'Expired' | 'Cancelled'
  sum_insured?: number
  vehicle_number?: string
  created_at: string
  updated_at?: string
}

export interface PolicyFormData {
  policy_number: string
  name: string
  email: string
  phone: string
  category: string
  insurer?: string
  premium_amount: number
  start_date: string
  end_date: string
  status: 'Active' | 'Expired' | 'Cancelled'
  sum_insured?: number
  vehicle_number?: string
}
