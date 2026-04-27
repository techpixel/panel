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

<div class="w-full h-full relative" style="background: linear-gradient(180deg, rgba(45, 150, 211, 0.3) 0%, rgb(0, 0, 0) 100%), rgba(0, 0, 0, 0.7);">
	<!-- Content -->
	<div class="relative h-full p-[36px] pt-[92px] pb-[112px] flex flex-col justify-end">
		<div class="flex flex-col gap-[36px]">
			<!-- Header -->
			<div class="flex gap-[16px] items-center">
				<img src="/6.svg" alt="" width="36" height="36" />
				<div class="font-serif text-[#d7d7d7] text-[40px] leading-tight">
					Next Departures
				</div>
			</div>

			<!-- Departures List -->
			<div class="flex flex-col gap-[12px] font-serif leading-none">
				{#if loading && !data}
					<div class="text-[128px] text-[#eae9e6]">Loading...</div>
				{:else if error && !data}
					<div class="text-[128px] text-red-400">{error}</div>
				{:else if !data || data.data.length === 0}
					<div class="text-[128px] text-[#eae9e6]">No upcoming departures</div>
					<div class="text-[64px] text-[#888]">-</div>
					<div class="text-[64px] text-[#888]">-</div>
					<div class="text-[64px] text-[#888]">-</div>
					<div class="text-[64px] text-[#888]">-</div>
				{:else}
					{#each data.data.slice(0, 5) as departure, i}
						{#if i === 0}
							<div class="flex items-baseline gap-[24px]">
								<span class="text-[128px] text-[#eae9e6]">{getArrivalStatus(departure.arrivalTime)}</span>
								{#if departure.isPrediction}
									<span class="font-serif text-[64px] text-[#888]">live</span>
								{/if}
							</div>
						{:else}
							<div class="flex items-baseline gap-[16px]">
								<span class="text-[64px] text-[#888]">{getArrivalStatus(departure.arrivalTime)}</span>
								{#if departure.isPrediction}
									<span class="font-serif text-[24px] text-[#888]">live</span>
								{/if}
							</div>
						{/if}
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
