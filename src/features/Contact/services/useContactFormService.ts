import { useRef, useState } from "react";
import { CONTACT_LIMITS, type ContactField } from "../../../constants/contactLimits";
import {
  CONTACT_FALLBACK_MESSAGE,
  ContactServiceError,
  contactService,
  type ContactFieldErrors,
} from "../../../services/contact.service";

export type ContactFormData = Record<ContactField, string> & {
  // Honeypot, hidden from real visitors.
  reference_code: string;
};

export type ContactNotice = { type: "success" | "error"; message: string };

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
  reference_code: "",
};

const FIELD_ORDER: ContactField[] = ["name", "email", "subject", "message"];

const SUCCESS_MESSAGE = "Message sent. We will reply to your email as soon as we can.";
const RATE_LIMIT_MESSAGE =
  "You have sent several messages recently. Please try again later.";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_MESSAGES: Record<ContactField, string> = {
  name: "Please enter your name.",
  email: "Please enter your email address.",
  subject: "Please enter a subject.",
  message: "Please enter a message.",
};

const TOO_LONG_MESSAGES: Record<ContactField, string> = {
  name: `Name must be ${CONTACT_LIMITS.name} characters or fewer.`,
  email: `Email must be ${CONTACT_LIMITS.email} characters or fewer.`,
  subject: `Subject must be ${CONTACT_LIMITS.subject} characters or fewer.`,
  message: `Message must be ${CONTACT_LIMITS.message} characters or fewer.`,
};

const validate = (data: ContactFormData): ContactFieldErrors => {
  const errors: ContactFieldErrors = {};

  for (const field of FIELD_ORDER) {
    const value = data[field].trim();

    if (!value) {
      errors[field] = EMPTY_MESSAGES[field];
    } else if (value.length > CONTACT_LIMITS[field]) {
      errors[field] = TOO_LONG_MESSAGES[field];
    } else if (field === "email" && !EMAIL_PATTERN.test(value)) {
      errors[field] = "Please enter a valid email address.";
    }
  }

  return errors;
};

const focusFirstInvalid = (form: HTMLFormElement, errors: ContactFieldErrors) => {
  const first = FIELD_ORDER.find((field) => errors[field]);
  if (!first) return;

  const control = form.elements.namedItem(first);
  if (control instanceof HTMLElement) control.focus();
};

export const useContactFormService = () => {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [notice, setNotice] = useState<ContactNotice | null>(null);
  const [isSending, setIsSending] = useState(false);
  // State updates are async, so a ref is what actually stops a double submit.
  const sendingRef = useRef(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const field = FIELD_ORDER.find((key) => key === name);
    const next = field ? value.slice(0, CONTACT_LIMITS[field]) : value;

    setFormData((prev) => ({ ...prev, [name]: next }));

    if (field) {
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    }

    // The confirmation belongs to the message that was just sent.
    setNotice((prev) => (prev?.type === "success" ? null : prev));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sendingRef.current) return;

    const form = e.currentTarget;
    const clientErrors = validate(formData);

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setNotice(null);
      focusFirstInvalid(form, clientErrors);
      return;
    }

    sendingRef.current = true;
    setIsSending(true);
    setErrors({});
    setNotice(null);

    try {
      await contactService.send({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        reference_code: formData.reference_code,
      });

      setFormData(INITIAL_FORM);
      setNotice({ type: "success", message: SUCCESS_MESSAGE });
    } catch (error) {
      const failure =
        error instanceof ContactServiceError
          ? error
          : new ContactServiceError("unknown", CONTACT_FALLBACK_MESSAGE);

      if (failure.kind === "validation" && Object.keys(failure.fields).length > 0) {
        setErrors(failure.fields);
        focusFirstInvalid(form, failure.fields);
      } else if (failure.kind === "rate_limited") {
        setNotice({ type: "error", message: RATE_LIMIT_MESSAGE });
      } else {
        setNotice({ type: "error", message: failure.message });
      }
    } finally {
      sendingRef.current = false;
      setIsSending(false);
    }
  };

  return { formData, errors, notice, isSending, handleChange, handleSubmit };
};
