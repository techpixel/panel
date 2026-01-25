<script lang="ts">
	import { onMount } from 'svelte';

	let time = new Date();
	let currentIframeIndex = 0;
	let isAnimating = true;

	const baseIframes = [
		'https://hackclub.com',
		'https://campfire.hackclub.com/',
		'https://time.is/'
	];

	const iframes = [...baseIframes, baseIframes[0]];
	const rotationInterval = 30000;

	onMount(() => {
		const clockInterval = setInterval(() => {
			time = new Date();
		}, 100);

		let iframeTimer: ReturnType<typeof setInterval> | undefined;
		if (baseIframes.length > 0) {
			iframeTimer = setInterval(() => {
				if (currentIframeIndex === iframes.length - 2) {
					currentIframeIndex += 1;
					setTimeout(() => {
						isAnimating = false;
						currentIframeIndex = 0;
						setTimeout(() => {
							isAnimating = true;
						}, 10);
					}, 500);
				} else {
					currentIframeIndex += 1;
				}
			}, rotationInterval);
		}

		return () => {
			clearInterval(clockInterval);
			if (iframeTimer) clearInterval(iframeTimer);
		};
	});

	$: hours = String(time.getHours() % 12 || 12);
	$: minutes = String(time.getMinutes()).padStart(2, '0');
	$: seconds = String(time.getSeconds()).padStart(2, '0');
	$: period = time.getHours() >= 12 ? 'PM' : 'AM';
	$: dayName = time.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
	$: monthName = time.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
	$: dayNum = time.getDate();
</script>

<div class="dashboard">
	<div class="inner">
		<div class="top-bar">
			<img src="/flag.svg" alt="Hack Club" class="logo" />
			<div class="time-display">
				{hours}:{minutes}:{seconds} {period} • {dayName} {monthName} {dayNum}
			</div>
		</div>
		<div class="iframe-container">
			{#each iframes as url, idx}
				<iframe
					src={url}
					scrolling="no"
					class="iframe"
					class:animating={isAnimating}
					style="transform: translateX({(idx - currentIframeIndex) * 100}%)"
					title="Gallery"
				></iframe>
			{/each}
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
		src: url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Italic.woff') format('woff'),
			url('https://assets.hackclub.com/fonts/Phantom_Sans_0.7/Italic.woff2') format('woff2');
		font-weight: normal;
		font-style: italic;
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
		color: white;
		text-align: right;
		height: 40px;
		display: flex;
		align-items: center;
	}

	.iframe-container {
		background-color: white;
		flex: 1;
		width: 100%;
		position: relative;
		overflow: hidden;
	}

	.iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: none;
	}

	.iframe.animating {
		transition: transform 0.5s ease;
	}
</style>
