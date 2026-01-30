export interface HealthPolicy {
  id: string
  policyNumber: string
  holderName: string
  contactNumber: string
  email: string
  planType: string
  sumInsured: number
  premiumAmount: number
  startDate: string // ISO date string
  endDate: string // ISO date string
  renewalDate: string // ISO date string
  membersCovered: number
  status: string
  insurer: string
}

