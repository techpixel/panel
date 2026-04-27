<script lang="ts">
	import { time } from '@panel/runtime';
	import { Droplet, Wind } from 'lucide-svelte';
	import { weatherGradients } from './gradients';
	import { weatherIcons } from './icons';
	import type { WeatherSettings, WeatherSnapshot } from './types';

	let { settings }: { settings: WeatherSettings } = $props();

	const defaultSnapshot: WeatherSnapshot = {
		condition: 'rainy',
		tempF: 5,
		tempC: -15,
		description: 'Cloudy, heavy showers until 5pm today',
		humidity: 79,
		wind: 'N 5 mph'
	};

	let snapshot = $state<WeatherSnapshot>(settings.initialSnapshot ?? defaultSnapshot);

	const gradient = $derived(weatherGradients[snapshot.condition]);
	const Icon = $derived(weatherIcons[snapshot.condition]);

	const updatedAt = $derived.by(() => {
		const n = time.now;
		const h = n.getHours() % 12 || 12;
		const m = String(n.getMinutes()).padStart(2, '0');
		const ap = n.getHours() >= 12 ? 'pm' : 'am';
		return `${h}:${m} ${ap} EST`;
	});
</script>

<div
	class="relative flex h-full w-full flex-col justify-between overflow-hidden p-[32px] text-white"
	style:background={gradient}
>
	<div class="flex flex-col gap-[24px]">
		<p class="font-grotesk text-[32px] leading-none">Weather in {settings.location}</p>
		<div class="flex items-center gap-[16px]">
			<Icon size={80} color="white" strokeWidth={2} />
			<p class="leading-none whitespace-nowrap">
				<span class="text-[128px]">{snapshot.tempF}°F</span><span
					class="text-[64px]"
				>({snapshot.tempC < 0 ? snapshot.tempC : `+${snapshot.tempC}`}°C)</span>
			</p>
		</div>
		<p class="font-grotesk text-[32px] leading-tight">{snapshot.description}</p>
		<div class="mt-[12px] flex flex-col gap-[8px] text-[#eae9e6]">
			<div class="flex items-center gap-[8px]">
				<Droplet size={36} color="#eae9e6" strokeWidth={2} />
				<p class="font-grotesk text-[32px] leading-none">{snapshot.humidity}%</p>
			</div>
			<div class="flex items-center gap-[8px]">
				<Wind size={36} color="#eae9e6" strokeWidth={2} />
				<p class="font-grotesk text-[32px] leading-none">{snapshot.wind}</p>
			</div>
		</div>
	</div>
	<p class="font-grotesk text-[28px] leading-none text-white/80">
		Last updated {updatedAt}
	</p>
</div>
