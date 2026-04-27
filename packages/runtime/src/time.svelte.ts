class TimeStore {
	now = $state(new Date());

	constructor() {
		if (typeof window !== 'undefined') {
			setInterval(() => (this.now = new Date()), 1000);
		}
	}

	get label() {
		const h = this.now.getHours() % 12 || 12;
		const m = String(this.now.getMinutes()).padStart(2, '0');
		const ap = this.now.getHours() >= 12 ? 'pm' : 'am';
		return `${h}:${m}${ap}`;
	}

	get clockHourMinute() {
		const h = this.now.getHours() % 12 || 12;
		const m = String(this.now.getMinutes()).padStart(2, '0');
		const ap = this.now.getHours() >= 12 ? 'pm' : 'am';
		return `${h}:${m} ${ap}`;
	}
}

export const time = new TimeStore();
