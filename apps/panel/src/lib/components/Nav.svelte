<script lang="ts">
	import { time } from '@panel/runtime';
	import { navigation } from '$lib/stores/navigation.svelte';
	import type { Screen } from '$lib/types';

	let { screens }: { screens: readonly Screen[] } = $props();
</script>

<header
	class="flex h-[40px] w-full items-center justify-between text-[32px] tracking-[0.32px] text-black"
>
	<nav class="flex items-center gap-[32px]">
		{#each screens as screen, i}
			<button
				type="button"
				onclick={() => navigation.setActive(i)}
				class="nav-item cursor-pointer leading-none whitespace-nowrap"
				class:dragging={navigation.isDragging}
				style:font-variation-settings={`'wght' ${navigation.weightFor(i)}`}
			>
				{screen.name}
			</button>
		{/each}
	</nav>
	<span class="leading-none whitespace-nowrap">{time.label}</span>
</header>

<style>
	.nav-item {
		transition: font-variation-settings 350ms cubic-bezier(0.4, 0, 0.2, 1);
		font-variation-settings: 'wght' 400;
	}
	.nav-item.dragging {
		transition: none;
	}
</style>
