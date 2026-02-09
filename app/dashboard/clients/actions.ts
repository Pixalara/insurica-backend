'use server'

import { createClient as createSupabaseClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Customer, Policy, PolicyWithCustomer } from './types'

// ============================================
// CUSTOMER OPERATIONS
// ============================================

export async function getCustomers({
  query = '',
  page = 1,
  limit = 10,
}: {
  query?: string
  page?: number
  limit?: number
}) {
  const supabase = await createSupabaseClient()
  const offset = (page - 1) * limit

  let dbQuery = supabase
    .from('customers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (query) {
    dbQuery = dbQuery.or(`full_name.ilike.%${query}%,email.ilike.%${query}%,mobile_number.ilike.%${query}%`)
  }

  const { data: customers, error, count } = await dbQuery

  if (error) {
    console.error('Error fetching customers:', error)
    throw new Error('Failed to fetch customers')
  }

  return {
    customers: customers || [],
    totalPages: count ? Math.ceil(count / limit) : 0,
    currentPage: page,
    totalCount: count
  }
}

export async function getCustomer(id: string) {
  const supabase = await createSupabaseClient()
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('customer_id', id)
    .single()

  if (error) {
    console.error('Error fetching customer:', error)
    return null
  }

  return data as Customer
}

/**
 * Find customer by phone number for Universal Customer ID lookup
 */
export async function findCustomerByPhone(phone: string) {
  const supabase = await createSupabaseClient()
  
  // Get current user (agent)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { found: false, customer: null, error: 'Unauthorized' }
  }

  // Clean phone number (remove spaces, dashes, etc.)
  const cleanPhone = phone.replace(/[\s\-()]/g, '')
  
  // Check if customer already exists for this agent
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('agent_id', user.id)
    .or(`mobile_number.eq."${phone}",mobile_number.eq."${cleanPhone}"`)
    .maybeSingle()

  if (error) {
    console.error('Error searching customer by phone:', error)
    return { found: false, customer: null, error: error.message }
  }

  if (!data) {
    return { found: false, customer: null }
  }

  // Transform to format expected by frontend components
  const customer = {
    ...data,
    id: data.customer_id,
    name: data.full_name,
    phone: data.mobile_number
  }

  return { found: true, customer }
}

export async function createCustomer(formData: {
  full_name: string
  mobile_number: string
  email?: string
  dob?: string
  address?: string
}) {
  const supabase = await createSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Ensure user has a profile
  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
  
  if (!profile) {
    const { error: createProfileError } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: user.user_metadata?.full_name || 'Agent',
      role: 'agent'
    })
    if (createProfileError) {
      throw new Error(`Failed to create agent profile: ${createProfileError.message}`)
    }
  }

  const { data, error } = await supabase
    .from('customers')
    .insert({
      full_name: formData.full_name,
      mobile_number: formData.mobile_number,
      email: formData.email || null,
      dob: formData.dob || null,
      address: formData.address || null,
      agent_id: user.id
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating customer:', error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/clients')
  return data as Customer
}

export async function updateCustomer(id: string, formData: {
  full_name?: string
  mobile_number?: string
  email?: string
  dob?: string
  address?: string
}) {
  const supabase = await createSupabaseClient()

  const { error } = await supabase
    .from('customers')
    .update({
      ...formData,
      updated_at: new Date().toISOString()
    })
    .eq('customer_id', id)

  if (error) {
    console.error('Error updating customer:', error)
    throw new Error('Failed to update customer')
  }

  revalidatePath('/dashboard/clients')
  revalidatePath(`/dashboard/clients/${id}/edit`)
}

export async function deleteCustomer(id: string) {
  const supabase = await createSupabaseClient()
  
  // First delete all policies for this customer
  await supabase
    .from('policies')
    .delete()
    .eq('customer_id', id)

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('customer_id', id)

  if (error) {
    console.error('Error deleting customer:', error)
    throw new Error(`Failed to delete customer: ${error.message}`)
  }

  revalidatePath('/dashboard/clients')
}

