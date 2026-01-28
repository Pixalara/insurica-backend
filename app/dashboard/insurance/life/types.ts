export interface LifePolicy {
  id: string
  policyNumber: string
  holderName: string
  contactNumber: string
  email: string
  planType: 'Term Life' | 'Whole Life' | 'Endowment' | 'ULIP'
  sumAssured: number
  premiumAmount: number
  premiumFrequency: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly'
  startDate: string // ISO date string
  maturityDate: string // ISO date string
  nextDueDate: string // ISO date string
  nominee: string
  status: 'Active' | 'Lapsed' | 'Grace Period' | 'Matured'
  insurer: string
}
