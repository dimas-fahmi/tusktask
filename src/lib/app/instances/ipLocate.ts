import IPLocate from "node-iplocate";

const IPLocateKey = process.env.IPLOCATE_API_KEY;

if (!IPLocateKey) {
  throw new Error("IPLOCATE_API_KEY_IS_UNAVAILABLE");
}

export const ipLocateClient = new IPLocate(IPLocateKey);
