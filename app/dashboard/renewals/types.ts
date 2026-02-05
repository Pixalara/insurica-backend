export interface Renewal {
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
  status: string
  days_to_expiry: number
}

export type RenewalFilter = '30' | '60' | '90' | 'overdue'
