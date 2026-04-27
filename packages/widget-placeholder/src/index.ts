import { definePlugin } from '@panel/plugin-sdk';
import Placeholder from './Placeholder.svelte';
import type { PlaceholderSettings } from './types';

const plugin = definePlugin<PlaceholderSettings>({
	manifest: {
		id: 'placeholder',
		name: 'Placeholder',
		description: 'Big title and optional subtitle. Useful for screens not yet implemented.',
		defaultSettings: { title: 'Coming Soon' }
	},
	Component: Placeholder
});

export default plugin;
export { Placeholder };
export type { PlaceholderSettings } from './types';
