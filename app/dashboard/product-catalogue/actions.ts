'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Product, ProductFormData } from './types'

export async function getProducts(filters?: {
  query?: string
  category?: string
  status?: string
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  // Apply filters
  if (filters?.query) {
    query = query.or(`name.ilike.%${filters.query}%,insurer.ilike.%${filters.query}%`)
  }
  
  if (filters?.category && filters.category !== 'All') {
    query = query.eq('category', filters.category)
  }
  
  if (filters?.status && filters.status !== 'All') {
    query = query.eq('status', filters.status)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], totalCount: 0 }
  }

  return {
    products: (data as Product[]) || [],
    totalCount: count || 0,
  }
}

export async function getProductById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data as Product
}

export async function createProduct(formData: ProductFormData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .insert([{
      ...formData,
      features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/product-catalogue')
  return { success: true, data }
}

export async function updateProduct(id: string, formData: ProductFormData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .update({
      ...formData,
      features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/product-catalogue')
  return { success: true, data }
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/product-catalogue')
  return { success: true }
}
