import type { Component } from 'svelte';

export interface WidgetManifest<TSettings = unknown> {
	id: string;
	name: string;
	description: string;
	defaultSettings: TSettings;
}

export interface Plugin<TSettings = unknown> {
	manifest: WidgetManifest<TSettings>;
	Component: Component<{ settings: TSettings }>;
}

/**
 * Identity helper that gives plugin authors type inference and a tiny brand.
 * Use this as the default export of a plugin package's entry point.
 *
 * @example
 *   import { definePlugin } from '@panel/plugin-sdk';
 *   import Weather from './Weather.svelte';
 *
 *   export default definePlugin<WeatherSettings>({
 *     manifest: { id: 'weather', name: 'Weather', ... },
 *     Component: Weather
 *   });
 */
export function definePlugin<TSettings>(plugin: Plugin<TSettings>): Plugin<TSettings> {
	return plugin;
}
