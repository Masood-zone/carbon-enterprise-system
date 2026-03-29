import {
  emailService,
  getAppName,
  getAppUrl,
  type WelcomeNotificationStep,
} from "@/lib/email-service"
import {
  formatAnalyticsMetricValue,
  formatAnalyticsPeriodRange,
  getAnalyticsMetricMeta,
  getAnalyticsPeriodLabel,
  type AnalyticsMetricKey,
  type AnalyticsPeriod,
} from "@/lib/analytics"
import { isStrongPassword } from "@/lib/utils"

import { randomInt } from "node:crypto"

type BusinessLaunchWelcomeEmailArgs = {
  recipientEmail: string
  recipientName?: string
  businessName: string
  dashboardUrl?: string
}

type BusinessTeamMemberWelcomeEmailArgs = {
  recipientEmail: string
  recipientName?: string
  businessName: string
  role: "ADMIN" | "MANAGER"
  password: string
  dashboardUrl?: string
}

type AnalyticsSummaryMetric = {
  metricKey: AnalyticsMetricKey
  value: number
}

type AnalyticsSummaryEmailArgs = {
  businessName: string
  dashboardUrl?: string
  metrics: AnalyticsSummaryMetric[]
  period: AnalyticsPeriod
  periodEnd: Date
  periodStart: Date
  recipientEmail: string
  recipientName?: string
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]|'/g, (character) => {
    if (character === "&") return "&amp;"
    if (character === "<") return "&lt;"
    if (character === ">") return "&gt;"
    if (character === '"') return "&quot;"
    return "&#39;"
  })
}

function buildBusinessLaunchSteps(
  businessName: string
): WelcomeNotificationStep[] {
  return [
    {
      title: "Review your workspace",
      description: `Your ${businessName} workspace is live and ready for your first review.`,
    },
    {
      title: "Invite the right people",
      description:
        "Add managers or operators who should help you run the business day to day.",
    },
    {
      title: "Start tracking operations",
      description:
        "Open the dashboard to monitor inventory, activity, and performance from one place.",
    },
  ]
}

function generateSecurePassword(length = 16): string {
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const lowercase = "abcdefghijkmnopqrstuvwxyz"
  const numbers = "23456789"
  const symbols = "!@#$%&*?"
  const alphabet = `${uppercase}${lowercase}${numbers}${symbols}`

  while (true) {
    const characters = [
      uppercase[randomInt(0, uppercase.length)],
      lowercase[randomInt(0, lowercase.length)],
      numbers[randomInt(0, numbers.length)],
      symbols[randomInt(0, symbols.length)],
    ]

    while (characters.length < length) {
      characters.push(alphabet[randomInt(0, alphabet.length)])
    }

    for (let index = characters.length - 1; index > 0; index -= 1) {
      const swapIndex = randomInt(0, index + 1)
      const current = characters[index]
      characters[index] = characters[swapIndex]
      characters[swapIndex] = current
    }

    const password = characters.join("")
    if (isStrongPassword(password)) {
      return password
    }
  }
}

function buildTeamMemberSteps(
  businessName: string,
  role: "ADMIN" | "MANAGER"
): WelcomeNotificationStep[] {
  const roleLabel = role === "ADMIN" ? "administrator" : "manager"

  return [
    {
      title: "Use your secure password",
      description:
        "Sign in with the password in this email, then change it after your first login.",
    },
    {
      title: "Open your dashboard",
      description: `Access the ${businessName} workspace and review the tools available to a ${roleLabel}.`,
    },
    {
      title: "Keep the workspace moving",
      description:
        "Use the dashboard to stay on top of operations, inventory, and activity.",
    },
  ]
}

