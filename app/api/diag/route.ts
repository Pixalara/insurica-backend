import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET(request: Request) {
    // Security check
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();
    
    try {
        // Check policies
        const { data: policies, error: pError } = await supabase
            .from('policies')
            .select('policy_id, end_date, customer_id')
            .limit(10);
            
        // Check profiles (including phone)
        const { data: profiles, error: prError } = await supabase
            .from('profiles')
            .select('id, full_name, role, phone')
            .limit(10);
            
        // Check customers
        const { data: customers, error: cError } = await supabase
            .from('customers')
            .select('customer_id, agent_id, mobile_number')
            .limit(10);

        return NextResponse.json({
            currentDate: new Date().toISOString(),
            profiles: profiles || [],
            customers: customers || [],
            pError,
            prError,
            cError
        });
    } catch (error: unknown) {
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
