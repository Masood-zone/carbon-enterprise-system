type WelcomeNotificationEmailProps = {
  appName: string
  appUrl: string
  recipientName?: string
  eyebrow?: string
  title?: string
  lead?: string
  ctaLabel?: string
  ctaUrl?: string
  password?: string
  securityNote?: string
  steps?: {
    title: string
    description: string
  }[]
}

const emailColors = {
  background: "#f4f4f4",
  card: "#ffffff",
  border: "#e0e0e0",
  foreground: "#161616",
  muted: "#525252",
  primary: "#0f62fe",
  primaryForeground: "#ffffff",
}

const onboardingSteps = [
  {
    title: "Complete your profile",
    description:
      "Add the details your workspace needs so the dashboard can stay personalized.",
  },
  {
    title: "Set up your business",
    description:
      "Confirm your company information, preferences, and the operating context you want to use.",
  },
  {
    title: "Start working",
    description:
      "Move into the dashboard, review your workspace, and begin using the system right away.",
  },
]

function CarbonMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" width="44" height="44">
      <path d="M32 3 7 17.5v29L32 61l25-14.5v-29Z" fill="#2d313a" />
      <path d="M32 3 7 17.5V32l25-14.5L57 32V17.5Z" fill="#0f62fe" />
      <path d="M32 20 17 28.5v17L32 54l15-8.5v-17Z" fill="#ffffff" />
      <path d="M32 20 47 28.5V36L32 27.5 17 36v-7.5Z" fill="#d0d4da" />
    </svg>
  )
}

export function WelcomeNotificationEmail({
  appName,
  appUrl,
  recipientName,
  eyebrow,
  title,
  lead,
  ctaLabel,
  ctaUrl,
  password,
  securityNote,
  steps,
}: WelcomeNotificationEmailProps) {
  const onboardingUrl = `${appUrl.replace(/\/$/, "")}/onboarding`
  const actionUrl = ctaUrl?.trim() || onboardingUrl
  const actionLabel = ctaLabel?.trim() || "Complete onboarding"
  const emailSteps = steps?.length ? steps : onboardingSteps
  const emailEyebrow = eyebrow?.trim() || "Welcome aboard"
  const emailTitle = title?.trim() || `Welcome to ${appName}`
  const emailLead =
    lead?.trim() ||
    `${recipientName ? `Hi ${recipientName}, ` : ""}your account is ready. The dashboard and onboarding flow are prepared so you can start using the platform right away.`
  const securePassword = password?.trim()

  return (
    <div
      style={{
        backgroundColor: emailColors.background,
        color: emailColors.foreground,
        fontFamily:
          'Inter, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        lineHeight: 1.5,
        margin: 0,
        padding: "32px 16px",
      }}
    >
      <div style={{ margin: "0 auto", maxWidth: 640 }}>
        <div style={{ alignItems: "center", display: "flex", gap: 12, marginBottom: 24 }}>
          <CarbonMark />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Carbon
            </div>
            <div
              style={{
                color: emailColors.muted,
                fontSize: 12,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
              }}
            >
              {appName}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: emailColors.card,
            border: `1px solid ${emailColors.border}`,
            padding: "32px",
          }}
        >
          <div
            style={{
              color: emailColors.primary,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.28em",
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            {emailEyebrow}
          </div>

          <h1 style={{ fontSize: 32, lineHeight: 1.1, margin: "0 0 16px" }}>
            {emailTitle}
          </h1>

          <p
            style={{
              color: emailColors.muted,
              fontSize: 16,
              margin: "0 0 24px",
            }}
          >
            {emailLead}
          </p>

          {securePassword ? (
            <div
              style={{
                border: `1px solid ${emailColors.border}`,
                marginBottom: 24,
                padding: 16,
              }}
            >
              <div
                style={{
                  color: emailColors.primary,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  marginBottom: 10,
                  textTransform: "uppercase",
                }}
              >
                Secure password
              </div>
              <div
                style={{
                  backgroundColor: "#f5f7fb",
                  fontFamily:
                    '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
                  fontSize: 18,
                  letterSpacing: "0.08em",
                  padding: "12px 14px",
                  wordBreak: "break-all",
                }}
              >
                {securePassword}
              </div>
              {securityNote ? (
                <p style={{ color: emailColors.muted, fontSize: 13, margin: "12px 0 0" }}>
                  {securityNote}
                </p>
              ) : null}
            </div>
          ) : null}

          <a
            href={actionUrl}
            style={{
              backgroundColor: emailColors.primary,
              color: emailColors.primaryForeground,
              display: "inline-block",
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 28,
              padding: "14px 22px",
              textDecoration: "none",
            }}
          >
            {actionLabel}
          </a>

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              marginTop: 4,
            }}
          >
            {emailSteps.map((step, index) => (
              <div
                key={step.title}
                style={{
                  border: `1px solid ${emailColors.border}`,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    color: emailColors.primary,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    marginBottom: 10,
                    textTransform: "uppercase",
                  }}
                >
                  Step {index + 1}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
                  {step.title}
                </div>
                <div style={{ color: emailColors.muted, fontSize: 14 }}>
                  {step.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: emailColors.muted, fontSize: 12, margin: "16px 0 0" }}>
          If the button above does not work, open {actionUrl} in your browser.
          This message was sent from {appName}.
        </p>
      </div>
    </div>
  )
}

export type { WelcomeNotificationEmailProps }