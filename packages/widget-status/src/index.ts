import { definePlugin } from '@panel/plugin-sdk';
import Status from './Status.svelte';
import type { StatusSettings } from './types';

const plugin = definePlugin<StatusSettings>({
	manifest: {
		id: 'status',
		name: 'Status',
		description: 'Availability indicator (busy / free) with a countdown line.',
		defaultSettings: { initialStatus: 'busy', initialEndsInMin: 15 }
	},
	Component: Status
});

export default plugin;
export { Status };
export type { StatusSettings, StatusValue } from './types';
