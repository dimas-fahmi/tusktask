export const parseRequestBody = async <T>(req: Request): Promise<T | null> => {
  try {
    return await req.json();
  } catch (e) {
    return null;
  }
};
