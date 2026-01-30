'use server'

import { createClient as createSupabaseClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getClients({
  query = '',
  status = 'All',
  product = 'All',
  page = 1,
  limit = 10,
}: {
  query?: string
  status?: string
  product?: string
  page?: number
  limit?: number
}) {
  const supabase = await createSupabaseClient()
  const offset = (page - 1) * limit

  let dbQuery = supabase
    .from('clients')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,email.ilike.%${query}%,policy_number.ilike.%${query}%`)
  }

  if (status !== 'All') {
    dbQuery = dbQuery.eq('status', status)
  }

  if (product !== 'All') {
    const categoryMap: Record<string, string> = {
      'Life Insurance': 'Life',
      'General Insurance': 'General',
      'Health Insurance': 'Health'
    }
    const category = categoryMap[product] || product
    if (['Life', 'General', 'Health'].includes(category)) {
        dbQuery = dbQuery.eq('category', category)
    } else {
        dbQuery = dbQuery.ilike('product_name', `%${product}%`)
    }
  }

  const { data: clients, error, count } = await dbQuery

  if (error) {
    console.error('Error fetching clients:', error)
    throw new Error('Failed to fetch clients')
  }

  // Manually fetch companies to avoid join errors
  let clientsWithCompanies = clients
  if (clients && clients.length > 0) {
      const companyIds = Array.from(new Set(clients.map((c: any) => c.company_id).filter(Boolean)))
      if (companyIds.length > 0) {
          const { data: companies } = await supabase
              .from('companies')
              .select('id, name')
              .in('id', companyIds)
          
          if (companies) {
              const companyMap = new Map(companies.map((c: any) => [c.id, c]))
              clientsWithCompanies = clients.map((client: any) => ({
                  ...client,
                  companies: client.company_id ? [companyMap.get(client.company_id) || { name: 'Unknown' }] : []
              }))
          }
      }
  }

  return {
    clients: clientsWithCompanies,
    totalPages: count ? Math.ceil(count / limit) : 0,
    currentPage: page,
    totalCount: count
  }
}

export async function getClient(id: string) {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching client:', error)
    return null
  }

  return data
}

export async function getCompanies(type?: 'General' | 'Health' | 'Life') {
  const supabase = await createSupabaseClient()
  let query = supabase.from('companies').select('id, name, type').order('name')

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching companies:', error)
    return []
  }

  return data
}

export async function getClientMetrics() {
  const supabase = await createSupabaseClient()

  // 1. Total Clients
  const { count: totalClients } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })

  // 2. Active Policies
  const { count: activePolicies } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Active')

  // 3. Pending Renewals (Expiring within 30 days)
  const today = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  // Assuming 'end_date' is the policy expiry date.
  // We want policies that are active (or generally) but expiring soon.
  // Usually pending renewal implies it hasn't expired yet but is close.
  const { count: pendingRenewals } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .gte('end_date', today.toISOString())
    .lte('end_date', thirtyDaysFromNow.toISOString())

  // 4. Total Premium (Sum of all premiums)
  const { data: premiumData } = await supabase
    .from('clients')
    .select('premium_amount')
  
  const totalPremium = premiumData?.reduce((sum, client) => {
    return sum + (client.premium_amount || 0)
  }, 0) || 0

  return {
    totalClients: totalClients || 0,
    activePolicies: activePolicies || 0,
    pendingRenewals: pendingRenewals || 0,
    totalPremium
  }
}

export async function createClient(formData: any) {
  const supabase = await createSupabaseClient()
  
  // Validate authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Ensure user has a profile (required for foreign key agent_id)
  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
  
  if (!profile) {
    console.log('Profile missing for user, attempting to create one...')
    const { error: createProfileError } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: user.user_metadata?.full_name || 'Agent',
      role: 'agent'
    })

    if (createProfileError) {
      console.error('Failed to create missing profile:', createProfileError)
      throw new Error(`Failed to create agent profile: ${createProfileError.message}`)
    }
  }

  const {
    name,
    email,
    phone,
    policy_number,
    category,
    company_id,
    product_name,
    sum_insured,
    premium_amount,
    start_date,
    end_date,
    policy_duration,
    notes,
    status
  } = formData

  const { error } = await supabase.from('clients').insert({
    name,
    email,
    phone,
    policy_number,
    category,
    company_id,
    product_name,
    sum_insured: sum_insured ? parseFloat(sum_insured) : null,
    premium_amount: premium_amount ? parseFloat(premium_amount) : null,
    start_date: start_date || null,
    end_date: end_date || null,
    policy_duration: policy_duration || null,
    notes: notes || null,
    status,
    agent_id: user.id
  })

  if (error) {
    console.error('Error creating client:', error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard/clients')
}

export async function updateClient(id: string, formData: any) {
  const supabase = await createSupabaseClient()
  
  const {
     name,
    email,
    phone,
    policy_number,
    category,
    company_id,
    product_name,
    sum_insured,
    premium_amount,
    start_date,
    end_date,
    policy_duration,
    notes,
    status
  } = formData

  const { error } = await supabase
    .from('clients')
    .update({
      name,
      email,
      phone,
      policy_number,
      category,
      company_id,
      product_name,
      sum_insured: sum_insured ? parseFloat(sum_insured) : null,
      premium_amount: premium_amount ? parseFloat(premium_amount) : null,
      start_date: start_date || null,
      end_date: end_date || null,
      policy_duration: policy_duration || null,
      notes: notes || null,
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating client:', error)
    throw new Error('Failed to update client')
  }

  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard/clients')
  revalidatePath(`/dashboard/clients/${id}/edit`)
}

export async function deleteClient(id: string) {
  const supabase = await createSupabaseClient()
  console.log('Attempting to delete client with ID:', id)
  
  // First check if the client exists
  const { data: existingClient, error: fetchError } = await supabase
    .from('clients')
    .select('id')
    .eq('id', id)
    .single()

  if (fetchError || !existingClient) {
      console.error('Client not found before delete:', fetchError)
      throw new Error('Client not found or access denied')
  }

  const { error, count } = await supabase
    .from('clients')
    .delete({ count: 'exact' })
    .eq('id', id)

  if (error) {
    console.error('Error deleting client:', error)
    throw new Error(`Failed to delete client: ${error.message}`)
  }

  if (count === 0) {
      throw new Error('Failed to delete client: Policy not found or access denied')
  }

  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard/insurance/general')
}
