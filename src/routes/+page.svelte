<script>
	import { onMount } from 'svelte';

	let time = new Date();

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date();
		}, 100);

		return () => clearInterval(interval);
	});

	$: hours = String(time.getHours() % 12 || 12).padStart(2, '0');
	$: minutes = String(time.getMinutes()).padStart(2, '0');
	$: seconds = String(time.getSeconds()).padStart(2, '0');
	$: period = time.getHours() >= 12 ? 'PM' : 'AM';
</script>

<div class="flex flex-col w-[1280px] h-[800px] bg-white">
	<div class="flex-1 bg-[#130101]" />
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
