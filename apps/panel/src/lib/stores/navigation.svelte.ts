const STEP_PX = 220;
const OVERSCROLL_DAMP = 0.45;
const OVERSCROLL_MAX_BONUS = 200;

class NavigationStore {
	activeIndex = $state(0);
	dragDx = $state(0);
	isDragging = $state(false);
	screenCount = $state(1);

	#touchStartX: number | null = null;

	setScreenCount(n: number) {
		this.screenCount = n;
		if (this.activeIndex > n - 1) this.activeIndex = Math.max(0, n - 1);
	}

	setActive(i: number) {
		this.activeIndex = Math.max(0, Math.min(this.screenCount - 1, i));
	}

	get progress() {
		const max = this.screenCount - 1;
		const raw = this.activeIndex + this.dragDx / STEP_PX;
		if (raw < 0) return raw * OVERSCROLL_DAMP;
		if (raw > max) return max + (raw - max) * OVERSCROLL_DAMP;
		return raw;
	}

	weightFor(i: number) {
		const max = this.screenCount - 1;
		const p = this.progress;
		if (p < 0 && i === 0) {
			const over = -p;
			return Math.round(700 + OVERSCROLL_MAX_BONUS * (1 - Math.exp(-over * 1.5)));
		}
		if (p > max && i === max) {
			const over = p - max;
			return Math.round(700 + OVERSCROLL_MAX_BONUS * (1 - Math.exp(-over * 1.5)));
		}
		const clamped = Math.max(0, Math.min(max, p));
		const dist = Math.abs(i - clamped);
		return Math.round(400 + 300 * Math.max(0, 1 - dist));
	}

	handleTouchStart = (e: TouchEvent) => {
		this.#touchStartX = e.touches[0].clientX;
		this.dragDx = 0;
		this.isDragging = true;
	};

	handleTouchMove = (e: TouchEvent) => {
		if (this.#touchStartX === null) return;
		this.dragDx = e.touches[0].clientX - this.#touchStartX;
	};

	handleTouchEnd = () => {
		if (this.#touchStartX === null) return;
		this.setActive(Math.round(this.progress));
		this.#touchStartX = null;
		this.dragDx = 0;
		this.isDragging = false;
	};
}

export const navigation = new NavigationStore();
