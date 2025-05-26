export type SetStateAction<T> = React.Dispatch<React.SetStateAction<T>>;

export type CreatedByOptimisticUpdateType = boolean | undefined;

export interface CreatedByOptimisticUpdate {
  createdByOptimisticUpdate: CreatedByOptimisticUpdateType;
}
