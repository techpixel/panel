<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { pagination } from '$lib/stores/pagination.svelte';

	let { children } = $props();

	let currentTime = $state('');
	let currentDate = $state('');
	let touchStartX = $state(0);
	let touchEndX = $state(0);

	function updateDateTime() {
		const now = new Date();
		currentTime = now.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			second: '2-digit',
			hour12: true
		}).toUpperCase();
		currentDate = now.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		}).toUpperCase();
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchEnd(e: TouchEvent) {
		touchEndX = e.changedTouches[0].clientX;
		const diff = touchStartX - touchEndX;
		const threshold = 50;

		if (Math.abs(diff) > threshold) {
			if (diff > 0) {
				pagination.next();
			} else {
				pagination.prev();
			}
		}
	}

	const PAGE_INTERVAL_MS = 30000;

	onMount(() => {
		updateDateTime();
		const dateInterval = setInterval(updateDateTime, 1000);

		const pageInterval = setInterval(() => {
			pagination.next();
		}, PAGE_INTERVAL_MS);

		return () => {
			clearInterval(dateInterval);
			clearInterval(pageInterval);
		};
	});
</script>

<div
	class="w-[1280px] h-[800px] relative overflow-hidden"
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
>
	<!-- Page content fills entire area with its own background -->
	<div class="absolute inset-0">
		{@render children()}
	</div>

	<!-- Top Bar overlay -->
	<div class="absolute top-[36px] left-[36px] right-[36px] z-10 flex justify-between items-start">
		<div class="h-[40px] w-[112px]">
			<img alt="Hack Club" class="h-full w-auto" src="/flag.svg" />
		</div>
		<div class="flex gap-3 items-center h-[40px]">
			<div class="font-semibold text-white text-[36px] text-right leading-[40px] tracking-tight">
				{currentTime} &bull; {currentDate}
			</div>
			<img src="/settings.svg" alt="Settings" class="w-[36px] h-[36px] p-[4px]" />
		</div>
	</div>

	<!-- Bottom pagination overlay -->
	<div class="absolute bottom-[36px] left-[36px] right-[36px] z-10">
		<div class="bg-white/10 rounded-[16px] p-[16px] flex items-center justify-center">
			<div class="flex gap-2">
				{#each Array(pagination.totalPages) as _, i}
					<button
						onclick={() => pagination.goto(i)}
						class="w-3 h-3 rounded-full transition-opacity duration-200 cursor-pointer bg-white"
						class:opacity-40={pagination.currentPage !== i}
						aria-label="Page {i + 1}"
					></button>
				{/each}
			</div>
		</div>
	</div>
</div>
