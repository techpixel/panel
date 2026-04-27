<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Cloud,
		CloudLightning,
		CloudRainWind,
		CloudSnow,
		CloudSun,
		Droplet,
		Newspaper,
		Sun,
		Wind
	} from 'lucide-svelte';

	let now = $state(new Date());

	onMount(() => {
		const id = setInterval(() => (now = new Date()), 1000);
		return () => clearInterval(id);
	});

	const timeLabel = $derived.by(() => {
		const h = now.getHours() % 12 || 12;
		const m = String(now.getMinutes()).padStart(2, '0');
		const ap = now.getHours() >= 12 ? 'pm' : 'am';
		return `${h}:${m}${ap}`;
	});

	const weatherUpdatedAt = $derived.by(() => {
		const h = now.getHours() % 12 || 12;
		const m = String(now.getMinutes()).padStart(2, '0');
		const ap = now.getHours() >= 12 ? 'pm' : 'am';
		return `${h}:${m} ${ap} EST`;
	});

	const navItems = ['Home', 'Today', 'Control', 'Settings'] as const;
	let activeIndex = $state(0);

	function setActive(i: number) {
		activeIndex = Math.max(0, Math.min(navItems.length - 1, i));
	}

	const STEP_PX = 220;
	const OVERSCROLL_DAMP = 0.45;
	const OVERSCROLL_MAX_BONUS = 200;
	let touchStartX: number | null = null;
	let dragDx = $state(0);
	let isDragging = $state(false);

	const navProgress = $derived.by(() => {
		const max = navItems.length - 1;
		const raw = activeIndex + dragDx / STEP_PX;
		if (raw < 0) return raw * OVERSCROLL_DAMP;
		if (raw > max) return max + (raw - max) * OVERSCROLL_DAMP;
		return raw;
	});

	function weightFor(i: number) {
		const max = navItems.length - 1;
		if (navProgress < 0 && i === 0) {
			const over = -navProgress;
			return Math.round(700 + OVERSCROLL_MAX_BONUS * (1 - Math.exp(-over * 1.5)));
		}
		if (navProgress > max && i === max) {
			const over = navProgress - max;
			return Math.round(700 + OVERSCROLL_MAX_BONUS * (1 - Math.exp(-over * 1.5)));
		}
		const clamped = Math.max(0, Math.min(max, navProgress));
		const dist = Math.abs(i - clamped);
		return Math.round(400 + 300 * Math.max(0, 1 - dist));
	}

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
		dragDx = 0;
		isDragging = true;
	}

	function handleTouchMove(e: TouchEvent) {
		if (touchStartX === null) return;
		dragDx = e.touches[0].clientX - touchStartX;
	}

	function handleTouchEnd() {
		if (touchStartX === null) return;
		setActive(Math.round(navProgress));
		touchStartX = null;
		dragDx = 0;
		isDragging = false;
	}

	type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'partly-cloudy';

	let weather = $state({
		condition: 'rainy' as WeatherCondition,
		tempF: 5,
		tempC: -15,
		description: 'Cloudy, heavy showers until 5pm today',
		humidity: 79,
		wind: 'N 5 mph',
		location: 'Burlington, Vermont'
	});

	const weatherGradients: Record<WeatherCondition, string> = {
		sunny:
			'radial-gradient(ellipse 90% 70% at 50% 0%, #ffe28a 0%, #ffb344 50%, #ff7e1c 75%, #e54a00 100%)',
		'partly-cloudy':
			'radial-gradient(ellipse 90% 70% at 50% 0%, #cfe7f8 0%, #8cb8d6 50%, #5b8fb6 75%, #2f6692 100%)',
		cloudy:
			'radial-gradient(ellipse 90% 70% at 50% 0%, #d8dde3 0%, #9ca5af 50%, #6b7480 75%, #3f4854 100%)',
		rainy:
			'radial-gradient(ellipse 90% 70% at 50% 0%, #7eccfc 0%, #4cafe7 50%, #34a0dd 75%, #1b92d2 100%)',
		snowy:
			'radial-gradient(ellipse 90% 70% at 50% 0%, #f3f6ff 0%, #c7d2e7 50%, #95a8c5 75%, #5d769e 100%)',
		stormy:
			'radial-gradient(ellipse 90% 70% at 50% 0%, #525c6b 0%, #313947 50%, #1a212c 75%, #0a0e15 100%)'
	};

	const weatherIcons: Record<WeatherCondition, typeof Cloud> = {
		sunny: Sun,
		'partly-cloudy': CloudSun,
		cloudy: Cloud,
		rainy: CloudRainWind,
		snowy: CloudSnow,
		stormy: CloudLightning
	};

	const weatherGradient = $derived(weatherGradients[weather.condition]);
	const WeatherIcon = $derived(weatherIcons[weather.condition]);

	const newsHeadlines = [
		{
			source: 'BBC',
			title: 'Tech earnings beat expectations as cloud demand surges'
		},
		{
			source: 'AP',
			title: 'Climate summit yields new carbon pricing framework'
		},
		{
			source: 'Reuters',
			title: 'Discovery rewrites bronze age timeline'
		}
	];

	let status = $state<'busy' | 'free'>('busy');
	let endsInMin = $state(15);

	const statusColor = $derived(status === 'busy' ? '#f85454' : '#7bc47f');
	const statusLabel = $derived(status === 'busy' ? 'Busy' : 'Free');
	const statusSub = $derived(
		status === 'busy' ? `Ends ${endsInMin} min` : `Free for ${endsInMin} min`
	);

	const SECTION_WIDTH = 1208;
	const SECTION_GAP = 36;
	const stripTranslateX = $derived(-navProgress * (SECTION_WIDTH + SECTION_GAP));
