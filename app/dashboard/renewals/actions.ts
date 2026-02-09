'use server'

import { createClient } from '@/utils/supabase/server'
import { differenceInDays } from 'date-fns'
import type { Renewal, RenewalFilter } from './types'

export async function getRenewals(filter: RenewalFilter = '30') {
  const supabase = await createClient()
  const now = new Date()

  // Fetch all active policies with customer data
  const { data, error } = await supabase
    .from('policies')
    .select(`
      *,
      customer:customers(full_name, mobile_number, email)
    `)
    .eq('status', 'Active')
    .order('end_date', { ascending: true })

  if (error) {
    console.error('Error fetching renewals:', error)
    return { renewals: [], stats: { upcoming30: 0, upcoming60: 0, upcoming90: 0, overdue: 0 } }
  }

  // Calculate days to expiry and filter
  const renewalsWithDays = (data || []).map((policy) => {
    const endDate = new Date(policy.end_date)
    const daysToExpiry = differenceInDays(endDate, now)
    return {
      policy_id: policy.policy_id,
      customer_id: policy.customer_id,
      policy_number: policy.policy_number,
      product: policy.product,
      insurance_company: policy.insurance_company,
      policy_type: policy.policy_type,
      premium: policy.premium,
      start_date: policy.start_date,
      end_date: policy.end_date,
      status: policy.status,
      days_to_expiry: daysToExpiry,
      customer: policy.customer,
      // Legacy fields for backward compatibility
      name: policy.customer?.full_name || 'Unknown',
      email: policy.customer?.email || '',
      phone: policy.customer?.mobile_number || '',
      category: policy.policy_type,
      insurer: policy.insurance_company,
      premium_amount: policy.premium
    } as Renewal & { name: string; email: string; phone: string; category: string; insurer: string; premium_amount: number }
  })

  // Calculate stats
  const stats = {
    upcoming30: renewalsWithDays.filter(r => r.days_to_expiry >= 0 && r.days_to_expiry <= 30).length,
    upcoming60: renewalsWithDays.filter(r => r.days_to_expiry >= 0 && r.days_to_expiry <= 60).length,
    upcoming90: renewalsWithDays.filter(r => r.days_to_expiry >= 0 && r.days_to_expiry <= 90).length,
    overdue: renewalsWithDays.filter(r => r.days_to_expiry < 0).length,
  }

  // Apply filter
  let filteredRenewals: typeof renewalsWithDays = []
  
  switch (filter) {
    case '30':
      filteredRenewals = renewalsWithDays.filter(r => r.days_to_expiry >= 0 && r.days_to_expiry <= 30)
      break
    case '60':
      filteredRenewals = renewalsWithDays.filter(r => r.days_to_expiry >= 0 && r.days_to_expiry <= 60)
      break
    case '90':
      filteredRenewals = renewalsWithDays.filter(r => r.days_to_expiry >= 0 && r.days_to_expiry <= 90)
      break
    case 'overdue':
      filteredRenewals = renewalsWithDays.filter(r => r.days_to_expiry < 0)
      break
    default:
      filteredRenewals = renewalsWithDays.filter(r => r.days_to_expiry >= 0 && r.days_to_expiry <= 30)
  }

  return {
    renewals: filteredRenewals,
    stats,
  }
}

export async function markAsRenewed(policyId: string, newEndDate: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('policies')
    .update({
      start_date: new Date().toISOString().split('T')[0],
      end_date: newEndDate,
      updated_at: new Date().toISOString(),
    })
    .eq('policy_id', policyId)
    .select()
    .single()

  if (error) {
    console.error('Error renewing policy:', error)
    return { success: false, error: error.message }
  }

  // Revalidate all related pages for cross-page data sync
  const { revalidatePath } = await import('next/cache')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard/policies')
  revalidatePath('/dashboard/renewals')

  return { success: true, data }
}
