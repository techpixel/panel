import { definePlugin } from '@panel/plugin-sdk';
import Weather from './Weather.svelte';
import type { WeatherSettings } from './types';

const plugin = definePlugin<WeatherSettings>({
	manifest: {
		id: 'weather',
		name: 'Weather',
		description:
			'Current conditions, temperature, humidity, and wind. Background gradient and icon adapt to the condition.',
		defaultSettings: { location: 'Burlington, Vermont' }
	},
	Component: Weather
});

export default plugin;
export { Weather };
export { weatherGradients } from './gradients';
export { weatherIcons } from './icons';
export type { WeatherCondition, WeatherSettings, WeatherSnapshot } from './types';
