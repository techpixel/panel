export type StatusValue = 'busy' | 'free';

export interface StatusSettings {
	initialStatus?: StatusValue;
	initialEndsInMin?: number;
}
