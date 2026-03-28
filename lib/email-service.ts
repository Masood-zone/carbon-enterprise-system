import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import nodemailer, { type Transporter } from "nodemailer"

import {
  WelcomeNotificationEmail,
  type WelcomeNotificationEmailProps,
} from "@/components/emails/welcome-notification-email"

type SendEmailArgs = {
  to: string
  subject: string
  html: string
  text?: string
}

type WelcomeEmailArgs = {
  to: string
  recipientName?: string
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined
  return value.toLowerCase() === "true"
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
  appUrl,
}: {
  recipientName?: string
  appName: string
  appUrl: string
}) {
  const onboardingUrl = `${appUrl.replace(/\/$/, "")}/onboarding`

  return [
    `Welcome to ${appName}`,
    recipientName ? `Hi ${recipientName},` : "Hi there,",
    "Your account is ready and the onboarding flow is waiting for you.",
    "1. Complete your profile.",
    "2. Set up your business context.",
    "3. Open the dashboard and continue working.",
    `Open onboarding: ${onboardingUrl}`,
  ].join("\n\n")
}

function buildTransport(): Transporter {
  const host = process.env.SMTP_HOST
  const service = process.env.SMTP_SERVICE
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const secure = parseBoolean(process.env.SMTP_SECURE)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const auth = user && pass ? { user, pass } : undefined

  const transportOptions = {
    ...(service ? { service } : {}),
    ...(!service && host ? { host } : {}),
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
  }: WelcomeEmailArgs): Promise<void> {
    const appName = getAppName()
    const appUrl = getAppUrl()
    const componentProps: WelcomeNotificationEmailProps = {
      appName,
      appUrl,
      recipientName,
    }

    const html = renderToStaticMarkup(
      createElement(WelcomeNotificationEmail, componentProps)
    )

    await this.sendEmail({
      to,
      subject: `Welcome to ${appName}`,
      html,
      text: buildTextWelcomeMessage({ recipientName, appName, appUrl }),
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