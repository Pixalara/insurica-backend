'use server'

import { createClient as createSupabaseClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ==============================================
// CUSTOMERS API (Universal Customer ID)
// ==============================================

export interface Customer {
    customer_id: string
    full_name: string
    mobile_number: string
    email?: string
    dob?: string
    address?: string
    agent_id: string
    created_at: string
}

/**
 * Create or return existing customer
 * Rule: If customer exists (same mobile + agent), return existing
 * Otherwise create new customer
 */
export async function createOrGetCustomer(formData: {
    full_name: string
    mobile_number: string
    email?: string
    dob?: string
    address?: string
}) {
    const supabase = await createSupabaseClient()

    // Get current user (agent)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized: Must be logged in')
    }

    // Clean phone number
    const cleanMobile = formData.mobile_number.replace(/[\s\-()]/g, '')

    // Check if customer already exists for this agent
    const { data: existingCustomer, error: lookupError } = await supabase
        .from('customers')
        .select('*')
        .eq('mobile_number', cleanMobile)
        .eq('agent_id', user.id)
        .maybeSingle()

    if (lookupError) {
        console.error('Customer lookup error:', lookupError)
        throw new Error('Failed to lookup customer')
    }

    // If customer exists, return it (no duplicate creation)
    if (existingCustomer) {
        return { 
            success: true, 
            customer: existingCustomer as Customer,
            isNew: false,
            message: 'Existing customer found'
        }
    }

    // Create new customer
    const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({
            full_name: formData.full_name,
            mobile_number: cleanMobile,
            email: formData.email || null,
            dob: formData.dob || null,
            address: formData.address || null,
            agent_id: user.id
        })
        .select()
        .single()

    if (createError) {
        console.error('Customer creation error:', createError)
        throw new Error('Failed to create customer: ' + createError.message)
    }

    revalidatePath('/dashboard/clients')
    return { 
        success: true, 
        customer: newCustomer as Customer,
        isNew: true,
        message: 'New customer created'
    }
}

/**
 * Get customer by mobile number (for auto-detection & autofill)
 */
export async function getCustomerByMobile(mobile: string) {
    const supabase = await createSupabaseClient()

    // Get current user (agent)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized: Must be logged in')
    }

    const cleanMobile = mobile.replace(/[\s\-()]/g, '')

    const { data: customer, error } = await supabase
        .from('customers')
        .select('*')
        .eq('mobile_number', cleanMobile)
        .eq('agent_id', user.id)
        .maybeSingle()

    if (error) {
        console.error('Customer lookup error:', error)
        return { found: false, customer: null }
    }

    if (!customer) {
        return { found: false, customer: null }
    }

    return { found: true, customer: customer as Customer }
}

/**
 * Get all customers for the current agent
 */
export async function getCustomers(filters?: {
    query?: string
    page?: number
    limit?: number
}) {
    const supabase = await createSupabaseClient()
    const page = filters?.page || 1
    const limit = filters?.limit || 50
    const offset = (page - 1) * limit

    let query = supabase
        .from('customers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (filters?.query) {
        query = query.or(`full_name.ilike.%${filters.query}%,mobile_number.ilike.%${filters.query}%,email.ilike.%${filters.query}%`)
    }

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching customers:', error)
        return { customers: [], totalCount: 0 }
    }

    return {
        customers: data as Customer[],
        totalCount: count || 0
    }
}

// ==============================================
// POLICIES API (linked by customer_id)
// ==============================================

export interface Policy {
    policy_id: string
    customer_id: string
    policy_number?: string
    product?: string
    insurance_company: string
    policy_type: 'General' | 'Health' | 'Life'
    sum_insured?: number
    start_date?: string
    end_date?: string
    premium?: number
    claim_status?: 'open' | 'closed'
    claim_settled_amount?: number
    remarks?: string
    status: 'Active' | 'Expired' | 'Cancelled'
    created_at: string
}

