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
				// Swiped left, go to next page
				pagination.next();
			} else {
				// Swiped right, go to previous page
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

<div class="bg-[#141011] w-[1280px] h-[800px] p-6 flex flex-col">
	<!-- Top Bar -->
	<div class="flex items-start justify-between pb-6 w-[1232px]">
		<div class="h-10 w-28">
			<img alt="Hack Club" class="h-full w-auto" src="/flag.svg" />
		</div>
		<div class="font-semibold text-[#eae9e6] text-4xl text-right tracking-tight">
			{currentTime} • {currentDate}
		</div>
	</div>

	<!-- Content -->
	<div
		class="w-[1232px] h-[652px]"
		ontouchstart={handleTouchStart}
		ontouchend={handleTouchEnd}
	>
		{@render children()}
	</div>

	<!-- Bottom Bar -->
	<div class="flex items-center justify-center pt-6 w-[1232px]">
		<div class="flex gap-2">
			{#each Array(pagination.totalPages) as _, i}
				<button
					onclick={() => pagination.goto(i)}
					class="w-3 h-3 rounded-full transition-opacity duration-200 cursor-pointer bg-[#eae9e6]"
					class:opacity-50={pagination.currentPage !== i}
					aria-label="Page {i + 1}"
				></button>
			{/each}
		</div>
	</div>
</div>
