export type AuthEmailType =
  | "verify-email"
  | "forgot-password"
  | "welcome"
  | "password-reset-success";

export interface SendAuthEmailPayload {
  type: AuthEmailType;
  to: string;
  firstName?: string;
  verificationCode?: string;
  verifyUrl?: string;
  resetUrl?: string;
}

const EMAIL_ENDPOINT = `${import.meta.env.VITE_EMAIL_ENDPOINT ?? ""}/api/send-auth-email`;

export const authEmailService = {
  send: async (payload: SendAuthEmailPayload) => {
    const response = await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let message = "Unable to send email.";

      try {
        const errorPayload = (await response.json()) as { error?: string };
        if (typeof errorPayload.error === "string" && errorPayload.error.trim()) {
          message = errorPayload.error;
        }
      } catch {
        // Ignore JSON parse errors and keep fallback message.
      }

      throw new Error(message);
    }

    return (await response.json()) as { ok: boolean; id?: string | null };
  },
};
