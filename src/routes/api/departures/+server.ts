import { json } from '@sveltejs/kit';
import { getTrilliumData } from '$lib/util/trillium';

export async function GET() {
	try {
		const data = await getTrilliumData();
		return json(data);
	} catch (error) {
		console.error('Failed to fetch departures:', error);
		return json({ error: 'Failed to fetch departures' }, { status: 500 });
	}
}
