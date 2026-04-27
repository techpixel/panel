<script lang="ts">
	import { onMount } from 'svelte';
	import { CloudSnow, Cloud, Sun, CloudRain, Wind, Droplet } from 'lucide-svelte';

	interface WeatherAlert {
		event: string;
		headline: string;
		start: string;
		end: string;
	}

	interface HourlyForecast {
		time: string;
		temp: number;
		tempC: number;
		shortForecast: string;
		iconName: string;
	}

	interface WeatherData {
		temp: number;
		tempC: number;
		humidity: number | null;
		windSpeed: string;
		windDirection: string;
		lastUpdated: string;
		iconName: string;
		shortForecast: string;
		alerts: WeatherAlert[];
		hourly: HourlyForecast[];
	}

	function getIconName(iconUrl: string | undefined): string {
		if (!iconUrl) return 'cloud';

		const descriptions: Record<string, string> = {
			sunny: 'sun',
			clear: 'sun',
			cloud: 'cloud',
			cloudy: 'cloud',
			rain: 'cloud-rain',
			snow: 'cloud-snow',
			sleet: 'cloud-snow',
			thunder: 'cloud-rain',
			blizzard: 'cloud-snow',
			wind: 'wind'
		};

		const lowerUrl = iconUrl.toLowerCase();
		for (const [key, iconName] of Object.entries(descriptions)) {
			if (lowerUrl.includes(key)) {
				return iconName;
			}
		}

		return 'cloud';
	}

	let weather: WeatherData | null = $state(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	const LAT = 44.379153;
	const LON = -73.228115;

	async function fetchWeather() {
		try {
			loading = true;
			error = null;

			const pointsRes = await fetch(`https://api.weather.gov/points/${LAT},${LON}`);
			if (!pointsRes.ok) throw new Error('Failed to fetch location data');
			const pointsData = await pointsRes.json();

			const [hourlyRes, alertsRes] = await Promise.all([
				fetch(pointsData.properties.forecastHourly),
				fetch(`https://api.weather.gov/alerts/active?point=${LAT},${LON}`)
			]);

			if (!hourlyRes.ok) throw new Error('Failed to fetch forecast');

			const hourlyData = await hourlyRes.json();
			const alertsData = alertsRes.ok ? await alertsRes.json() : { features: [] };

			const current = hourlyData.properties.periods[0];
			const tempF = current.temperature;
			const tempC = Math.round((tempF - 32) * (5 / 9));

			const alerts: WeatherAlert[] =
				alertsData.features?.map((f: any) => ({
					event: f.properties.event,
					headline: f.properties.headline,
					start: f.properties.effective,
					end: f.properties.expires
				})) || [];

			const hourly: HourlyForecast[] = hourlyData.properties.periods.slice(1, 7).map((p: any) => {
				const date = new Date(p.startTime);
				return {
					time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).toUpperCase().replace(' ', ''),
					temp: p.temperature,
					tempC: Math.round((p.temperature - 32) * (5 / 9)),
					shortForecast: p.shortForecast,
					iconName: getIconName(p.icon)
				};
			});

			weather = {
				temp: tempF,
				tempC,
				humidity: current.relativeHumidity?.value ?? null,
				windSpeed: current.windSpeed,
				windDirection: current.windDirection,
				lastUpdated: new Date().toLocaleTimeString('en-US', {
					hour: 'numeric',
					minute: '2-digit',
					hour12: true,
					timeZoneName: 'short'
				}).toLowerCase(),
				iconName: getIconName(current.icon),
				shortForecast: current.shortForecast,
				alerts,
				hourly
			};
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to fetch weather';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchWeather();
		const interval = setInterval(fetchWeather, 10 * 60 * 1000);
		return () => clearInterval(interval);
	});
</script>

