import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../../../../lib/auth';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const { title, start, end } = await req.json();

    if (!session?.accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const calendar = google.calendar({ version: 'v3', auth });

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: title,
                start: { dateTime: new Date(start).toISOString() },
                end: { dateTime: new Date(end).toISOString() },
            },
        });

        return NextResponse.json({ event: response.data });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
