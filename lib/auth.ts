import { betterAuth } from "better-auth"
import { emailOTP } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
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
        console.info("[better-auth] OTP generated", { email, otp, type })
      },
    }),
  ],
})

export const isAdmin = (user: { role?: string | null } | null | undefined) => {
  return user?.role?.toUpperCase() === "ADMIN"
}
