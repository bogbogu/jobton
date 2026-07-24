import type { AxiosRequestConfig } from "axios";
import { privateAccess } from "./api";
import { checkResponseError } from "./checkResponseError";

export const mainPut = async <TResponse, TPayload = unknown>(
  url: string,
  payload?: TPayload,
  config?: AxiosRequestConfig,
  fallbackMessage = "Unable to update data."
): Promise<TResponse> => {
  try {
    const response = await privateAccess.put<TResponse>(url, payload, config);

    if (typeof response.data === "undefined") {
      throw new Error("Response data is missing.");
    }

    return response.data;
  } catch (error) {
    throw new Error(checkResponseError(error, fallbackMessage));
  }
};
