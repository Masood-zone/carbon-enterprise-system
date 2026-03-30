import { betterAuth } from "better-auth"
import { emailOTP } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"
import { emailService, getAppName, getAppUrl } from "./email-service"
import { buildOtpEmail, buildPasswordResetSuccessEmail } from "./otp-emails"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      businessId: {
        type: "string",
        required: false,
        input: false,
        returned: true,
      },
      role: {
        type: ["ADMIN", "MANAGER"],
        required: false,
        input: false,
        returned: true,
        defaultValue: "MANAGER",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 15 * 60,
    revokeSessionsOnPasswordReset: true,
    async onPasswordReset({ user }) {
      const appName = getAppName()
      const appUrl = getAppUrl()

      try {
        const message = buildPasswordResetSuccessEmail({
          appName,
          appUrl,
          email: user.email,
          recipientName: user.name,
        })

        await emailService.sendEmail({
          to: user.email,
          subject: message.subject,
          html: message.html,
          text: message.text,
        })
      } catch (error) {
        console.warn(
          "[better-auth] failed to send password reset confirmation",
          {
            email: user.email,
            error,
          }
        )
      }
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({
        email,
        otp,
        type,
      }: {
        email: string
        otp: string
        type: string
      }) {
        if (type === "forget-password") {
          return
        }

        const appName = getAppName()
        const appUrl = getAppUrl()
        const message = buildOtpEmail({
          appName,
          appUrl,
          email,
          otp,
          type,
          expiresInMinutes: 15,
        })

        await emailService.sendEmail({
          to: email,
          subject: message.subject,
          html: message.html,
          text: message.text,
        })
      },
    }),
  ],
})

export const isAdmin = (user: { role?: string | null } | null | undefined) => {
  return user?.role?.toUpperCase() === "ADMIN"
}
