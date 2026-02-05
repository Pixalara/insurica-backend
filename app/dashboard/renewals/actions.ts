'use server'

import { createClient } from '@/utils/supabase/server'
import { differenceInDays } from 'date-fns'
import type { Renewal, RenewalFilter } from './types'

export async function getRenewals(filter: RenewalFilter = '30') {
  const supabase = await createClient()
  const now = new Date()

  // Fetch all active policies
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('status', 'Active')
    .order('end_date', { ascending: true })

  if (error) {
    console.error('Error fetching renewals:', error)
    return { renewals: [], stats: { upcoming30: 0, upcoming60: 0, upcoming90: 0, overdue: 0 } }
  }

  // Calculate days to expiry and filter
  const renewalsWithDays = (data || []).map((policy: any) => {
    const endDate = new Date(policy.end_date)
    const daysToExpiry = differenceInDays(endDate, now)
    return {
      ...policy,
      days_to_expiry: daysToExpiry,
    } as Renewal
  })

  // Calculate stats
  const stats = {
    upcoming30: renewalsWithDays.filter(r => r.days_to_expiry >= 0 && r.days_to_expiry <= 30).length,
    upcoming60: renewalsWithDays.filter(r => r.days_to_expiry >= 0 && r.days_to_expiry <= 60).length,
    upcoming90: renewalsWithDays.filter(r => r.days_to_expiry >= 0 && r.days_to_expiry <= 90).length,
    overdue: renewalsWithDays.filter(r => r.days_to_expiry < 0).length,
  }

  // Apply filter
  let filteredRenewals: Renewal[] = []
  
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
    .from('clients')
    .update({
      start_date: new Date().toISOString().split('T')[0],
      end_date: newEndDate,
      updated_at: new Date().toISOString(),
    })
    .eq('id', policyId)
    .select()
    .single()

  if (error) {
    console.error('Error renewing policy:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
