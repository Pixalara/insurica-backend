
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Lead } from './types'

export async function getLeads({
  query,
  status,
  page = 1,
  limit = 10,
}: {
  query?: string
  status?: string
  page?: number
  limit?: number
}) {
  const supabase = await createClient()

  let dbQuery = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
  }

  if (status && status !== 'All') {
    dbQuery = dbQuery.eq('status', status)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error } = await dbQuery.range(from, to)

  if (error) {
    console.error('Error fetching leads:', error)
    throw new Error('Failed to fetch leads')
  }

  return {
    leads: data as Lead[],
    totalCount: count || 0,
  }
}

export async function getLeadMetrics() {
  const supabase = await createClient()
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // Run in parallel for performance
  const [
    { count: totalLeads },
    { count: newLeads },
    { count: followUps },
    { count: closedDeals }
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'Follow Up'),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'Closed')
  ])

  return {
    totalLeads: totalLeads || 0,
    newLeadsThisMonth: newLeads || 0,
    followUpsDue: followUps || 0,
    dealsClosed: closedDeals || 0,
  }
}

export async function createLead(data: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('leads')
    .insert([data])

  if (error) {
    console.error('Error creating lead:', error)
    throw new Error('Failed to create lead')
  }

  revalidatePath('/dashboard/leads')
}

export async function updateLead(id: string, data: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('leads')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error updating lead:', error)
    throw new Error('Failed to update lead')
  }

  revalidatePath('/dashboard/leads')
}

export async function deleteLead(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting lead:', error)
    return { success: false, error: 'Failed to delete lead' }
  }

  revalidatePath('/dashboard/leads')
  return { success: true }
}