/**
 * Create a new policy linked to a customer
 */
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
    claim_status?: 'open' | 'closed'
    remarks?: string
}) {
    const supabase = await createSupabaseClient()

    // Verify customer exists
    const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('customer_id')
        .eq('customer_id', formData.customer_id)
        .single()

    if (customerError || !customer) {
        throw new Error('Customer not found. Policy must be linked to a valid customer.')
    }

    const { data: policy, error } = await supabase
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
            claim_status: formData.claim_status || null,
            remarks: formData.remarks || null,
            status: 'Active'
        })
        .select()
        .single()

    if (error) {
        console.error('Policy creation error:', error)
        throw new Error('Failed to create policy: ' + error.message)
    }

    revalidatePath('/dashboard/policies')
    return { success: true, policy: policy as Policy }
}

/**
 * Get all policies for a specific customer
 */
export async function getPoliciesByCustomer(customerId: string) {
    const supabase = await createSupabaseClient()

    const { data, error } = await supabase
        .from('policies')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching policies:', error)
        return { policies: [] }
    }

    return { policies: data as Policy[] }
}

/**
 * Get all policies with optional filters
 */
export async function getAllPolicies(filters?: {
    policy_type?: string
    status?: string
    query?: string
    page?: number
}) {
    const supabase = await createSupabaseClient()
    const page = filters?.page || 1
    const limit = 50
    const offset = (page - 1) * limit

    let query = supabase
        .from('policies')
        .select(`
            *,
            customers (
                customer_id,
                full_name,
                mobile_number,
                email
            )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

    if (filters?.policy_type && filters.policy_type !== 'All') {
        query = query.eq('policy_type', filters.policy_type)
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
        policies: data || [],
        totalCount: count || 0
    }
}

// ==============================================
// PRODUCTS CATALOGUE API
// ==============================================

export interface ProductCatalogue {
    product_id: string
    product_name: string
    product_type: 'General' | 'Health' | 'Life'
    insurance_company: string
    pdf_url?: string
    pdf_filename?: string
    uploaded_by_agent_id: string
    created_at: string
}

/**
 * Upload a product to the catalogue
 */
export async function uploadProductCatalogue(formData: {
    product_name: string
    product_type: 'General' | 'Health' | 'Life'
    insurance_company: string
    pdf_url?: string
    pdf_filename?: string
}) {
    const supabase = await createSupabaseClient()

    // Get current user (agent)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized: Must be logged in')
    }

    const { data, error } = await supabase
        .from('products')
        .insert({
            name: formData.product_name,
            category: formData.product_type,
            insurer: formData.insurance_company,
            pdf_url: formData.pdf_url || null,
            pdf_filename: formData.pdf_filename || null,
            agent_id: user.id,
            status: 'Active'
        })
        .select()
        .single()

    if (error) {
        console.error('Product upload error:', error)
        throw new Error('Failed to upload product: ' + error.message)
    }

    revalidatePath('/dashboard/product-catalogue')
    return { 
        success: true, 
        product: {
            product_id: data.id,
            product_name: data.name,
            product_type: data.category,
            insurance_company: data.insurer,
            pdf_url: data.pdf_url,
            pdf_filename: data.pdf_filename,
            uploaded_by_agent_id: data.agent_id,
            created_at: data.created_at
        } as ProductCatalogue 
    }
}

/**
 * Get products from catalogue with filters
 */
export async function getProductsCatalogue(filters?: {
    product_type?: string
    insurance_company?: string
    query?: string
}) {
    const supabase = await createSupabaseClient()

    let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('name', { ascending: true })

    if (filters?.product_type && filters.product_type !== 'All') {
        query = query.eq('category', filters.product_type)
    }

    if (filters?.insurance_company && filters.insurance_company !== 'All') {
        query = query.eq('insurer', filters.insurance_company)
    }

    if (filters?.query) {
        query = query.or(`name.ilike.%${filters.query}%,insurer.ilike.%${filters.query}%`)
    }

    const { data, error, count } = await query

    if (error) {
        console.error('Error fetching products:', error)
        return { products: [], totalCount: 0 }
    }

    const mappedProducts = (data || []).map(p => ({
        product_id: p.id,
        product_name: p.name,
        product_type: p.category,
        insurance_company: p.insurer,
        pdf_url: p.pdf_url,
        pdf_filename: p.pdf_filename,
        uploaded_by_agent_id: p.agent_id,
        created_at: p.created_at
    }))

    return {
        products: mappedProducts as ProductCatalogue[],
        totalCount: count || 0
    }
}
