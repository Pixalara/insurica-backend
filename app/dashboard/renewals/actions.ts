'use server'

import { createClient } from '@/utils/supabase/server'
import { differenceInDays } from 'date-fns'
import type { Renewal, RenewalFilter } from './types'

export async function getRenewals(filter: RenewalFilter = 'this_month') {
  const supabase = await createClient()
  const now = new Date()
  
  // NOTE: For "Lost", we might need to check 'Cancelled' status or 'Expired' > 90 days.
  // For now, we will fetch 'Active' and 'Expired' and 'Cancelled' to handle all.
  const { data, error } = await supabase
    .from('policies')
    .select(`
      *,
      customer:customers(full_name, mobile_number, email)
    `)
    .order('end_date', { ascending: true })

  if (error) {
    console.error('Error fetching renewals:', error)
    return { renewals: [], stats: { this_month: 0, next_month: 0, expired: 0, lost: 0 } }
  }

  const renewalsWithDays = (data || []).map((policy) => {
    const endDate = new Date(policy.end_date)
    const daysToExpiry = differenceInDays(endDate, now)
    return {
      ...policy,
      days_to_expiry: daysToExpiry,
      customer: policy.customer,
      // Legacy fields
      name: policy.customer?.full_name || 'Unknown',
      email: policy.customer?.email || '',
      phone: policy.customer?.mobile_number || '',
      category: policy.policy_type,
      insurer: policy.insurance_company,
      premium_amount: policy.premium
    } as Renewal & { name: string; email: string; phone: string; category: string; insurer: string; premium_amount: number }
  })

  // Calculate stats
  // "This Month": Active/Expired policies expiring within next 30 days (or overdue by small amount?)
  // Let's define:
  // This Month: 0 to 30 days
  // Next Month: 31 to 60 days
  // Expired: < 0 days (and Status not Cancelled)
  // Lost: Status = Cancelled OR Expired > 90 days? Let's stick to Status=Cancelled for now.
  
  const stats = {
    this_month: renewalsWithDays.filter(r => r.status !== 'Cancelled' && r.days_to_expiry >= 0 && r.days_to_expiry <= 30).length,
    next_month: renewalsWithDays.filter(r => r.status !== 'Cancelled' && r.days_to_expiry > 30 && r.days_to_expiry <= 60).length,
    expired: renewalsWithDays.filter(r => r.status === 'Expired' || (r.status === 'Active' && r.days_to_expiry < 0)).length,
    lost: renewalsWithDays.filter(r => r.status === 'Cancelled').length,
  }

  let filteredRenewals: typeof renewalsWithDays = []

  switch (filter) {
    case 'this_month':
      filteredRenewals = renewalsWithDays.filter(r => r.status !== 'Cancelled' && r.days_to_expiry >= 0 && r.days_to_expiry <= 30)
      break
    case 'next_month':
      filteredRenewals = renewalsWithDays.filter(r => r.status !== 'Cancelled' && r.days_to_expiry > 30 && r.days_to_expiry <= 60)
      break
    case 'expired':
      filteredRenewals = renewalsWithDays.filter(r => r.status === 'Expired' || (r.status === 'Active' && r.days_to_expiry < 0))
      break
    case 'lost':
      filteredRenewals = renewalsWithDays.filter(r => r.status === 'Cancelled')
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
