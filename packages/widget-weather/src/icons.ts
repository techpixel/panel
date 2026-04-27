import {
	Cloud,
	CloudLightning,
	CloudRainWind,
	CloudSnow,
	CloudSun,
	Sun
} from 'lucide-svelte';
import type { WeatherCondition } from './types';

export const weatherIcons: Record<WeatherCondition, typeof Cloud> = {
	sunny: Sun,
	'partly-cloudy': CloudSun,
	cloudy: Cloud,
	rainy: CloudRainWind,
	snowy: CloudSnow,
	stormy: CloudLightning
};
