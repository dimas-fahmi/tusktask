export const normalizeDateFields = (
  body: Record<string, any>,
  dateFields: string[]
) => {
  dateFields.forEach((field) => {
    if (body[field] && typeof body[field] === "string") {
      body[field] = new Date(body[field]);
    }
  });
  return body;
};
