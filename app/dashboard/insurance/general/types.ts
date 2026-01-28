export interface GeneralPolicy {
  id: string
  policyNumber: string
  holderName: string
  contactNumber: string
  email: string
  type: 'Health' | 'Motor' | 'Travel' | 'Home' | 'Fire' | 'Other'
  startDate: string // ISO date string
  endDate: string // ISO date string
  amountPaid: number
  sumInsured: number
  status: 'Active' | 'Expired' | 'Pending'
}
