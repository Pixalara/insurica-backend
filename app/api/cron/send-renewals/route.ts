import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { startOfMonth, endOfMonth, addMonths, format } from 'date-fns';
import { generateRenewalsExcel, type RenewalData } from '@/utils/excel';
import { sendFileToWhatsApp } from '@/utils/whatsapp';

interface PolicyWithCustomer {
    policy_id: string;
    policy_number: string;
    policy_type: string;
    premium: number;
    end_date: string;
    status: string;
    customer: {
        full_name: string;
        mobile_number: string;
        email: string;
        agent_id: string;
        agent: {
            phone: string;
        } | null;
    } | null;
}

export async function GET(request: Request) {
    // 1. Security & Date Check
    const now = new Date();
    const day = now.getDate();
    const isLastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() === day;
    const allowedDays = [15, 20, 25];
    const isTestMode = request.headers.get('x-test-mode') === 'true';

    if (!allowedDays.includes(day) && !isLastDay && !isTestMode) {
        // Only return if it's a cron trigger. If triggered manually (no cron header), we might want to allow it.
        const isCron = request.headers.get('x-vercel-cron') === 'true';
        if (isCron) {
            return NextResponse.json({ message: 'Not a scheduled day. Skipping.' });
        }
    }

    const authHeader = request.headers.get('authorization');

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // return new Response('Unauthorized', { status: 401 });
        // NOTE: During testing, you might want to comment this out if not using Vercel Cron headers.
    }

    const supabase = createAdminClient();

    try {
        // 2. Determine "Next Month" Range
        const now = new Date();
        const nextMonth = addMonths(now, 1);
        const startDate = format(startOfMonth(nextMonth), 'yyyy-MM-dd');
        const endDate = format(endOfMonth(nextMonth), 'yyyy-MM-dd');

        console.log(`Fetching renewals for next month: ${startDate} to ${endDate}`);

        // 3. Fetch Policies and Joined Customers (with agent profile phone)
        const { data: policies, error: policiesError } = await supabase
            .from('policies')
            .select(`
                policy_id,
                policy_number,
                policy_type,
                premium,
                end_date,
                status,
                customer:customers (
                    full_name,
                    mobile_number,
                    email,
                    agent_id,
                    agent:profiles (
                        phone
                    )
                )
            `)
            .gte('end_date', startDate)
            .lte('end_date', endDate)
            .neq('status', 'Cancelled');

        if (policiesError) throw policiesError;

        if (!policies || policies.length === 0) {
            return NextResponse.json({ message: 'No renewals found for next month.' });
        }

        // 4. Group by Agent ID
        const agentsMap = new Map<string, PolicyWithCustomer[]>();
        (policies as unknown as PolicyWithCustomer[]).forEach((policy) => {
            const agentId = policy.customer?.agent_id;
            if (agentId) {
                if (!agentsMap.has(agentId)) {
                    agentsMap.set(agentId, []);
                }
                agentsMap.get(agentId)?.push(policy);
            }
        });

        const results = [];

        // 5. Process each Agent
        for (const [agentId, agentRenewals] of agentsMap.entries()) {
            // Get Agent Phone from the first policy in the group (already joined in Step 3)
            const agentPhone = agentRenewals[0]?.customer?.agent?.phone;

            if (!agentPhone) {
                console.warn(`No phone number found in profile for agent ${agentId}. Skipping.`);
                results.push({ agentId, status: 'skipped', reason: 'No phone number in profile' });
                continue;
            }

            // Prepare Data for Excel
            const excelData: RenewalData[] = agentRenewals.map(p => {
                const end = new Date(p.end_date);
                const diffTime = end.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                return {
                    policy_number: p.policy_number,
                    customer_name: p.customer?.full_name || 'Unknown',
                    email: p.customer?.email || 'N/A',
                    category: p.policy_type,
                    premium: p.premium,
                    expiry_date: p.end_date,
                    days_remaining: diffDays
                };
            });

            // Generate Excel
            const buffer = generateRenewalsExcel(excelData);
            const filename = `Renewals_Next_Month_${format(nextMonth, 'MMM_yyyy')}_${agentId.substring(0, 8)}.xlsx`;
            const caption = `Dear Agent, please find attached the list of policy renewals for next month (${format(nextMonth, 'MMMM yyyy')}).`;

            // Send via WhatsApp
            const sendResult = await sendFileToWhatsApp(agentPhone, buffer, filename, caption);
            
            results.push({
                agentId,
                status: sendResult.success ? 'sent' : 'failed',
                error: sendResult.error
            });
        }

        return NextResponse.json({
            message: 'Cron job processed',
            results: results
        });

    } catch (error: unknown) {
        console.error('Error in cron job:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