function buildAnalyticsSummaryMessage({
  businessName,
  dashboardUrl,
  metrics,
  period,
  periodEnd,
  periodStart,
  recipientName,
}: AnalyticsSummaryEmailArgs) {
  const periodLabel = getAnalyticsPeriodLabel(period)
  const dateRange = formatAnalyticsPeriodRange(periodStart, periodEnd)
  const resolvedDashboardUrl =
    dashboardUrl || `${getAppUrl().replace(/\/$/, "")}/dashboard/analytics`
  const metricRows = metrics.length
    ? metrics
        .map((metric) => {
          const meta = getAnalyticsMetricMeta(metric.metricKey)
          const formattedValue = formatAnalyticsMetricValue(
            metric.metricKey,
            metric.value
          )

          return `
            <div style="display: flex; justify-content: space-between; gap: 16px; padding: 10px 0; border-top: 1px solid #f0f0f0;">
              <div>
                <div style="font-size: 14px; font-weight: 700;">${escapeHtml(meta.label)}</div>
                <div style="color: #525252; font-size: 12px;">${escapeHtml(meta.description)}</div>
              </div>
              <div style="font-size: 15px; font-weight: 700; white-space: nowrap;">${escapeHtml(formattedValue)}</div>
            </div>`
        })
        .join("")
    : `
        <div style="padding: 10px 0; color: #525252; font-size: 14px;">
          No analytics metrics were generated for this period.
        </div>`

  const textRows = metrics.length
    ? metrics
        .map((metric) => {
          const meta = getAnalyticsMetricMeta(metric.metricKey)
          return `${meta.label}: ${formatAnalyticsMetricValue(metric.metricKey, metric.value)}`
        })
        .join("\n")
    : "No analytics metrics were generated for this period."

  const greeting = recipientName ? `Hi ${recipientName},` : "Hi there,"

  return {
    html: `
      <div style="background-color: #f4f4f4; color: #161616; font-family: Inter, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.5; margin: 0; padding: 32px 16px;">
        <div style="margin: 0 auto; max-width: 640px;">
          <div style="align-items: center; display: flex; gap: 12px; margin-bottom: 24px;">
            <div aria-hidden="true" style="width: 44px; height: 44px; background: linear-gradient(135deg, #2d313a 0%, #0f62fe 100%); clip-path: polygon(50% 0%, 92% 24%, 92% 76%, 50% 100%, 8% 76%, 8% 24%);"></div>
            <div>
              <div style="font-size: 18px; font-weight: 700; letter-spacing: -0.02em;">Carbon</div>
              <div style="color: #525252; font-size: 12px; letter-spacing: 0.24em; text-transform: uppercase;">${escapeHtml(businessName)}</div>
            </div>
          </div>

          <div style="background-color: #ffffff; border: 1px solid #e0e0e0; padding: 32px;">
            <div style="color: #0f62fe; font-size: 11px; font-weight: 700; letter-spacing: 0.28em; margin-bottom: 16px; text-transform: uppercase;">
              ${escapeHtml(periodLabel)} analytics summary
            </div>

            <h1 style="font-size: 30px; line-height: 1.1; margin: 0 0 16px;">Your ${escapeHtml(periodLabel.toLowerCase())} analytics are ready</h1>

            <p style="color: #525252; font-size: 16px; margin: 0 0 20px;">
              ${escapeHtml(greeting)} ${escapeHtml(businessName)} has finished generating the ${escapeHtml(periodLabel.toLowerCase())} analytics summary for ${escapeHtml(dateRange)}.
            </p>

            <div style="border: 1px solid #e0e0e0; margin-bottom: 24px; padding: 16px;">
              <div style="color: #0f62fe; font-size: 11px; font-weight: 700; letter-spacing: 0.22em; margin-bottom: 10px; text-transform: uppercase;">
                Key figures
              </div>
              ${metricRows}
            </div>

            <a href="${escapeHtml(resolvedDashboardUrl)}" style="background-color: #0f62fe; color: #ffffff; display: inline-block; font-size: 14px; font-weight: 700; margin-bottom: 0; padding: 14px 22px; text-decoration: none;">
              Open analytics dashboard
            </a>
          </div>

          <p style="color: #525252; font-size: 12px; margin: 16px 0 0;">
            If the button above does not work, open ${escapeHtml(resolvedDashboardUrl)} in your browser.
          </p>
        </div>
      </div>
    `,
    text: [
      `${periodLabel} analytics summary for ${businessName}`,
      `Period: ${dateRange}`,
      greeting,
      "",
      textRows,
      "",
      resolvedDashboardUrl,
    ].join("\n"),
  }
}

class NotificationsService {
  async sendBusinessLaunchWelcomeEmail(
    args: BusinessLaunchWelcomeEmailArgs
  ): Promise<void> {
    const appName = getAppName()
    const appUrl = getAppUrl()
    const businessName = args.businessName.trim()
    const dashboardUrl =
      args.dashboardUrl || `${appUrl.replace(/\/$/, "")}/dashboard`

    await emailService.sendWelcomeNotificationEmail({
      to: args.recipientEmail,
      recipientName: args.recipientName?.trim(),
      appName,
      appUrl,
      subject: `${businessName} is now live - ${appName}`,
      eyebrow: "Business launched",
      title: `${businessName} is now live`,
      lead: "Your business launch is complete. You can open the dashboard to review your workspace and begin managing operations.",
      ctaLabel: "Open dashboard",
      ctaUrl: dashboardUrl,
      steps: buildBusinessLaunchSteps(businessName),
    })
  }

  generateBusinessTeamMemberPassword() {
    return generateSecurePassword()
  }

  async sendBusinessTeamMemberWelcomeEmail(
    args: BusinessTeamMemberWelcomeEmailArgs
  ): Promise<void> {
    const appName = getAppName()
    const appUrl = getAppUrl()
    const businessName = args.businessName.trim()
    const dashboardUrl =
      args.dashboardUrl || `${appUrl.replace(/\/$/, "")}/dashboard`
    const roleLabel = args.role === "ADMIN" ? "Administrator" : "Manager"

    await emailService.sendWelcomeNotificationEmail({
      to: args.recipientEmail,
      recipientName: args.recipientName?.trim(),
      appName,
      appUrl,
      subject: `${businessName} dashboard access is ready - ${appName}`,
      eyebrow: `${roleLabel} access`,
      title: `Welcome to ${businessName}`,
      lead:
        args.role === "ADMIN"
          ? "Your administrator account is ready. Use the secure password below to open the dashboard and change it after your first login."
          : "Your manager access is ready. Use the secure password below to open the dashboard and change it after your first login.",
      ctaLabel: "Open dashboard",
      ctaUrl: dashboardUrl,
      password: args.password,
      securityNote:
        "For security, change this password after you sign in and keep it private.",
      steps: buildTeamMemberSteps(businessName, args.role),
    })
  }

  async sendAnalyticsSummaryEmail(
    args: AnalyticsSummaryEmailArgs
  ): Promise<void> {
    const summary = buildAnalyticsSummaryMessage(args)

    await emailService.sendEmail({
      to: args.recipientEmail,
      subject: `${getAnalyticsPeriodLabel(args.period)} analytics summary is ready - ${args.businessName.trim()}`,
      html: summary.html,
      text: summary.text,
    })
  }
}

export const notificationsService = new NotificationsService()
