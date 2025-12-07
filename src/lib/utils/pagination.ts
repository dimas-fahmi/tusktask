const DEFAULT_LIMIT = 20;
export const getLimitAndOffset = (
  page: number,
  limit?: number,
): { limit: number; offset: number } => {
  const lmt = limit ?? DEFAULT_LIMIT;
  return {
    limit: lmt,
    offset: (page - 1) * lmt,
  };
};

export const getTotalPages = (totalItem: number, limit?: number) => {
  const lmt = limit ?? DEFAULT_LIMIT;
  return Math.ceil(totalItem / lmt);
};