// ============================================
// POLICY OPERATIONS (for use by clients module)
// ============================================

export async function getPoliciesWithCustomers({
  query = '',
  status = 'All',
  policyType = 'All',
  page = 1,
  limit = 10,
}: {
  query?: string
  status?: string
  policyType?: string
  page?: number
  limit?: number
}) {
  const supabase = await createSupabaseClient()
  const offset = (page - 1) * limit

  // If there's a search query, we need to search both policies AND customers
  // Since Supabase doesn't support filtering on joined columns directly,
  // we first find matching customer IDs, then include those in the policy query
  let matchingCustomerIds: string[] = []
  
  if (query) {
    // Find customers matching the search query
    const { data: matchingCustomers } = await supabase
      .from('customers')
      .select('customer_id')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,mobile_number.ilike.%${query}%`)
    
    matchingCustomerIds = matchingCustomers?.map(c => c.customer_id) || []
  }

  let dbQuery = supabase
    .from('policies')
    .select(`
      *,
      customer:customers(customer_id, full_name, mobile_number, email)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (query) {
    // Build the OR condition to search in policy fields AND matching customer IDs
    let orConditions = `policy_number.ilike.%${query}%,product.ilike.%${query}%,insurance_company.ilike.%${query}%`
    
    if (matchingCustomerIds.length > 0) {
      // Add condition to include policies for matching customers
      orConditions += `,customer_id.in.(${matchingCustomerIds.join(',')})`
    }
    
    dbQuery = dbQuery.or(orConditions)
  }

  if (status !== 'All') {
    dbQuery = dbQuery.eq('status', status)
  }

  if (policyType !== 'All') {
    const typeMap: Record<string, string> = {
      'Life Insurance': 'Life',
      'General Insurance': 'General',
      'Health Insurance': 'Health'
    }
    const mappedType = typeMap[policyType] || policyType
    if (['Life', 'General', 'Health'].includes(mappedType)) {
      dbQuery = dbQuery.eq('policy_type', mappedType)
    }
  }

  const { data: policies, error, count } = await dbQuery

  if (error) {
    console.error('Error fetching policies:', error)
    throw new Error('Failed to fetch policies')
  }

  return {
    policies: policies || [],
    totalPages: count ? Math.ceil(count / limit) : 0,
    currentPage: page,
    totalCount: count
  }
}

export async function createPolicy(formData: {
  customer_id: string
  policy_number?: string
  product?: string
  insurance_company: string
  policy_type: 'General' | 'Health' | 'Life'
  sum_insured?: number
  start_date?: string
  end_date?: string
  premium?: number
  remarks?: string
  status?: 'Active' | 'Expired' | 'Cancelled'
}) {
  const supabase = await createSupabaseClient()

  const { data, error } = await supabase
    .from('policies')
    .insert({
      customer_id: formData.customer_id,
      policy_number: formData.policy_number || null,
      product: formData.product || null,
      insurance_company: formData.insurance_company,
      policy_type: formData.policy_type,
      sum_insured: formData.sum_insured || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      premium: formData.premium || null,
      remarks: formData.remarks || null,
      status: formData.status || 'Active'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating policy:', error)
    throw new Error(error.message)
  }

  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard/policies')
  return data as Policy
}

export async function updatePolicy(id: string, formData: {
  policy_number?: string
  product?: string
  insurance_company?: string
  policy_type?: 'General' | 'Health' | 'Life'
  sum_insured?: number
  start_date?: string
  end_date?: string
  premium?: number
  remarks?: string
  status?: 'Active' | 'Expired' | 'Cancelled'
}) {
  const supabase = await createSupabaseClient()

  const { error } = await supabase
    .from('policies')
    .update({
      ...formData,
      updated_at: new Date().toISOString()
    })
    .eq('policy_id', id)

  if (error) {
    console.error('Error updating policy:', error)
    throw new Error('Failed to update policy')
  }

  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard/policies')
}

export async function deletePolicy(id: string) {
  const supabase = await createSupabaseClient()

  const { error } = await supabase
    .from('policies')
    .delete()
    .eq('policy_id', id)

  if (error) {
    console.error('Error deleting policy:', error)
    throw new Error(`Failed to delete policy: ${error.message}`)
  }

  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard/policies')
  revalidatePath('/dashboard/insurance/general')
  revalidatePath('/dashboard/insurance/health')
  revalidatePath('/dashboard/insurance/life')
}

// ============================================
// METRICS & UTILITIES
// ============================================

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

  // Total unique customers
  const { count: totalCustomers } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })

  // Total policies
  const { count: totalPolicies } = await supabase
    .from('policies')
    .select('*', { count: 'exact', head: true })

  // Active Policies
  const { count: activePolicies } = await supabase
    .from('policies')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Active')

  // Pending Renewals (Expiring within 30 days)
  const today = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(today.getDate() + 30)

  const { count: pendingRenewals } = await supabase
    .from('policies')
    .select('*', { count: 'exact', head: true })
    .gte('end_date', today.toISOString())
    .lte('end_date', thirtyDaysFromNow.toISOString())

  // Total Premium (Sum of all premiums)
  const { data: premiumData } = await supabase
    .from('policies')
    .select('premium')
  
  const totalPremium = premiumData?.reduce((sum, policy) => {
    return sum + (policy.premium || 0)
  }, 0) || 0

  return {
    totalClients: totalCustomers || 0,
    totalPolicies: totalPolicies || 0,
    activePolicies: activePolicies || 0,
    pendingRenewals: pendingRenewals || 0,
    totalPremium
  }
}

