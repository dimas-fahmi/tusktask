export async function getIpInformation(ip: string) {
  const response = await fetch(
    `/api/v1/ip/lookup?ip=${encodeURIComponent(ip)}`,
    {
      method: "GET",
      next: {
        revalidate: 60 * 60 * 24 * 2,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
