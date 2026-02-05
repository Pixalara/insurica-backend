'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Lead, LeadFormData } from './types'

export async function getLeads(filters?: {
  query?: string
  status?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  // Apply filters
  if (filters?.query) {
    query = query.or(`name.ilike.%${filters.query}%,email.ilike.%${filters.query}%,phone.ilike.%${filters.query}%`)
  }

  if (filters?.status && filters.status !== 'All') {
    query = query.eq('status', filters.status)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching leads:', error)
    return { leads: [], totalCount: 0 }
  }

  return {
    leads: (data as Lead[]) || [],
    totalCount: count || 0,
  }
}

export async function getLeadById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching lead:', error)
    return null
  }

  return data as Lead
}

export async function createLead(formData: LeadFormData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leads')
    .insert([formData])
    .select()
    .single()

  if (error) {
    console.error('Error creating lead:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/leads')
  return { success: true, data }
}

export async function updateLead(id: string, formData: LeadFormData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('leads')
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating lead:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/leads')
  return { success: true, data }
}

export async function deleteLead(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting lead:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/leads')
  return { success: true }
}

export async function getLeadStats() {
  const supabase = await createClient()

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')

  if (error) {
    console.error('Error fetching lead stats:', error)
    return {
      total: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      converted: 0,
    }
  }

  return {
    total: leads.length,
    new: leads.filter((l) => l.status === 'New').length,
    contacted: leads.filter((l) => l.status === 'Contacted').length,
    qualified: leads.filter((l) => l.status === 'Qualified').length,
    converted: leads.filter((l) => l.status === 'Converted').length,
  }
}
