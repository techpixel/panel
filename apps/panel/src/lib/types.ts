import type { Component } from 'svelte';

export interface Screen {
	id: string;
	name: string;
	Component: Component;
}
