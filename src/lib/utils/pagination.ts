const DEFAULT_LIMIT = 20;

export const validateLimit = (limit?: number) => {
  return (
    limit && typeof limit === "number" && Number.isFinite(limit) && limit > 0
  );
};

export const getLimitAndOffset = (
  page: number,
  limit?: number,
): { limit: number; offset: number } => {
  const isLimitValid = validateLimit(limit);

  const lmt = isLimitValid && limit ? limit : DEFAULT_LIMIT;
  return {
    limit: lmt,
    offset: (page - 1) * lmt,
  };
};

export const getTotalPages = (totalItem: number, limit?: number) => {
  const isLimitValid = validateLimit(limit);
  const lmt = isLimitValid && limit ? limit : DEFAULT_LIMIT;
  return Math.ceil(totalItem / lmt);
};
