<script lang="ts">
	import { onMount } from 'svelte';
	import Weather from '$lib/components/Weather.svelte';
	import Departures from '$lib/components/Departures.svelte';
	import ProjectShowcase from '$lib/components/ProjectShowcase.svelte';
	import Ad from '$lib/components/Ad.svelte';

	let time = $state(new Date());

	onMount(() => {
		const clockInterval = setInterval(() => {
			time = new Date();
		}, 100);

		return () => {
			clearInterval(clockInterval);
		};
	});

	const hours = $derived(String(time.getHours() % 12 || 12));
	const minutes = $derived(String(time.getMinutes()).padStart(2, '0'));
	const seconds = $derived(String(time.getSeconds()).padStart(2, '0'));
	const period = $derived(time.getHours() >= 12 ? 'PM' : 'AM');
	const dayName = $derived(time.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase());
	const monthName = $derived(time.toLocaleDateString('en-US', { month: 'short' }).toUpperCase());
	const dayNum = $derived(time.getDate());
</script>

<div class="dashboard">
	<div class="inner">
		<div class="top-bar">
			<img src="/flag.svg" alt="Hack Club" class="logo" />
			<div class="time-display">
				{hours}:{minutes}:{seconds} {period} • {dayName} {monthName} {dayNum}
			</div>
		</div>
		<div class="content">
			<div class="panel weather">
				<Weather />
			</div>
			<div class="right-column">
				<div class="panel departures">
					<Departures />
				</div>
				<div class="panel project">
					<ProjectShowcase />
				</div>
			</div>
			<div class="far-right-column">
				<div class="panel campfire">
					<Ad />
				</div>
				<div class="panel placeholder-bottom"></div>
			</div>
		</div>
	</div>
</div>

<style>
	@font-face {
		font-family: 'Phantom Sans';
		src: url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Regular.woff') format('woff'),
			url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Regular.woff2') format('woff2');
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}
	@font-face {
		font-family: 'Phantom Sans';
		src: url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Bold.woff') format('woff'),
			url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Bold.woff2') format('woff2');
		font-weight: bold;
		font-style: normal;
		font-display: swap;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}

	.dashboard {
		background-color: #141011;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 24px;
		width: 1280px;
		height: 800px;
		box-sizing: border-box;
	}

	.inner {
		background-color: #141011;
		flex: 1;
		width: 100%;
		overflow: hidden;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.top-bar {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding-bottom: 24px;
		width: 100%;
	}

	.logo {
		width: 112px;
		height: 40px;
	}

	.time-display {
		font-family: 'Phantom Sans', sans-serif;
		font-weight: 600;
		font-size: 24px;
		color: #eae9e6;
		text-align: right;
		height: 40px;
		display: flex;
		align-items: center;
	}

	.content {
		flex: 1;
		width: 100%;
		display: flex;
		gap: 12px;
		overflow: hidden;
	}

	.panel {
		border-radius: 0;
		overflow: hidden;
	}

	.weather {
		width: 405px;
		height: 100%;
	}

	.right-column {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 464px;
	}

	.departures {
		height: 213px;
	}

	.project {
		flex: 1;
	}

	.far-right-column {
		display: flex;
		flex-direction: column;
		gap: 12px;
		flex: 1;
	}

	.campfire {
		height: 213px;
	}

	.placeholder-bottom {
		flex: 1;
		background-color: #211f1f;
	}
</style>
