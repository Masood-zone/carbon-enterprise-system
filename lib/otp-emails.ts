type OtpEmailType = "forget-password" | "email-verification" | "sign-in"

type BuildOtpEmailArgs = {
  appName: string
  appUrl: string
  email: string
  otp: string
  type: OtpEmailType | string
  expiresInMinutes?: number
}

type BuildPasswordResetSuccessEmailArgs = {
  appName: string
  appUrl: string
  email: string
  recipientName?: string
  resetAt?: Date
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    if (character === "&") return "&amp;"
    if (character === "<") return "&lt;"
    if (character === ">") return "&gt;"
    if (character === '"') return "&quot;"
    return "&#39;"
  })
}

function buildBrandHeader(appName: string) {
  return `
    <div style="align-items: center; display: flex; gap: 12px; margin-bottom: 24px;">
      <div aria-hidden="true" style="width: 44px; height: 44px; background: linear-gradient(135deg, #2d313a 0%, #0f62fe 100%); clip-path: polygon(50% 0%, 92% 24%, 92% 76%, 50% 100%, 8% 76%, 8% 24%);"></div>
      <div>
        <div style="font-size: 18px; font-weight: 700; letter-spacing: -0.02em;">Carbon</div>
        <div style="color: #525252; font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase;">${escapeHtml(appName)}</div>
      </div>
    </div>
  `
}

function buildFooterNote({
  appName,
  message,
}: {
  appName: string
  message: string
}) {
  return `
    <p style="color: #525252; font-size: 12px; margin: 16px 0 0;">
      ${escapeHtml(message)} Sent from ${escapeHtml(appName)}.
    </p>
  `
}

function getOtpMeta(type: string) {
  const normalized = type.toLowerCase()

  if (normalized === "forget-password") {
    return {
      eyebrow: "Password recovery",
      title: "Your password reset code",
      lead: "Use the six-digit code below to continue resetting your password.",
      subject: "Password reset code",
      securityNote:
        "If you did not request a password reset, you can safely ignore this email. Your password will not change.",
    }
  }

  if (normalized === "email-verification") {
    return {
      eyebrow: "Verify your email",
      title: "Your verification code",
      lead: "Use the six-digit code below to confirm your email address.",
      subject: "Verify your email",
      securityNote:
        "If you did not request this code, you can safely ignore this email.",
    }
  }

  return {
    eyebrow: "Secure sign-in",
    title: "Your sign-in code",
    lead: "Use the six-digit code below to complete sign-in.",
    subject: "Your sign-in code",
    securityNote:
      "If you did not request this code, you can safely ignore this email.",
  }
}

export function buildOtpEmail({
  appName,
  appUrl,
  email,
  otp,
  type,
  expiresInMinutes = 15,
}: BuildOtpEmailArgs) {
  const colors = {
    background: "#edf2ff",
    card: "#ffffff",
    border: "#dbe4ff",
    foreground: "#111827",
    muted: "#6b7280",
    primary: "#0f62fe",
    primaryForeground: "#ffffff",
  }

  const meta = getOtpMeta(type)
  const safeOtp = escapeHtml(otp)
  const safeEmail = escapeHtml(email)
  const safeAppUrl = escapeHtml(appUrl.replace(/\/$/, ""))
  const actionUrl = `${appUrl.replace(/\/$/, "")}/login`

  const html = `
    <div style="background: radial-gradient(circle at top left, rgba(15,98,254,0.08), transparent 28%), linear-gradient(180deg, ${colors.background}, #f8fafc 60%); color: ${colors.foreground}; font-family: Inter, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.5; margin: 0; padding: 32px 16px;">
      <div style="margin: 0 auto; max-width: 640px;">
        ${buildBrandHeader(appName)}

        <div style="background-color: ${colors.card}; border: 1px solid ${colors.border}; border-radius: 18px; box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08); overflow: hidden;">
          <div style="background: linear-gradient(135deg, rgba(15,98,254,0.14), rgba(15,98,254,0.04)); border-bottom: 1px solid ${colors.border}; padding: 24px 28px;">
            <div style="color: ${colors.primary}; font-size: 11px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;">${escapeHtml(meta.eyebrow)}</div>
            <h1 style="font-size: 30px; line-height: 1.1; margin: 12px 0 10px;">${escapeHtml(meta.title)}</h1>
            <p style="color: ${colors.muted}; font-size: 16px; margin: 0;">${escapeHtml(meta.lead)}</p>
          </div>

          <div style="padding: 28px;">
            <div style="border: 1px solid ${colors.border}; border-radius: 14px; margin-bottom: 20px; overflow: hidden;">
              <div style="background-color: #f8fbff; border-bottom: 1px solid ${colors.border}; color: ${colors.primary}; font-size: 11px; font-weight: 700; letter-spacing: 0.24em; padding: 12px 16px; text-transform: uppercase;">
                Verification code
              </div>
              <div style="background-color: #ffffff; padding: 22px 16px; text-align: center;">
                <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 32px; font-weight: 700; letter-spacing: 0.28em; line-height: 1;">${safeOtp}</div>
                <div style="color: ${colors.muted}; font-size: 13px; margin-top: 12px;">This code expires in ${escapeHtml(String(expiresInMinutes))} minutes and can be used once.</div>
              </div>
            </div>

            <div style="display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 22px;">
              <div style="background-color: #f8fafc; border: 1px solid ${colors.border}; border-radius: 14px; padding: 16px;">
                <div style="color: ${colors.primary}; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; margin-bottom: 8px; text-transform: uppercase;">Security</div>
                <div style="color: ${colors.muted}; font-size: 13px;">${escapeHtml(meta.securityNote)}</div>
              </div>
              <div style="background-color: #f8fafc; border: 1px solid ${colors.border}; border-radius: 14px; padding: 16px;">
                <div style="color: ${colors.primary}; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; margin-bottom: 8px; text-transform: uppercase;">Need help?</div>
                <div style="color: ${colors.muted}; font-size: 13px;">If you need assistance, open your workspace or contact your administrator.</div>
              </div>
            </div>

            <a href="${escapeHtml(actionUrl)}" style="background-color: ${colors.primary}; border-radius: 12px; color: ${colors.primaryForeground}; display: inline-block; font-size: 14px; font-weight: 700; padding: 14px 22px; text-decoration: none;">Open Carbon</a>
          </div>
        </div>

        ${buildFooterNote({
          appName,
          message: `This message was intended for ${safeEmail}. If you were not expecting it, you can ignore it and continue using ${safeAppUrl}.`,
        })}
      </div>
    </div>
  `

  const text = [
    `${meta.subject} - ${appName}`,
    "",
    meta.lead,
    "",
    `Code: ${otp}`,
    `Expires in: ${expiresInMinutes} minutes`,
    "",
    meta.securityNote,
    "",
    `Open Carbon: ${actionUrl}`,
  ].join("\n")

  return {
    subject: `${meta.subject} - ${appName}`,
    html,
    text,
  }
}

