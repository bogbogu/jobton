import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "Jobton <onboarding@resend.dev>";
const appBaseUrl = process.env.APP_BASE_URL || "https://jobton-frontend.vercel.app";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const json = (status, body) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const emailTemplates = {
  "verify-email": ({ firstName, verificationCode, verifyUrl }) => ({
    subject: "Verify your Jobton email",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Verify your email</h2>
        <p>Hi ${escapeHtml(firstName || "there")},</p>
        <p>Use this verification code to activate your account:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 2px; margin: 16px 0;">${escapeHtml(verificationCode || "")}</p>
        <p>Or click this link:</p>
        <p><a href="${escapeHtml(verifyUrl || `${appBaseUrl}/verify-email`)}">Verify Email</a></p>
      </div>
    `,
  }),
  "forgot-password": ({ firstName, resetUrl }) => ({
    subject: "Reset your Jobton password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Password reset request</h2>
        <p>Hi ${escapeHtml(firstName || "there")},</p>
        <p>Click the button below to reset your password:</p>
        <p>
          <a href="${escapeHtml(resetUrl || `${appBaseUrl}/reset-password`)}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 8px;">
            Reset Password
          </a>
        </p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  }),
  welcome: ({ firstName }) => ({
    subject: "Welcome to Jobton",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Welcome to Jobton</h2>
        <p>Hi ${escapeHtml(firstName || "there")},</p>
        <p>Your account is ready. Discover jobs, build your profile, and connect with great opportunities.</p>
        <p><a href="${escapeHtml(`${appBaseUrl}/jobs`)}">Explore Jobs</a></p>
      </div>
    `,
  }),
  "password-reset-success": ({ firstName }) => ({
    subject: "Your Jobton password was updated",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Password updated</h2>
        <p>Hi ${escapeHtml(firstName || "there")},</p>
        <p>Your password was reset successfully. If this was not you, contact support immediately.</p>
      </div>
    `,
  }),
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    if (res) {
      return res.status(405).json({ error: "Method not allowed" });
    }
    return json(405, { error: "Method not allowed" });
  }

  if (!resend) {
    if (res) {
      return res.status(500).json({ error: "RESEND_API_KEY is not configured." });
    }
    return json(500, { error: "RESEND_API_KEY is not configured." });
  }

  try {
    const body = req.body || {};
    const { type, to, firstName, verificationCode, verifyUrl, resetUrl } = body;

    if (!type || !to) {
      if (res) {
        return res.status(400).json({ error: "Both type and to are required." });
      }
      return json(400, { error: "Both type and to are required." });
    }

    const templateBuilder = emailTemplates[type];
    if (!templateBuilder) {
      if (res) {
        return res.status(400).json({ error: "Unsupported email type." });
      }
      return json(400, { error: "Unsupported email type." });
    }

    const template = templateBuilder({
      firstName,
      verificationCode,
      verifyUrl,
      resetUrl,
    });

    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject: template.subject,
      html: template.html,
    });

    if (res) {
      return res.status(200).json({ ok: true, id: result.data?.id || null });
    }

    return json(200, { ok: true, id: result.data?.id || null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email.";

    if (res) {
      return res.status(500).json({ error: message });
    }

    return json(500, { error: message });
  }
}
