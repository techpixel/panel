import { definePlugin } from '@panel/plugin-sdk';
import Clock from './Clock.svelte';
import type { ClockSettings } from './types';

const plugin = definePlugin<ClockSettings>({
	manifest: {
		id: 'clock',
		name: 'Clock',
		description: 'Live time with an optional subtitle line.',
		defaultSettings: {}
	},
	Component: Clock
});

export default plugin;
export { Clock };
export type { ClockSettings } from './types';
