class PaginationStore {
	currentPage = $state(0);
	direction = $state<1 | -1>(1);
	totalPages = 4;

	goto(page: number) {
		this.direction = page > this.currentPage ? 1 : -1;
		this.currentPage = page;
	}

	next() {
		this.direction = 1;
		this.currentPage = (this.currentPage + 1) % this.totalPages;
	}

	prev() {
		this.direction = -1;
		this.currentPage = (this.currentPage - 1 + this.totalPages) % this.totalPages;
	}
}

export const pagination = new PaginationStore();