// ============================================
// BACKWARD COMPATIBILITY ALIASES
// ============================================

// These functions maintain backward compatibility during transition
export async function getClients(params: {
  query?: string
  status?: string
  product?: string
  page?: number
  limit?: number
}) {
  const result = await getPoliciesWithCustomers({
    query: params.query,
    status: params.status,
    policyType: params.product,
    page: params.page,
    limit: params.limit
  })
  
  // Transform to old Client format for backward compatibility
  const clients = result.policies.map((p: PolicyWithCustomer) => ({
    id: p.policy_id,
    policy_id: p.policy_id,
    customer_id: p.customer_id,
    name: p.customer?.full_name || 'Unknown',
    phone: p.customer?.mobile_number || '',
    email: p.customer?.email || '',
    policy_number: p.policy_number || '',
    category: p.policy_type,
    product_name: p.product,
    insurance_company: p.insurance_company,
    sum_insured: p.sum_insured,
    premium_amount: p.premium,
    start_date: p.start_date,
    end_date: p.end_date,
    status: p.status,
    created_at: p.created_at,
    companies: [{ name: p.insurance_company }]
  }))

  return {
    clients,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    totalCount: result.totalCount
  }
}

export async function getClient(id: string) {
  const supabase = await createSupabaseClient()
  
  const { data, error } = await supabase
    .from('policies')
    .select(`
      *,
      customer:customers(customer_id, full_name, mobile_number, email, address, dob)
    `)
    .eq('policy_id', id)
    .single()

  if (error) {
    console.error('Error fetching policy:', error)
    return null
  }

  // Transform to old Client format
  return {
    id: data.policy_id,
    policy_id: data.policy_id,
    customer_id: data.customer_id,
    name: data.customer?.full_name || 'Unknown',
    phone: data.customer?.mobile_number || '',
    email: data.customer?.email || '',
    policy_number: data.policy_number || '',
    category: data.policy_type,
    product_name: data.product,
    insurance_company: data.insurance_company,
    sum_insured: data.sum_insured,
    premium_amount: data.premium,
    start_date: data.start_date,
    end_date: data.end_date,
    status: data.status,
    remarks: data.remarks,
    created_at: data.created_at,
    // Customer data for forms
    customer: data.customer
  }
}

