import { NextResponse } from 'next/server';
import { sendFileToWhatsApp } from '@/utils/whatsapp';

export async function GET(request: Request) {
    // Security check
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // This is a test route to check authorization
    return NextResponse.json({ success: true, message: 'Authorization successful for GET route.' });
}

export async function POST(request: Request) {
    // Security check
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
        }

        // Create a small dummy buffer (valid 1x1 transparent pixel png)
        const dummyBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
        
        const result = await sendFileToWhatsApp(
            phone,
            dummyBuffer,
            'test_connection.png',
            '🚀 Whapi Connection Successful! This is a test message from Insurica CRM.'
        );

        return NextResponse.json(result);
    } catch (error: unknown) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
