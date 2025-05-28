export const getSearchParams = (url: URL, fields: string[]) => {
  const result: Record<string, string | null> = {};

  fields.forEach((field) => {
    result[field] = url.searchParams.get(field);
  });

  return result;
};
