import type { WeatherCondition } from './types';

export const weatherGradients: Record<WeatherCondition, string> = {
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
