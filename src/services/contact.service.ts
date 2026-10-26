import axios from "axios";
import { CONTACT_FIELDS, type ContactField } from "../constants/contactLimits";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  // Honeypot: real visitors leave this empty.
  reference_code: string;
}

export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ContactErrorKind =
  | "validation"
  | "rate_limited"
  | "invalid_input"
  | "unknown";

export const CONTACT_FALLBACK_MESSAGE =
  "We could not send your message. Please try again, or email info@jobton.com.ng.";

// Public endpoint: a plain client with no interceptors, so the visitor's login
// token (added by the shared client) is never sent here.
const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  headers: { "Content-Type": "application/json" },
});

// mainPost flattens failures into a bare Error, which loses the status code and
// the per-field validation errors this form needs. So the call goes through the
// client above directly and the failure is classified here.
export class ContactServiceError extends Error {
  readonly kind: ContactErrorKind;
  readonly fields: ContactFieldErrors;

  constructor(kind: ContactErrorKind, message: string, fields: ContactFieldErrors = {}) {
    super(message);
    this.name = "ContactServiceError";
    this.kind = kind;
    this.fields = fields;
  }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readFieldErrors = (value: unknown): ContactFieldErrors => {
  if (!isObject(value)) return {};

  const fields: ContactFieldErrors = {};
  for (const field of CONTACT_FIELDS) {
    const entry = value[field];
    if (typeof entry === "string" && entry.trim()) {
      fields[field] = entry;
    }
  }
  return fields;
};

const toContactError = (error: unknown): ContactServiceError => {
  if (!axios.isAxiosError(error) || !error.response) {
    return new ContactServiceError("unknown", CONTACT_FALLBACK_MESSAGE);
  }

  const { status, data } = error.response;
  const body = isObject(data) ? data : {};
  const code = typeof body.error === "string" ? body.error : "";
  const serverMessage =
    typeof body.message === "string" && body.message.trim() ? body.message : "";

  if (status === 429 || code === "RATE_LIMITED") {
    return new ContactServiceError(
      "rate_limited",
      serverMessage || CONTACT_FALLBACK_MESSAGE
    );
  }

  if (status === 400 && code === "VALIDATION_ERROR") {
    return new ContactServiceError(
      "validation",
      serverMessage || "Please check the highlighted fields.",
      readFieldErrors(body.fields)
    );
  }

  if (status === 400 && code === "INVALID_INPUT") {
    return new ContactServiceError("invalid_input", CONTACT_FALLBACK_MESSAGE);
  }

  return new ContactServiceError("unknown", serverMessage || CONTACT_FALLBACK_MESSAGE);
};

export const contactService = {
  send: async (payload: ContactPayload) => {
    try {
      const response = await publicClient.post<{ message: string }>(
        "/api/contact",
        payload
      );
      return response.data;
    } catch (error) {
      throw toContactError(error);
    }
  },
};
