<script lang="ts">
	import { onMount } from 'svelte';

	let now = $state(new Date());

	onMount(() => {
		const tick = () => (now = new Date());
		tick();
		const timeout = setTimeout(
			() => {
				tick();
				const interval = setInterval(tick, 60_000);
				return () => clearInterval(interval);
			},
			(60 - new Date().getSeconds()) * 1000
		);
		return () => clearTimeout(timeout);
	});

	const isNight = $derived(now.getHours() >= 20 || now.getHours() < 8);

	const timeText = $derived.by(() => {
		const hours24 = now.getHours();
		const minutes = now.getMinutes();
		const period = hours24 >= 12 ? 'pm' : 'am';
		const hours12 = hours24 % 12 || 12;
		return `${hours12}:${minutes.toString().padStart(2, '0')}${period}`;
	});

	const weatherText = 'Partly Cloudy • 60°F';
</script>

<div class="dashboard" class:night={isNight}>
	<div class="content">
		<p class="time">{timeText}</p>
		<p class="weather">{weatherText}</p>
	</div>
</div>

<style>
	.dashboard {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		box-sizing: border-box;
		width: 100vw;
		height: 100vh;
		padding: 36px;
		background: #ece6d3;
		--time-color: #1f1a0d;
		--weather-color: #353126;
	}

	.dashboard.night {
		background: #1f1a0d;
		--time-color: #ece6d3;
		--weather-color: #b6ae95;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
		flex: 1 0 0;
		min-height: 0;
		padding-bottom: 8px;
	}

	.time {
		margin: 0;
		font-family: 'Unbounded', system-ui, -apple-system, sans-serif;
		font-weight: 400;
		font-size: 128px;
		letter-spacing: 1.28px;
		line-height: normal;
		color: var(--time-color);
	}

	.weather {
		margin: 0;
		font-family: 'Familjen Grotesk', system-ui, -apple-system, sans-serif;
		font-weight: 400;
		font-size: 48px;
		letter-spacing: 0.48px;
		line-height: normal;
		white-space: nowrap;
		color: var(--weather-color);
	}
</style>
