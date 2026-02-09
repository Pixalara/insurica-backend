'use server'

import { createClient } from '@/utils/supabase/server'

export type AuditAction = 
  | 'LOGIN' 
  | 'LOGOUT'
  | 'CREATE_CUSTOMER'
  | 'UPDATE_CUSTOMER'
  | 'DELETE_CUSTOMER'
  | 'CREATE_POLICY'
  | 'UPDATE_POLICY'
  | 'DELETE_POLICY'
  | 'RENEW_POLICY'
  | 'CREATE_LEAD'
  | 'UPDATE_LEAD'
  | 'DELETE_LEAD'
  | 'CONVERT_LEAD'

interface AuditLogEntry {
  action: AuditAction
  tableName: string
  recordId?: string
  oldData?: Record<string, unknown>
  newData?: Record<string, unknown>
}

/**
 * Creates an audit log entry for tracking sensitive operations
 */
export async function createAuditLog(entry: AuditLogEntry) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { error } = await supabase
    .from('audit_logs')
    .insert({
      user_id: user.id,
      action: entry.action,
      table_name: entry.tableName,
      record_id: entry.recordId || null,
      old_data: entry.oldData || null,
      new_data: entry.newData || null,
    })

  if (error) {
    console.error('Failed to create audit log:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Get audit logs for the current user
 */
export async function getAuditLogs(limit = 50) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch audit logs:', error)
    return []
  }

  return data
}
