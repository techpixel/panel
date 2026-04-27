export type WeatherCondition =
	| 'sunny'
	| 'partly-cloudy'
	| 'cloudy'
	| 'rainy'
	| 'snowy'
	| 'stormy';

export interface WeatherSnapshot {
	condition: WeatherCondition;
	tempF: number;
	tempC: number;
	description: string;
	humidity: number;
	wind: string;
}

export interface WeatherSettings {
	location: string;
	initialSnapshot?: WeatherSnapshot;
}