export function buildPasswordResetSuccessEmail({
  appName,
  appUrl,
  email,
  recipientName,
  resetAt = new Date(),
}: BuildPasswordResetSuccessEmailArgs) {
  const colors = {
    background: "#f5f7fb",
    card: "#ffffff",
    border: "#dde3ee",
    foreground: "#111827",
    muted: "#6b7280",
    primary: "#0f62fe",
    success: "#0f766e",
    successSoft: "#ecfdf5",
    primaryForeground: "#ffffff",
  }

  const safeName = recipientName?.trim()
    ? escapeHtml(recipientName.trim())
    : "there"
  const safeEmail = escapeHtml(email)
  const loginUrl = `${appUrl.replace(/\/$/, "")}/login`
  const formattedResetAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(resetAt)

  const html = `
    <div style="background: radial-gradient(circle at top right, rgba(15,118,110,0.08), transparent 30%), linear-gradient(180deg, ${colors.background}, #ffffff 70%); color: ${colors.foreground}; font-family: Inter, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.5; margin: 0; padding: 32px 16px;">
      <div style="margin: 0 auto; max-width: 640px;">
        ${buildBrandHeader(appName)}

        <div style="background-color: ${colors.card}; border: 1px solid ${colors.border}; border-radius: 18px; box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08); overflow: hidden;">
          <div style="background: linear-gradient(135deg, rgba(15,118,110,0.14), rgba(15,98,254,0.05)); border-bottom: 1px solid ${colors.border}; padding: 24px 28px;">
            <div style="color: ${colors.success}; font-size: 11px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;">Password updated</div>
            <h1 style="font-size: 30px; line-height: 1.1; margin: 12px 0 10px;">Your password was changed successfully</h1>
            <p style="color: ${colors.muted}; font-size: 16px; margin: 0;">${safeName}, your Carbon account password was updated at ${escapeHtml(formattedResetAt)}.</p>
          </div>

          <div style="padding: 28px;">
            <div style="background-color: ${colors.successSoft}; border: 1px solid rgba(15,118,110,0.18); border-radius: 14px; margin-bottom: 20px; padding: 18px;">
              <div style="color: ${colors.success}; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; margin-bottom: 8px; text-transform: uppercase;">Account security</div>
              <div style="color: ${colors.foreground}; font-size: 14px;">If this was you, no further action is required. You can sign in with your new password right away.</div>
            </div>

            <div style="display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 22px;">
              <div style="background-color: #f8fafc; border: 1px solid ${colors.border}; border-radius: 14px; padding: 16px;">
                <div style="color: ${colors.primary}; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; margin-bottom: 8px; text-transform: uppercase;">Account</div>
                <div style="font-size: 14px; font-weight: 700; margin-bottom: 4px;">${safeEmail}</div>
                <div style="color: ${colors.muted}; font-size: 13px;">This email is now tied to the new password.</div>
              </div>
              <div style="background-color: #f8fafc; border: 1px solid ${colors.border}; border-radius: 14px; padding: 16px;">
                <div style="color: ${colors.primary}; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; margin-bottom: 8px; text-transform: uppercase;">Next step</div>
                <div style="color: ${colors.muted}; font-size: 13px;">Sign in and continue to your dashboard or workspace.</div>
              </div>
            </div>

            <a href="${escapeHtml(loginUrl)}" style="background-color: ${colors.primary}; border-radius: 12px; color: ${colors.primaryForeground}; display: inline-block; font-size: 14px; font-weight: 700; padding: 14px 22px; text-decoration: none;">Sign in to Carbon</a>
          </div>
        </div>

        ${buildFooterNote({
          appName,
          message: `If you did not make this change, contact your administrator or security team immediately and secure your account.`,
        })}
      </div>
    </div>
  `

  const text = [
    `Password updated successfully - ${appName}`,
    "",
    `Hi ${recipientName?.trim() || "there"},`,
    `Your password for ${appName} was updated at ${formattedResetAt}.`,
    "",
    "If this was you, no further action is required.",
    `Sign in: ${loginUrl}`,
    "",
    "If you did not make this change, contact your administrator or security team immediately.",
  ].join("\n")

  return {
    subject: `Password updated successfully - ${appName}`,
    html,
    text,
  }
}
