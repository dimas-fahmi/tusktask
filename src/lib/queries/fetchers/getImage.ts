import type {
  V1ImageGetRequest,
  V1ImageGetResponse,
} from "@/app/api/v1/image/get";
import { objectToQueryString } from "../../utils/objectToQueryString";

export async function getImage(
  req: V1ImageGetRequest,
): Promise<V1ImageGetResponse> {
  const queryString = objectToQueryString(req);
  const response = await fetch(`/api/v1/image?${queryString}`);
  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}
