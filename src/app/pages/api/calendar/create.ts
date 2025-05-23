/* eslint-disable @typescript-eslint/no-explicit-any */
import { google } from 'googleapis';
import { getToken } from 'next-auth/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

// const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token = await getToken({ req });

    if (!token || !token.accessToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token.accessToken as string });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const { title, description, start, end } = req.body;

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
                summary: title,
                description,
                start: { dateTime: start },
                end: { dateTime: end },
            },
        });

        res.status(200).json(response.data);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}
