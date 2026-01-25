<script lang="ts">
	import { onMount } from 'svelte';

	interface Departure {
		line: string;
		destination: string;
		time: string;
		status: string;
	}

	let departures: Departure[] = $state([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	async function fetchDepartures() {
		try {
			loading = true;
			error = null;
			// Placeholder - replace with actual transit API (MTA, GTFS, etc.)
			// For now, returning empty to show "No upcoming departures"
			departures = [];
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to fetch departures';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchDepartures();
		const interval = setInterval(fetchDepartures, 60 * 1000);
		return () => clearInterval(interval);
	});
</script>

<div class="departures-panel">
	<div class="header">
		<img src="/6.svg" alt="Departures" width="24" height="24" />
		<span class="header-text">NEXT DEPARTURES</span>
	</div>

	{#if loading}
		<p class="main-text">Loading...</p>
	{:else if departures.length === 0}
		<p class="main-text">No upcoming departures</p>
		<p class="sub-text">-</p>
		<p class="sub-text">-</p>
	{:else}
		{#each departures.slice(0, 3) as departure}
			<div class="departure-row">
				<span class="line">{departure.line}</span>
				<span class="destination">{departure.destination}</span>
				<span class="time">{departure.time}</span>
			</div>
		{/each}
	{/if}
</div>

<style>
	@font-face {
		font-family: 'Space Mono';
		src: url('https://fonts.gstatic.com/s/spacemono/v12/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2') format('woff2');
		font-weight: 400;
		font-style: normal;
		font-display: swap;
	}
	@font-face {
		font-family: 'Space Grotesk';
		src: url('https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2') format('woff2');
		font-weight: 700;
		font-style: normal;
		font-display: swap;
	}

	.departures-panel {
		background-color: #211f1f;
		width: 100%;
		height: 100%;
		padding: 24px;
		box-sizing: border-box;
		color: #eae9e6;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 16px;
	}

	.header-text {
		font-family: 'Space Mono', monospace;
		font-size: 16px;
	}

	.main-text {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 32px;
		font-weight: bold;
		margin: 0 0 8px 0;
	}

	.sub-text {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 16px;
		font-weight: bold;
		margin: 0;
		line-height: 1.75;
	}

	.departure-row {
		display: flex;
		align-items: center;
		gap: 16px;
		font-family: 'Space Grotesk', sans-serif;
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 8px;
	}

	.line {
		background: #eae9e6;
		color: #211f1f;
		padding: 2px 8px;
		border-radius: 4px;
	}

	.destination {
		flex: 1;
	}

	.time {
		opacity: 0.7;
	}
</style>