</script>

<div
	class="font-unbounded flex h-[800px] w-[1280px] flex-col gap-[36px] bg-[#ece6d3] p-[36px]"
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	ontouchend={handleTouchEnd}
	ontouchcancel={handleTouchEnd}
>
	<header
		class="flex h-[40px] w-full items-center justify-between text-[32px] tracking-[0.32px] text-black"
	>
		<nav class="flex items-center gap-[32px]">
			{#each navItems as item, i}
				<button
					type="button"
					onclick={() => setActive(i)}
					class="nav-item cursor-pointer leading-none whitespace-nowrap"
					class:dragging={isDragging}
					style:font-variation-settings={`'wght' ${weightFor(i)}`}
				>
					{item}
				</button>
			{/each}
		</nav>
		<span class="leading-none whitespace-nowrap">{timeLabel}</span>
	</header>

	<div class="relative w-full flex-1 overflow-visible">
		<div
			class="screen-strip flex h-full gap-[36px]"
			class:dragging={isDragging}
			style:transform={`translateX(${stripTranslateX}px)`}
		>
			<!-- Home -->
			<section class="relative h-full w-[1208px] flex-shrink-0">
				<div class="flex h-full w-full items-center gap-[36px]">
					<div class="relative h-full min-w-0 flex-1 overflow-hidden">
						<div class="absolute top-[496px] left-0 flex w-[451px] flex-col items-start pb-[8px]">
							<p
								class="text-[96px] leading-none tracking-[0.96px] whitespace-nowrap text-black"
							>
								{timeLabel}
							</p>
							<p
								class="font-grotesk text-[36px] leading-none tracking-[0.36px] whitespace-nowrap text-[#333]"
							>
								{weather.description.split(',')[0]} • {weather.tempF}°F
							</p>
						</div>
					</div>
					<div
						class="relative h-full w-[558px] overflow-hidden"
						style:background-color={statusColor}
					>
						<div class="absolute bottom-[32px] left-[32px] flex flex-col items-start pb-[8px]">
							<p class="w-[329px] text-[96px] leading-none tracking-[0.96px] text-white">
								{statusLabel}
							</p>
							<p
								class="font-grotesk text-[40px] leading-none tracking-[0.4px] whitespace-nowrap text-white/60"
							>
								{statusSub}
							</p>
						</div>
					</div>
				</div>
			</section>

			<!-- Today -->
			<section class="relative h-full w-[1208px] flex-shrink-0">
				<div class="flex h-full w-full items-stretch gap-[36px]">
					<!-- Weather card -->
					<div
						class="relative flex h-full w-[655px] flex-shrink-0 flex-col justify-between overflow-hidden p-[32px] text-white"
						style:background={weatherGradient}
					>
						<div class="flex flex-col gap-[24px]">
							<p class="font-grotesk text-[32px] leading-none">
								Weather in {weather.location}
							</p>
							<div class="flex items-center gap-[16px]">
								<WeatherIcon size={80} color="white" strokeWidth={2} />
								<p class="leading-none whitespace-nowrap">
									<span class="text-[128px]">{weather.tempF}°F</span><span
										class="text-[64px]"
									>({weather.tempC < 0 ? weather.tempC : `+${weather.tempC}`}°C)</span>
								</p>
							</div>
							<p class="font-grotesk text-[32px] leading-tight">
								{weather.description}
							</p>
							<div class="mt-[12px] flex flex-col gap-[8px]">
								<div class="flex items-center gap-[8px] text-[#eae9e6]">
									<Droplet size={36} color="#eae9e6" strokeWidth={2} />
									<p class="font-grotesk text-[32px] leading-none">{weather.humidity}%</p>
								</div>
								<div class="flex items-center gap-[8px] text-[#eae9e6]">
									<Wind size={36} color="#eae9e6" strokeWidth={2} />
									<p class="font-grotesk text-[32px] leading-none">{weather.wind}</p>
								</div>
							</div>
						</div>
						<p class="font-grotesk text-[28px] leading-none text-white/80">
							Last updated {weatherUpdatedAt}
						</p>
					</div>

					<!-- News card -->
					<div
						class="relative flex h-full flex-1 flex-col gap-[28px] overflow-hidden bg-[#1f1a17] p-[32px] text-white"
					>
						<div class="flex items-center gap-[16px]">
							<Newspaper size={48} color="#eae9e6" strokeWidth={2} />
							<p class="text-[40px] leading-none tracking-[0.4px]">News</p>
						</div>
						<div class="flex flex-1 flex-col gap-[28px]">
							{#each newsHeadlines as item}
								<article class="flex flex-col gap-[6px] border-l-[3px] border-white/30 pl-[16px]">
									<p
										class="font-grotesk text-[20px] leading-none tracking-[0.2px] text-white/60 uppercase"
									>
										{item.source}
									</p>
									<p class="font-grotesk text-[28px] leading-[1.2] text-white">
										{item.title}
									</p>
								</article>
							{/each}
						</div>
					</div>
				</div>
			</section>

			<!-- Control -->
			<section class="relative h-full w-[1208px] flex-shrink-0">
				<div class="absolute top-[496px] left-0 flex flex-col items-start pb-[8px]">
					<p class="text-[96px] leading-none tracking-[0.96px] whitespace-nowrap text-black">
						Control
					</p>
					<p
						class="font-grotesk text-[36px] leading-none tracking-[0.36px] whitespace-nowrap text-[#333]"
					>
						No active devices
					</p>
				</div>
			</section>

			<!-- Settings -->
			<section class="relative h-full w-[1208px] flex-shrink-0">
				<div class="absolute top-[496px] left-0 flex flex-col items-start pb-[8px]">
					<p class="text-[96px] leading-none tracking-[0.96px] whitespace-nowrap text-black">
						Settings
					</p>
					<p
						class="font-grotesk text-[36px] leading-none tracking-[0.36px] whitespace-nowrap text-[#333]"
					>
						Preferences & info
					</p>
				</div>
			</section>
		</div>
	</div>
</div>

<style>
	.nav-item {
		transition: font-variation-settings 350ms cubic-bezier(0.4, 0, 0.2, 1);
		font-variation-settings: 'wght' 400;
	}
	.nav-item.dragging {
		transition: none;
	}

	.screen-strip {
		transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1);
		will-change: transform;
	}
	.screen-strip.dragging {
		transition: none;
	}
</style>
