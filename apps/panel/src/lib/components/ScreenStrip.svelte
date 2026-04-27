<script lang="ts">
	import { navigation } from '$lib/stores/navigation.svelte';
	import type { Screen } from '$lib/types';

	let { screens }: { screens: readonly Screen[] } = $props();

	const SECTION_WIDTH = 1208;
	const SECTION_GAP = 36;

	$effect.pre(() => {
		navigation.setScreenCount(screens.length);
	});

	const stripTranslateX = $derived(-navigation.progress * (SECTION_WIDTH + SECTION_GAP));
</script>

<div class="relative w-full flex-1 overflow-visible">
	<div
		class="screen-strip flex h-full gap-[36px]"
		class:dragging={navigation.isDragging}
		style:transform={`translateX(${stripTranslateX}px)`}
	>
		{#each screens as screen (screen.id)}
			{@const Component = screen.Component}
			<section class="relative h-full w-[1208px] flex-shrink-0">
				<Component />
			</section>
		{/each}
	</div>
</div>

<style>
	.screen-strip {
		transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
		will-change: transform;
	}
	.screen-strip.dragging {
		transition: none;
	}
</style>
