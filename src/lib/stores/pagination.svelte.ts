class PaginationStore {
	currentPage = $state(0);
	totalPages = 4;
}

export const pagination = new PaginationStore();
