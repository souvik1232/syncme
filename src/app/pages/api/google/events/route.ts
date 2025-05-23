import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../../../../lib/auth';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const calendar = google.calendar({ version: 'v3', auth });

    try {
        const res = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 50,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = res.data.items?.map((e) => ({
            title: e.summary || 'No Title',
            start: e.start?.dateTime || e.start?.date,
            end: e.end?.dateTime || e.end?.date,
        })) || [];

        return NextResponse.json(events);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}