<div class="w-full h-full relative" style="background: linear-gradient(180deg, #737373 0%, #1d6186 100%);">
	<!-- Content -->
	<div class="relative h-full p-[36px] pt-[92px] pb-[112px] flex flex-col justify-end">
		{#if loading && !weather}
			<div class="font-serif text-white text-[40px]">Loading weather...</div>
		{:else if error && !weather}
			<div class="font-serif text-red-400 text-[40px]">{error}</div>
		{:else if weather}
			<div class="flex gap-[48px] items-end">
				<!-- Left: Weather Info -->
				<div class="flex-1 flex flex-col gap-[36px] justify-end">
					<!-- Weather Top -->
					<div class="flex flex-col gap-[4px]">
						<div class="font-serif text-[#d7d7d7] text-[40px] leading-tight">
							Burlington, Vermont
						</div>
						<div class="flex gap-[16px] items-center">
							<div class="w-[80px] h-[80px] text-white shrink-0">
								{#if weather.iconName === 'sun'}
									<Sun size={80} strokeWidth={1.5} />
								{:else if weather.iconName === 'cloud-rain'}
									<CloudRain size={80} strokeWidth={1.5} />
								{:else if weather.iconName === 'cloud-snow'}
									<CloudSnow size={80} strokeWidth={1.5} />
								{:else if weather.iconName === 'wind'}
									<Wind size={80} strokeWidth={1.5} />
								{:else}
									<Cloud size={80} strokeWidth={1.5} />
								{/if}
							</div>
							<div class="font-serif text-white whitespace-nowrap leading-none">
								<span class="text-[128px]">{weather.temp}°F</span><span class="text-[64px]">({weather.tempC}°C)</span>
							</div>
						</div>
						<div class="font-serif text-white text-[40px] leading-tight">
							{weather.shortForecast}
						</div>
					</div>

					<!-- Weather Detail -->
					<div class="flex flex-col gap-[10px]">
						{#if weather.humidity !== null}
							<div class="flex gap-[10px] items-center">
								<div class="text-[#eae9e6]">
									<Droplet size={36} strokeWidth={1.5} />
								</div>
								<span class="font-serif text-[#eae9e6] text-[32px] leading-tight">{weather.humidity}%</span>
							</div>
						{/if}
						<div class="flex gap-[10px] items-center">
							<div class="text-[#eae9e6]">
								<Wind size={36} strokeWidth={1.5} />
							</div>
							<span class="font-serif text-[#eae9e6] text-[32px] leading-tight">{weather.windDirection} {weather.windSpeed}</span>
						</div>
					</div>

					<div class="font-serif text-[#ccc] text-[32px] leading-tight">
						Last updated {weather.lastUpdated}
					</div>
				</div>

				<!-- Right: Hourly Card -->
				{#if weather.hourly.length > 0}
					<div class="w-[480px] liquid-glass rounded-[16px] p-[20px] flex flex-col gap-[16px]">
						<div class="font-serif text-white text-[24px] leading-none">Hourly</div>
						<div class="flex flex-col">
							{#each weather.hourly as hour, i}
								<div class="flex items-center justify-between py-[12px] px-[16px] rounded-[8px] {i % 2 === 0 ? 'bg-white/20' : ''}">
									<span class="font-semibold text-white text-[36px]">{hour.time}</span>
									<div class="flex items-center gap-[12px] text-white">
										<span class="font-serif text-[36px]">{hour.temp}°F ({hour.tempC}°C)</span>
										<div class="w-[28px] h-[28px]">
											{#if hour.iconName === 'sun'}
												<Sun size={28} strokeWidth={1.5} />
											{:else if hour.iconName === 'cloud-rain'}
												<CloudRain size={28} strokeWidth={1.5} />
											{:else if hour.iconName === 'cloud-snow'}
												<CloudSnow size={28} strokeWidth={1.5} />
											{:else if hour.iconName === 'wind'}
												<Wind size={28} strokeWidth={1.5} />
											{:else}
												<Cloud size={28} strokeWidth={1.5} />
											{/if}
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
