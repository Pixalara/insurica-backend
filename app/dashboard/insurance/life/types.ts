export interface LifePolicy {
  id: string  // Alias for policy_id for backward compatibility
  policy_id: string
  customer_id: string
  policyNumber: string
  holderName: string
  contactNumber: string
  email: string
  planType: string
  sumAssured: number
  premiumAmount: number
  premiumFrequency: string
  startDate: string // ISO date string
  maturityDate: string // ISO date string
  nextDueDate: string // ISO date string
  nominee: string
  status: string
  insurer: string
}