export async function createClient(formData: {
  customer_id?: string
  name: string
  phone?: string | null
  email?: string | null
  policy_number?: string
  product_name?: string | null
  insurance_company?: string
  category?: 'General' | 'Health' | 'Life'
  sum_insured?: string | number
  start_date?: string | null
  end_date?: string | null
  premium_amount?: string | number
  notes?: string
  remarks?: string
  status?: string
}) {
  const supabase = await createSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Ensure user has a profile
  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
  
  if (!profile) {
    await supabase.from('profiles').insert({
      id: user.id,
      full_name: user.user_metadata?.full_name || 'Agent',
      role: 'agent'
    })
  }

  // Check if customer exists by phone
  let customerId = formData.customer_id
  
  if (!customerId && formData.phone) {
    const { found, customer } = await findCustomerByPhone(formData.phone)
    if (found && customer) {
      customerId = customer.customer_id
    }
  }

  // Create customer if not exists
  if (!customerId) {
    const { data: newCustomer, error: customerError } = await supabase
      .from('customers')
      .insert({
        full_name: formData.name,
        mobile_number: formData.phone || '',
        email: formData.email || null,
        agent_id: user.id
      })
      .select()
      .single()

    if (customerError) {
      throw new Error(`Failed to create customer: ${customerError.message}`)
    }
    customerId = newCustomer.customer_id
  }

  // Create policy
  const { error: policyError } = await supabase
    .from('policies')
    .insert({
      customer_id: customerId as string,
      policy_number: formData.policy_number || null,
      product: formData.product_name || null,
      insurance_company: formData.insurance_company || 'Unknown',
      policy_type: formData.category || 'General',
      sum_insured: formData.sum_insured ? parseFloat(formData.sum_insured.toString()) : null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      premium: formData.premium_amount ? parseFloat(formData.premium_amount.toString()) : null,
      remarks: formData.notes || formData.remarks || null,
      status: formData.status || 'Active'
    })

  if (policyError) {
    throw new Error(policyError.message)
  }

  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard/policies')
}

export async function updateClient(id: string, formData: {
  name: string
  phone?: string | null
  email?: string | null
  policy_number?: string
  product_name?: string | null
  insurance_company?: string
  category?: 'General' | 'Health' | 'Life'
  sum_insured?: string | number
  start_date?: string | null
  end_date?: string | null
  premium_amount?: string | number
  notes?: string
  remarks?: string
  status?: string
}) {
  const supabase = await createSupabaseClient()

  // Get current policy to find customer_id
  const { data: currentPolicy } = await supabase
    .from('policies')
    .select('customer_id')
    .eq('policy_id', id)
    .single()

  if (currentPolicy?.customer_id) {
    // Update customer info
    await supabase
      .from('customers')
      .update({
        full_name: formData.name,
        mobile_number: formData.phone || '',
        email: formData.email || null,
        updated_at: new Date().toISOString()
      })
      .eq('customer_id', currentPolicy.customer_id)
  }

  // Update policy
  const { error } = await supabase
    .from('policies')
    .update({
      policy_number: formData.policy_number || null,
      product: formData.product_name || null,
      insurance_company: formData.insurance_company || 'Unknown',
      policy_type: formData.category || 'General',
      sum_insured: formData.sum_insured ? parseFloat(formData.sum_insured.toString()) : null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      premium: formData.premium_amount ? parseFloat(formData.premium_amount.toString()) : null,
      remarks: formData.notes || formData.remarks || null,
      status: formData.status || 'Active',
      updated_at: new Date().toISOString()
    })
    .eq('policy_id', id)

  if (error) {
    throw new Error('Failed to update policy')
  }

  revalidatePath('/dashboard/clients')
  revalidatePath('/dashboard/policies')
  revalidatePath(`/dashboard/clients/${id}/edit`)
}

export async function deleteClient(id: string) {
  return deletePolicy(id)
}
