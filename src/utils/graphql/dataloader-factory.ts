import DataLoader from "dataloader";

export const dataLoaderFactory = <T1, T2>(dlFunc) =>
  new DataLoader<T1, T2>(dlFunc, { cache: true });
