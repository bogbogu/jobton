import type { AxiosRequestConfig } from "axios";
import { privateAccess } from "./api";
import { checkResponseError } from "./checkResponseError";

export const mainFetch = async <TResponse>(
  url: string,
  config?: AxiosRequestConfig,
  fallbackMessage = "Unable to fetch data."
): Promise<TResponse> => {
  try {
    const response = await privateAccess.get<TResponse>(url, config);

    if (typeof response.data === "undefined") {
      throw new Error("Response data is missing.");
    }

    return response.data;
  } catch (error) {
    throw new Error(checkResponseError(error, fallbackMessage));
  }
};
