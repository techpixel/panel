<script lang="ts">
	import { onMount } from 'svelte';
	import type { TrilliumResponse } from '$lib/util/trillium';

	let data: TrilliumResponse | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	async function fetchDepartures() {
		try {
			loading = true;
			error = null;
			const response = await fetch('/api/departures');
			if (!response.ok) throw new Error('Failed to fetch departures');
			data = await response.json();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to fetch departures';
		} finally {
			loading = false;
		}
	}

	function getArrivalStatus(arrivalTime: string): string {
		const now = new Date();
		const arrival = new Date(arrivalTime);
		const diffMinutes = Math.floor((arrival.getTime() - now.getTime()) / (1000 * 60));

		if (diffMinutes <= 0) {
			return `Left`;
		} else if (diffMinutes <= 4) {
			return `Go now (${diffMinutes} min)`;
		} else {
			return `${diffMinutes} min`;
		}
	}

	onMount(() => {
		fetchDepartures();
		const interval = setInterval(fetchDepartures, 30 * 1000);
		return () => clearInterval(interval);
	});
</script>

<div class="bg-[#211f1f] w-full h-full flex flex-col p-9 text-[#eae9e6]">
	<div class="flex items-center gap-3 mb-6">
		<img src="/6.svg" alt="Departures" width="36" height="36" />
		<h2 class="text-4xl font-medium">NEXT DEPARTURES</h2>
	</div>

	{#if loading}
		<div class="text-6xl font-bold">Loading...</div>
	{:else if error}
		<div class="text-6xl font-bold text-red-400">{error}</div>
	{:else if !data || data.data.length === 0}
		<div class="text-6xl font-bold">No upcoming departures</div>
		<div class="text-5xl font-bold mt-8">-</div>
		<div class="text-5xl font-bold mt-12">-</div>
		<div class="text-5xl font-bold mt-12">-</div>
		<div class="text-5xl font-bold mt-12">-</div>
	{:else}
		<div class="flex flex-col">
			{#each data.data.slice(0, 4) as departure, i}
				<div class={`flex items-center gap-6 px-6 py-4 ${i % 2 === 0 ? 'bg-white/5' : ''}`}>
					<div class={i === 0 ? 'text-[128px] font-bold flex-1' : 'text-6xl font-bold flex-1'}>
						{getArrivalStatus(departure.arrivalTime)}
					</div>
					<div class={i === 0 ? 'text-6xl opacity-70' : 'text-4xl opacity-70'}>{departure.isPrediction ? 'LIVE' : 'SCHEDULED'}</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
