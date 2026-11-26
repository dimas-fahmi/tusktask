import type { BaseUIEvent as _BaseUIEvent } from "@base-ui/react";
import type { SyntheticEvent } from "react";

export type BaseUIEvent<TElement extends HTMLElement = HTMLButtonElement> =
  _BaseUIEvent<SyntheticEvent<TElement, MouseEvent>>;

export type OptimisticUpdateState<TData = unknown> = {
  oldData: TData | undefined;
  queryKey: unknown[];
} | null;
