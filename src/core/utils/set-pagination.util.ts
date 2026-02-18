export const setPagination = (
  totalItems: number,
  limit: number,
  page: number,
  total: number,
) => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems: totalItems,
    itemCount: total,
    itemsPerPage: limit,
    totalPages: totalPages,
    currentPage: page,
  };
};
