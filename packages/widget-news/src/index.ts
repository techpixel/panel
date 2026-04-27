import { definePlugin } from '@panel/plugin-sdk';
import News from './News.svelte';
import type { NewsSettings } from './types';

const plugin = definePlugin<NewsSettings>({
	manifest: {
		id: 'news',
		name: 'News',
		description: 'Latest headlines from configured sources.',
		defaultSettings: {}
	},
	Component: News
});

export default plugin;
export { News };
export type { NewsHeadline, NewsSettings } from './types';
