// Character limits for the Contact form. The backend (POST /api/contact)
// enforces the same numbers, so keep the two in step.
export const CONTACT_LIMITS = {
  name: 80,
  email: 254,
  subject: 120,
  message: 2000,
} as const;

export type ContactField = keyof typeof CONTACT_LIMITS;

export const CONTACT_FIELDS = Object.keys(CONTACT_LIMITS) as ContactField[];
