<script>
	import { onMount } from 'svelte';

	let time = new Date();
	let currentIframeIndex = 0;
	let isAnimating = true;

	const baseIframes = [
		'https://hackclub.com',
        'https://campfire.hackclub.com/',
        'https://time.is/'
	];

	// Duplicate first frame at end for seamless looping
	const iframes = [...baseIframes, baseIframes[0]];

	const rotationInterval = 30000; // 30 seconds

	onMount(() => {
		const clockInterval = setInterval(() => {
			time = new Date();
		}, 100);

		let iframeTimer;
		if (baseIframes.length > 0) {
			iframeTimer = setInterval(() => {
				if (currentIframeIndex === iframes.length - 2) {
					// Last real frame - animate to duplicate, then reset
					currentIframeIndex += 1;
					
					// Wait for animation to complete, then reset instantly
					setTimeout(() => {
						isAnimating = false;
						currentIframeIndex = 0;
						
						// Re-enable animation for next cycle
						setTimeout(() => {
							isAnimating = true;
						}, 10);
					}, 500); // Match animation duration
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

	$: hours = String(time.getHours() % 12 || 12).padStart(2, '0');
	$: minutes = String(time.getMinutes()).padStart(2, '0');
	$: seconds = String(time.getSeconds()).padStart(2, '0');
	$: period = time.getHours() >= 12 ? 'PM' : 'AM';
</script>

<div class="flex flex-col w-[1280px] h-[800px] bg-white">
	<div class="flex-1 bg-[#130101] relative overflow-hidden">
		{#each iframes as url, idx}
			<iframe 
				src={url}
				scrolling="no"
				class="absolute inset-0 w-full h-full border-none"
				class:transition-transform={isAnimating}
				class:duration-500={isAnimating}
				style="transform: translateX({(idx - currentIframeIndex) * 100}%)"
				title="Gallery"
			/>
		{/each}
	</div>
	<div class="flex items-center justify-between bg-[#270202] px-[26px] py-[26px] h-[100px]">
		<div class="flex items-center font-semibold text-white font-['Mona_Sans_VF'] tracking-tight">
			<span class="text-[64px] leading-none">{hours}:{minutes}</span>
			<span class="text-[32px] leading-none ml-1">:{seconds} {period}</span>
		</div>
		<div class="w-[137px] h-[48px] flex items-center justify-center">
			<img alt="Hack Club flag" src="/flag.svg" class="w-full h-full object-contain" />
		</div>
	</div>
</div>

<style global>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
