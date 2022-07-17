import { retryLogic } from "./retry-logic";
import { httpClient } from "./tuya-client";

export const httpClientFactory = (...args) => {
  return retryLogic(httpClient, ...args);
};
