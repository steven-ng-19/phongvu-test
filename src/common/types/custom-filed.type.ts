export type OptionalNullableFields<T> = {
  [K in keyof T]?: T[K] | null;
};

export type EntityWithoutFields<T, K extends keyof T> = Omit<T, K>;

export type EntityNotInFilter<T> = {
  [K in keyof T]?: T[K][];
};
