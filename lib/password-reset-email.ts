function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    if (character === "&") return "&amp;"
    if (character === "<") return "&lt;"
    if (character === ">") return "&gt;"
    if (character === '"') return "&quot;"
    return "&#39;"
  })
}

type BuildPasswordResetRequestEmailArgs = {
  appName: string
  appUrl: string
  email: string
  recipientName?: string
  resetUrl: string
  expiresInMinutes?: number
}

export function buildPasswordResetRequestEmail({
  appName,
  appUrl,
  email,
  recipientName,
  resetUrl,
  expiresInMinutes = 15,
}: BuildPasswordResetRequestEmailArgs) {
  const colors = {
    background: "#f5f7fb",
    card: "#ffffff",
    border: "#dde3ee",
    foreground: "#111827",
    muted: "#6b7280",
    primary: "#0f62fe",
    primaryForeground: "#ffffff",
    warning: "#b45309",
    warningSoft: "#fff7ed",
  }

  const safeEmail = escapeHtml(email)
  const safeAppName = escapeHtml(appName)
  const safeRecipient = recipientName?.trim()
    ? escapeHtml(recipientName.trim())
    : "there"
  const safeResetUrl = escapeHtml(resetUrl)
  const safeAppUrl = escapeHtml(appUrl.replace(/\/$/, ""))

  const html = `
    <div style="background: radial-gradient(circle at top right, rgba(15,98,254,0.08), transparent 30%), linear-gradient(180deg, ${colors.background}, #ffffff 72%); color: ${colors.foreground}; font-family: Inter, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.5; margin: 0; padding: 32px 16px;">
      <div style="margin: 0 auto; max-width: 640px;">
        <div style="align-items: center; display: flex; gap: 12px; margin-bottom: 24px;">
          <div aria-hidden="true" style="width: 44px; height: 44px; background: linear-gradient(135deg, #2d313a 0%, #0f62fe 100%); clip-path: polygon(50% 0%, 92% 24%, 92% 76%, 50% 100%, 8% 76%, 8% 24%);"></div>
          <div>
            <div style="font-size: 18px; font-weight: 700; letter-spacing: -0.02em;">Carbon</div>
            <div style="color: ${colors.muted}; font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase;">${safeAppName}</div>
          </div>
        </div>

        <div style="background-color: ${colors.card}; border: 1px solid ${colors.border}; border-radius: 18px; box-shadow: 0 18px 60px rgba(15, 23, 42, 0.08); overflow: hidden;">
          <div style="background: linear-gradient(135deg, rgba(15,98,254,0.14), rgba(15,98,254,0.04)); border-bottom: 1px solid ${colors.border}; padding: 24px 28px;">
            <div style="color: ${colors.primary}; font-size: 11px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase;">Password recovery</div>
            <h1 style="font-size: 30px; line-height: 1.1; margin: 12px 0 10px;">Reset your Carbon password</h1>
            <p style="color: ${colors.muted}; font-size: 16px; margin: 0;">Hi ${safeRecipient}, we received a request to reset the password for your account.</p>
          </div>

          <div style="padding: 28px;">
            <div style="border: 1px solid ${colors.border}; border-radius: 14px; margin-bottom: 20px; overflow: hidden;">
              <div style="background-color: #f8fbff; border-bottom: 1px solid ${colors.border}; color: ${colors.primary}; font-size: 11px; font-weight: 700; letter-spacing: 0.24em; padding: 12px 16px; text-transform: uppercase;">
                Reset link
              </div>
              <div style="background-color: #ffffff; padding: 22px 18px;">
                <p style="color: ${colors.foreground}; font-size: 14px; margin: 0 0 16px;">Click the button below to open the password reset page. The link expires in ${escapeHtml(String(expiresInMinutes))} minutes.</p>
                <a href="${safeResetUrl}" style="background-color: ${colors.primary}; border-radius: 12px; color: ${colors.primaryForeground}; display: inline-block; font-size: 14px; font-weight: 700; padding: 14px 22px; text-decoration: none;">Reset password</a>
              </div>
            </div>

            <div style="display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 22px;">
              <div style="background-color: ${colors.warningSoft}; border: 1px solid rgba(180,83,9,0.18); border-radius: 14px; padding: 16px;">
                <div style="color: ${colors.warning}; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; margin-bottom: 8px; text-transform: uppercase;">Security</div>
                <div style="color: ${colors.foreground}; font-size: 13px;">If you didn&apos;t request this, you can safely ignore this email and your password will stay the same.</div>
              </div>
              <div style="background-color: #f8fafc; border: 1px solid ${colors.border}; border-radius: 14px; padding: 16px;">
                <div style="color: ${colors.primary}; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; margin-bottom: 8px; text-transform: uppercase;">Account</div>
                <div style="font-size: 14px; font-weight: 700; margin-bottom: 4px;">${safeEmail}</div>
                <div style="color: ${colors.muted}; font-size: 13px;">This reset request was generated for this email address.</div>
              </div>
            </div>

            <div style="border-top: 1px solid ${colors.border}; padding-top: 16px;">
              <p style="color: ${colors.muted}; font-size: 13px; margin: 0 0 6px;">If the button does not work, paste this URL into your browser:</p>
              <p style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 12px; margin: 0; word-break: break-all;">${safeResetUrl}</p>
            </div>
          </div>
        </div>

        <p style="color: ${colors.muted}; font-size: 12px; margin: 16px 0 0;">Sent from ${safeAppName}. You can also sign in or visit ${safeAppUrl} for support.</p>
      </div>
    </div>
  `

  const text = [
    `Reset your Carbon password`,
    "",
    `Hi ${recipientName?.trim() || "there"},`,
    `We received a password reset request for ${email}.`,
    `Use this link to reset your password: ${resetUrl}`,
    `This link expires in ${expiresInMinutes} minutes.`,
    "",
    `If you did not request this, you can ignore this email and your password will remain unchanged.`,
    "",
    appUrl,
  ].join("\n")

  return {
    subject: `Reset your Carbon password`,
    html,
    text,
  }
}
