import { StandardizeResponse } from "../utils/createResponse";

export interface EagerUpdaterResult<T> {
  oldData: StandardizeResponse<T>;
  newData: StandardizeResponse<T>;
  queryKey: string[];
}
