import axios from "axios";

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const pickString = (obj: Record<string, unknown>, key: string) => {
  const value = obj[key];
  return typeof value === "string" ? value : null;
};

const extractMessageFromUnknown = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (Array.isArray(value)) {
    const messages = value
      .map((item) => extractMessageFromUnknown(item))
      .filter((item): item is string => Boolean(item));

    return messages.length ? messages.join(", ") : null;
  }

  if (isObject(value)) {
    const directMessage = pickString(value, "message") ?? pickString(value, "error");
    if (directMessage) return directMessage;

    const nestedMessage = extractMessageFromUnknown(value.errors);
    if (nestedMessage) return nestedMessage;

    const aggregated = Object.values(value)
      .map((item) => extractMessageFromUnknown(item))
      .filter((item): item is string => Boolean(item));

    return aggregated.length ? aggregated.join(", ") : null;
  }

  return null;
};

export const checkResponseError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const extracted = extractMessageFromUnknown(error.response?.data);
    if (extracted) return extracted;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
