<script lang="ts">
	import { onMount } from 'svelte';
	import { CloudSnow, Cloud, Sun, CloudRain, Wind } from 'lucide-svelte';

	interface WeatherAlert {
		event: string;
		headline: string;
		start: string;
		end: string;
	}

	interface HourlyForecast {
		time: string;
		temp: number;
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
		alerts: WeatherAlert[];
		hourly: HourlyForecast[];
	}

	function getIconName(iconUrl: string | undefined): string {
		if (!iconUrl) return 'cloud';

		const descriptions = {
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

	const iconComponents: Record<string, any> = {
		sun: Sun,
		cloud: Cloud,
		'cloud-rain': CloudRain,
		'cloud-snow': CloudSnow,
		wind: Wind
	};

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

			const [forecastRes, hourlyRes, alertsRes] = await Promise.all([
				fetch(pointsData.properties.forecast),
				fetch(pointsData.properties.forecastHourly),
				fetch(`https://api.weather.gov/alerts/active?point=${LAT},${LON}`)
			]);

			if (!forecastRes.ok || !hourlyRes.ok) throw new Error('Failed to fetch forecast');

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

			const hourly: HourlyForecast[] = hourlyData.properties.periods.slice(0, 6).map((p: any) => {
				const date = new Date(p.startTime);
				return {
					time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
					temp: p.temperature,
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
				}),
				iconName: getIconName(current.icon),
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

	function formatAlertTime(isoString: string): string {
		const date = new Date(isoString);
		return date.toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZoneName: 'short'
		});
	}

	function formatWeatherIcon(iconName: string): string {
		const iconLabels: Record<string, string> = {
			sun: 'SUNNY',
			cloud: 'CLOUDY',
			'cloud-rain': 'RAIN',
			'cloud-snow': 'SNOW',
			wind: 'WINDY'
		};
		return iconLabels[iconName] || 'CLOUDY';
	}
</script>

<div class="flex w-full h-full gap-3 text-[#eae9e6]">
	{#if loading && !weather}
		<div class="flex-1 bg-[#211f1f] p-9 flex flex-col">
			<div class="text-sm opacity-70">Loading weather...</div>
		</div>
		<div class="flex-1 bg-[#211f1f] p-9 flex flex-col">
			<div class="text-sm opacity-70">Loading...</div>
		</div>
	{:else if error && !weather}
		<div class="flex-1 bg-[#211f1f] p-9 flex flex-col">
			<div class="text-red-500">{error}</div>
		</div>
		<div class="flex-1 bg-[#211f1f] p-9 flex flex-col"></div>
	{:else if weather}
		<div class="flex-1 bg-[#211f1f] p-9 flex flex-col relative">
			<div class="text-4xl font-medium mb-6">WEATHER</div>
			<div class="flex items-center gap-4 mb-12">
				<div class="flex-shrink-0">
					{#if weather.iconName === 'sun'}
						<Sun size={90} strokeWidth={1.5} />
					{:else if weather.iconName === 'cloud-rain'}
						<CloudRain size={90} strokeWidth={1.5} />
					{:else if weather.iconName === 'cloud-snow'}
						<CloudSnow size={90} strokeWidth={1.5} />
					{:else if weather.iconName === 'wind'}
						<Wind size={90} strokeWidth={1.5} />
					{:else}
						<Cloud size={90} strokeWidth={1.5} />
					{/if}
				</div>
				<div class="flex items-baseline">
					<span class="text-8xl font-bold leading-none">{weather.temp}°F</span>
					<span class="text-6xl font-bold leading-none">({weather.tempC}°C)</span>
				</div>
			</div>
			<div class="text-4xl leading-relaxed">
				{#if weather.humidity !== null}
					<p class="m-0"><span class="font-bold">Humidity</span> {weather.humidity}%</p>
				{/if}
				<p class="m-0"><span class="font-bold">Wind Speed</span> {weather.windDirection} {weather.windSpeed}</p>
				<p class="m-0"><span class="font-bold">Last updated</span> {weather.lastUpdated}</p>
			</div>
			{#if weather.alerts.length > 0}
				<div class="absolute bottom-9 left-9 right-9 bg-red-600/60 p-6 overflow-hidden">
					<div class="font-bold text-2xl mb-1">{weather.alerts[0].event.toUpperCase()}</div>
					<div class="text-2xl font-medium">
						{weather.alerts[0].event} in effect from {formatAlertTime(weather.alerts[0].start)} until {formatAlertTime(
							weather.alerts[0].end
						)}
					</div>
				</div>
			{/if}
		</div>
		<div class="flex-1 bg-[#211f1f] p-9 flex flex-col">
			<div class="text-4xl font-medium mb-6">HOURLY</div>
			<div class="flex flex-col">
				{#each weather.hourly as hour, i (hour.time)}
					<div class="flex items-center justify-between px-6 py-4 text-5xl overflow-hidden {i % 2 === 0 ? 'bg-white/5' : ''}">
						<span class="font-bold">{hour.time.toUpperCase().replace(' ', '')}</span>
						<span class="text-right font-medium">{hour.temp}° • {formatWeatherIcon(hour.iconName)}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

