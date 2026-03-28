import nodemailer, { type Transporter } from "nodemailer"

type SendEmailArgs = {
  to: string
  subject: string
  html: string
  text?: string
}

type WelcomeEmailArgs = {
  to: string
  recipientName?: string
  appName?: string
  appUrl?: string
  subject?: string
  eyebrow?: string
  title?: string
  lead?: string
  ctaLabel?: string
  ctaUrl?: string
  password?: string
  securityNote?: string
  steps?: WelcomeNotificationStep[]
}

export type WelcomeNotificationStep = {
  title: string
  description: string
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

function buildWelcomeNotificationHtml({
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
}: {
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
  steps: WelcomeNotificationStep[]
}) {
  const emailColors = {
    background: "#f4f4f4",
    card: "#ffffff",
    border: "#e0e0e0",
    foreground: "#161616",
    muted: "#525252",
    primary: "#0f62fe",
    primaryForeground: "#ffffff",
  }

  const onboardingUrl = `${appUrl.replace(/\/$/, "")}/onboarding`
  const actionUrl = ctaUrl?.trim() || onboardingUrl
  const actionLabel = ctaLabel?.trim() || "Complete onboarding"
  const emailEyebrow = eyebrow?.trim() || "Welcome aboard"
  const emailTitle = title?.trim() || `Welcome to ${appName}`
  const emailLead =
    lead?.trim() ||
    `${recipientName ? `Hi ${recipientName}, ` : ""}your account is ready. The dashboard and onboarding flow are prepared so you can start using the platform right away.`
  const securePassword = password?.trim()

  const stepCards = steps
    .map(
      (step, index) => `
              <div style="border: 1px solid ${emailColors.border}; padding: 16px;">
                <div style="color: ${emailColors.primary}; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; margin-bottom: 10px; text-transform: uppercase;">
                  Step ${index + 1}
                </div>
                <div style="font-size: 15px; font-weight: 700; margin-bottom: 6px;">${escapeHtml(step.title)}</div>
                <div style="color: ${emailColors.muted}; font-size: 14px;">${escapeHtml(step.description)}</div>
              </div>`,
    )
    .join("")

  const passwordSection = securePassword
    ? `
          <div style="border: 1px solid ${emailColors.border}; margin-bottom: 24px; padding: 16px;">
            <div style="color: ${emailColors.primary}; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; margin-bottom: 10px; text-transform: uppercase;">
              Secure password
            </div>
            <div style="background-color: #f5f7fb; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 18px; letter-spacing: 0.08em; padding: 12px 14px; word-break: break-all;">
              ${escapeHtml(securePassword)}
            </div>
            ${securityNote ? `<p style="color: ${emailColors.muted}; font-size: 13px; margin: 12px 0 0;">${escapeHtml(securityNote)}</p>` : ""}
          </div>`
    : ""

  return `
    <div style="background-color: ${emailColors.background}; color: ${emailColors.foreground}; font-family: Inter, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; line-height: 1.5; margin: 0; padding: 32px 16px;">
      <div style="margin: 0 auto; max-width: 640px;">
        <div style="align-items: center; display: flex; gap: 12px; margin-bottom: 24px;">
          <div aria-hidden="true" style="width: 44px; height: 44px; background: linear-gradient(135deg, #2d313a 0%, #0f62fe 100%); clip-path: polygon(50% 0%, 92% 24%, 92% 76%, 50% 100%, 8% 76%, 8% 24%);"></div>
          <div>
            <div style="font-size: 18px; font-weight: 700; letter-spacing: -0.02em;">Carbon</div>
            <div style="color: ${emailColors.muted}; font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase;">${escapeHtml(appName)}</div>
          </div>
        </div>

        <div style="background-color: ${emailColors.card}; border: 1px solid ${emailColors.border}; padding: 32px;">
          <div style="color: ${emailColors.primary}; font-size: 11px; font-weight: 700; letter-spacing: 0.28em; margin-bottom: 16px; text-transform: uppercase;">
            ${escapeHtml(emailEyebrow)}
          </div>

          <h1 style="font-size: 32px; line-height: 1.1; margin: 0 0 16px;">${escapeHtml(emailTitle)}</h1>

          <p style="color: ${emailColors.muted}; font-size: 16px; margin: 0 0 24px;">
            ${escapeHtml(emailLead)}
          </p>

          ${passwordSection}

          <a href="${escapeHtml(actionUrl)}" style="background-color: ${emailColors.primary}; color: ${emailColors.primaryForeground}; display: inline-block; font-size: 14px; font-weight: 700; margin-bottom: 28px; padding: 14px 22px; text-decoration: none;">
            ${escapeHtml(actionLabel)}
          </a>

          <div style="display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); margin-top: 4px;">
            ${stepCards}
          </div>
        </div>

        <p style="color: ${emailColors.muted}; font-size: 12px; margin: 16px 0 0;">
          If the button above does not work, open ${escapeHtml(actionUrl)} in your browser. This message was sent from ${escapeHtml(appName)}.
        </p>
      </div>
    </div>
  `
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined
  return value.toLowerCase() === "true"
}

function normalizeServiceName(value: string | undefined): string | undefined {
  if (!value) return undefined

  const normalizedValue = value.trim().toLowerCase()
  if (normalizedValue === "gmail" || normalizedValue === "google mail") {
    return "gmail"
  }

  return undefined
}

export function getAppUrl(): string {
  return (
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") ||
    "http://localhost:3000"
  )
}

export function getAppName(): string {
  return process.env.APP_NAME || "Carbon Enterprise"
}

function buildTextWelcomeMessage({
  recipientName,
  appName,
  lead,
  ctaLabel,
  ctaUrl,
  password,
  securityNote,
  steps,
  appUrl,
}: {
  recipientName?: string
  appName: string
  lead?: string
  ctaLabel?: string
  ctaUrl: string
  password?: string
  securityNote?: string
  steps: WelcomeNotificationStep[]
  appUrl: string
}) {
  const actionUrl = ctaUrl || `${appUrl.replace(/\/$/, "")}/onboarding`
  const actionLabel = ctaLabel?.trim() || "Complete onboarding"

  const stepSummary = steps
    .map((step, index) => `${index + 1}. ${step.title} - ${step.description}`)
    .join("\n")

  return [
    `Welcome to ${appName}`,
    recipientName ? `Hi ${recipientName},` : "Hi there,",
    lead?.trim() ||
      "Your account is ready and the onboarding flow is waiting for you.",
    password?.trim() ? `Secure password: ${password.trim()}` : null,
    password?.trim() && securityNote?.trim() ? securityNote.trim() : null,
    stepSummary,
    `${actionLabel}: ${actionUrl}`,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n\n")
}

function buildTransport(): Transporter {
  const host = process.env.SMTP_HOST
  const service = process.env.SMTP_SERVICE
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const secure = parseBoolean(process.env.SMTP_SECURE)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const auth = user && pass ? { user, pass } : undefined
  const normalizedService = normalizeServiceName(service || host)

  const transportOptions = {
    ...(normalizedService ? { service: normalizedService } : {}),
    ...(!normalizedService && service ? { service } : {}),
    ...(!normalizedService && !service && host ? { host } : {}),
    ...(port !== undefined ? { port } : {}),
    ...(secure !== undefined ? { secure } : {}),
    ...(auth ? { auth } : {}),
  }

  return nodemailer.createTransport(transportOptions)
}

class EmailService {
  private readonly transporter: Transporter
  private readonly from: string

  constructor() {
    this.transporter = buildTransport()
    this.from =
      process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@localhost"
  }

  async sendEmail({ to, subject, html, text }: SendEmailArgs): Promise<void> {
    if (!to?.trim()) throw new Error("Email recipient is required")
    if (!subject?.trim()) throw new Error("Email subject is required")
    if (!html?.trim()) throw new Error("Email html is required")

    await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      html,
      text,
    })
  }

  async sendWelcomeNotificationEmail({
    to,
    recipientName,
    appName,
    appUrl,
    subject,
    eyebrow,
    title,
    lead,
    ctaLabel,
    ctaUrl,
    password,
    securityNote,
    steps,
  }: WelcomeEmailArgs): Promise<void> {
    const resolvedAppName = appName || getAppName()
    const resolvedAppUrl = appUrl || getAppUrl()
    const resolvedSteps = steps?.length
      ? steps
      : [
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
    const html = buildWelcomeNotificationHtml({
      appName: resolvedAppName,
      appUrl: resolvedAppUrl,
      recipientName,
      eyebrow,
      title,
      lead,
      ctaLabel,
      ctaUrl,
      password,
      securityNote,
      steps: resolvedSteps,
    })

    await this.sendEmail({
      to,
      subject: subject || `Welcome to ${resolvedAppName}`,
      html,
      text: buildTextWelcomeMessage({
        recipientName,
        appName: resolvedAppName,
        appUrl: resolvedAppUrl,
        lead,
        ctaLabel,
        ctaUrl: ctaUrl || `${resolvedAppUrl.replace(/\/$/, "")}/onboarding`,
        password,
        securityNote,
        steps: resolvedSteps,
      }),
    })
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      return true
    } catch {
      return false
    }
  }
}

export const emailService = new EmailService()