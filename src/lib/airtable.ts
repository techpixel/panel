import { AIRTABLE_API_KEY } from '$env/static/private';
// import 'dotenv/config'
import Airtable from 'airtable';

const base = new Airtable({apiKey: AIRTABLE_API_KEY}).base('app3A5kJwYqxMLOgh');

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
let cachedProject: Awaited<ReturnType<typeof fetchProjectFromAirtable>> | null = null;
let cacheTimestamp = 0;

export async function fetchProject() {
    const now = Date.now();
    if (cachedProject && now - cacheTimestamp < CACHE_TTL) {
        return cachedProject;
    }

    cachedProject = await fetchProjectFromAirtable();
    cacheTimestamp = now;
    return cachedProject;
}

async function fetchProjectFromAirtable() {
    const result = (await base('Approved Projects').select({
        maxRecords: 1,
        fields: [
            'First Name',
            'Code URL', // ex: https://github.com/techpixel/panel 
            'Screenshot',
            'GitHub Username',
            'Description',
            'YSWS–Name',
            'Approved At',
            'Created'
        ],
        sort: [
            {
                field: 'Approved At',
                direction: 'desc'
            },
            {
                field: 'Created',
                direction: 'desc'
            }
        ]
    }).all())[0].fields

    const codeUrl = result['Code URL'] as string || '';
    const repoName = codeUrl.split('/').pop() || '';
    const title = repoName
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
        ...result,
        //@ts-ignore
        "Screenshot": result.Screenshot[0].url || '',
        "Title": title
    }
}
