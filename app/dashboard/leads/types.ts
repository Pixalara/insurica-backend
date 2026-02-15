
export type LeadStatus = 'Follow Up' | 'Closed' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  product_name: string | null;
  premium_quoted: number | null;
  status: LeadStatus;
  notes: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadMetrics {
  totalLeads: number;
  newLeadsThisMonth: number;
  followUpsDue: number; // Assuming "Follow Up" status means due
  dealsClosed: number;
}
