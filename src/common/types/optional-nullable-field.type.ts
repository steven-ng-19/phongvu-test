export type OptionalNullableFields<T> = {
  [K in keyof T]?: T[K] | null;
};
