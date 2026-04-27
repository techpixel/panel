export interface NewsHeadline {
	source: string;
	title: string;
}

export interface NewsSettings {
	headlines?: NewsHeadline[];
}
