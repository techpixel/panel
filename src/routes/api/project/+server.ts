import { json } from '@sveltejs/kit';
import { fetchProject } from '$lib/airtable';

export async function GET() {
	try {
		const project = await fetchProject();
		return json(project);
	} catch (error) {
		console.error('Failed to fetch project:', error);
		return json({ error: 'Failed to fetch project' }, { status: 500 });
	}
}
