export interface GeneralPolicy {
  id: string  // Alias for policy_id for backward compatibility
  policy_id: string
  customer_id: string
  policyNumber: string
  holderName: string
  contactNumber: string
  email: string
  type: string
  insurerName: string
  startDate: string // ISO date string
  endDate: string // ISO date string
  amountPaid: number
  sumInsured: number
  status: 'Active' | 'Expired' | 'Cancelled'
}
