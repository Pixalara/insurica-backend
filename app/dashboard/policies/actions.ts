'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Policy, PolicyFormData } from './types'

export async function getPolicies(filters?: {
  query?: string
  category?: string
  status?: string
  page?: number
}) {
  const supabase = await createClient()
  const page = filters?.page || 1
  const itemsPerPage = 50

  let query = supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)

  // Apply filters
  if (filters?.query) {
    query = query.or(`name.ilike.%${filters.query}%,policy_number.ilike.%${filters.query}%,email.ilike.%${filters.query}%`)
  }

  if (filters?.category && filters.category !== 'All') {
    query = query.ilike('category', `%${filters.category}%`)
  }

  if (filters?.status && filters.status !== 'All') {
    query = query.eq('status', filters.status)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching policies:', error)
    return { policies: [], totalCount: 0 }
  }

  return {
    policies: (data as Policy[]) || [],
    totalCount: count || 0,
  }
}

export async function getPolicyById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching policy:', error)
    return null
  }

  return data as Policy
}

export async function createPolicy(formData: PolicyFormData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('clients')
    .insert([formData])
    .select()
    .single()

  if (error) {
    console.error('Error creating policy:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/policies')
  return { success: true, data }
}

export async function updatePolicy(id: string, formData: PolicyFormData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('clients')
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating policy:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/policies')
  return { success: true, data }
}

export async function deletePolicy(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting policy:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/policies')
  return { success: true }
}

export async function getPolicyStats() {
  const supabase = await createClient()

  const { data: policies, error } = await supabase
    .from('clients')
    .select('*')

  if (error) {
    console.error('Error fetching policy stats:', error)
    return {
      total: 0,
      active: 0,
      expired: 0,
      cancelled: 0,
    }
  }

  return {
    total: policies.length,
    active: policies.filter((p) => p.status === 'Active').length,
    expired: policies.filter((p) => p.status === 'Expired').length,
    cancelled: policies.filter((p) => p.status === 'Cancelled').length,
  }
}
