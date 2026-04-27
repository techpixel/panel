/**
 * Screens registry. Order here = order in the nav and the swipe strip.
 *
 * To add a screen: drop a Svelte file in this folder, import it, and add an entry below.
 * A screen is just a Svelte component that composes one or more widgets to fill the
 * 1208 × 652 content area.
 */
import type { Screen } from '$lib/types';
import Control from './Control.svelte';
import Home from './Home.svelte';
import Settings from './Settings.svelte';
import Today from './Today.svelte';

export const screens: readonly Screen[] = [
	{ id: 'home', name: 'Home', Component: Home },
	{ id: 'today', name: 'Today', Component: Today },
	{ id: 'control', name: 'Control', Component: Control },
	{ id: 'settings', name: 'Settings', Component: Settings }
];
