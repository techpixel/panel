import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const ENABLE_BASIC_AUTH = env.ENABLE_BASIC_AUTH === 'true';
const BASIC_AUTH_USER = env.BASIC_AUTH_USER || 'admin';
const BASIC_AUTH_PASSWORD = env.BASIC_AUTH_PASSWORD || 'password';

export const handle: Handle = async ({ event, resolve }) => {
	if (!ENABLE_BASIC_AUTH) {
		return resolve(event);
	}

	const authHeader = event.request.headers.get('authorization');

	if (authHeader) {
		const [scheme, encoded] = authHeader.split(' ');
		if (scheme === 'Basic' && encoded) {
			const decoded = atob(encoded);
			const [user, password] = decoded.split(':');
			if (user === BASIC_AUTH_USER && password === BASIC_AUTH_PASSWORD) {
				return resolve(event);
			}
		}
	}

	return new Response('Unauthorized', {
		status: 401,
		headers: {
			'WWW-Authenticate': 'Basic realm="Protected Area"'
		}
	});
};
