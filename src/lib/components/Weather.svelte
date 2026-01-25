<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Cloud,
		CloudRain,
		Sun,
		CloudSnow,
		Wind,
		Droplets,
		Eye,
		Gauge
	} from 'lucide-svelte';

	interface WeatherAlert {
		event: string;
		headline: string;
		start: string;
		end: string;
	}

	interface HourlyForecast {
		time: string;
		temp: number;
		icon: string;
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
		icon: string;
		iconName: string;
		shortForecast: string;
		alerts: WeatherAlert[];
		hourly: HourlyForecast[];
	}

	function getIconName(iconUrl: string | undefined): string {
		if (!iconUrl) return 'cloud';

		const descriptions = {
			'sunny': 'sun',
			'clear': 'sun',
			'cloud': 'cloud',
			'cloudy': 'cloud',
			'rain': 'cloud-rain',
			'snow': 'cloud-snow',
			'sleet': 'cloud-snow',
			'thunder': 'cloud-rain',
			'blizzard': 'cloud-snow',
			'wind': 'wind'
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
		'sun': Sun,
		'cloud': Cloud,
		'cloud-rain': CloudRain,
		'cloud-snow': CloudSnow,
		'wind': Wind
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

			const forecastData = await forecastRes.json();
			const hourlyData = await hourlyRes.json();
			const alertsData = alertsRes.ok ? await alertsRes.json() : { features: [] };

			const current = hourlyData.properties.periods[0];
			const tempF = current.temperature;
			const tempC = Math.round((tempF - 32) * (5 / 9));

			const alerts: WeatherAlert[] = alertsData.features?.map((f: any) => ({
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
					icon: p.icon,
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
				icon: current.icon,
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
</script>

<div class="weather-panel">
	{#if loading && !weather}
		<div class="loading">Loading weather...</div>
	{:else if error && !weather}
		<div class="error">{error}</div>
	{:else if weather}
		<div class="weather-header">WEATHER</div>
		<div class="weather-main">
			<div class="temperature">
				<span class="temp-value">{weather.temp}°F</span>
				<span class="temp-celsius">({weather.tempC}°C)</span>
			</div>
			<div class="weather-icon">
				<svelte:component this={iconComponents[weather.iconName]} size={64} />
			</div>
		</div>
		<div class="weather-details">
			{#if weather.humidity !== null}
				<p><span class="label">Humidity</span> {weather.humidity}%</p>
			{/if}
			<p><span class="label">Wind Speed</span> {weather.windDirection} {weather.windSpeed}</p>
			<p><span class="label">Last updated</span> {weather.lastUpdated}</p>
		</div>
		<div class="divider"></div>
		<div class="hourly-section">
			<div class="hourly-header">HOURLY</div>
			<div class="hourly-table">
				{#each weather.hourly as hour, i}
					<div class="hourly-row" class:hourly-row-alt={i % 2 === 0}>
						<span class="hourly-time">{hour.time.toUpperCase()}</span>
						<span class="hourly-info">{hour.temp}° • {hour.shortForecast.toUpperCase()}</span>
					</div>
				{/each}
			</div>
		</div>
		{#if weather.alerts.length > 0}
			<div class="alert">
				<div class="alert-icon">
					<svg width="50" height="44" viewBox="0 0 60 53" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M30 5L55 48H5L30 5Z" stroke="currentColor" stroke-width="3"/>
						<path d="M30 20V32" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
						<circle cx="30" cy="40" r="2.5" fill="currentColor"/>
					</svg>
				</div>
				<div class="alert-content">
					<div class="alert-title">{weather.alerts[0].event.toUpperCase()}</div>
					<div class="alert-message">
						{weather.alerts[0].event} in effect from {formatAlertTime(weather.alerts[0].start)} until {formatAlertTime(weather.alerts[0].end)}
					</div>
				</div>
			</div>
		{/if}
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
		font-family: 'Space Mono';
		src: url('https://fonts.gstatic.com/s/spacemono/v12/i7dMIFZifjKcF5UAWdDRaPpZYFKQHg.woff2') format('woff2');
		font-weight: 700;
		font-style: normal;
		font-display: swap;
	}

	.weather-panel {
		background-color: #211f1f;
		width: 405px;
		height: 100%;
		padding: 24px;
		box-sizing: border-box;
		position: relative;
		font-family: 'Space Mono', monospace;
		color: #EAE9E6;
	}

	.loading,
	.error {
		font-size: 14px;
		opacity: 0.7;
	}

	.error {
		color: #ff6b6b;
	}

	.weather-header {
		font-size: 16px;
		margin-bottom: 8px;
	}

	.weather-main {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.temperature {
		display: flex;
		align-items: baseline;
	}

	.temp-value {
		font-size: 48px;
		font-weight: bold;
	}

	.temp-celsius {
		font-size: 24px;
		font-weight: bold;
	}

	.weather-icon {
		margin-top: 4px;
		display: flex;
		align-items: center;
		color: #EAE9E6;
	}

	.weather-details {
		font-size: 12px;
		line-height: 1.5;
	}

	.weather-details p {
		margin: 0;
	}

	.weather-details .label {
		font-weight: bold;
	}

	.divider {
		width: 357px;
		height: 1px;
		background-color: #EAE9E6;
		margin: 24px 0 12px 0;
	}

	.hourly-section {
		font-size: 12px;
	}

	.hourly-header {
		margin-bottom: 8px;
	}

	.hourly-table {
		display: flex;
		flex-direction: column;
	}

	.hourly-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 4px;
		font-size: 16px;
	}

	.hourly-row-alt {
		background-color: rgba(234, 233, 230, 0.05);
	}

	.hourly-time {
		font-weight: bold;
	}

	.hourly-info {
		text-align: right;
		width: 200px;
	}

	.alert {
		position: absolute;
		bottom: 24px;
		left: 24px;
		right: 24px;
		background-color: rgba(255, 0, 0, 0.2);
		min-height: 90px;
		display: flex;
		align-items: center;
		padding: 12px 16px;
		overflow: hidden;
		box-sizing: border-box;
	}

	.alert-icon {
		color: rgba(234, 233, 230, 0.6);
		margin-right: 12px;
		flex-shrink: 0;
	}

	.alert-content {
		font-size: 10px;
		line-height: 1.4;
	}

	.alert-title {
		font-weight: bold;
		margin-bottom: 4px;
	}

	.alert-message {
		opacity: 0.9;
	}
</style>
