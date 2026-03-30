import { CarbonBrand } from "@/components/carbon-brand"
import { VerifyOtpCard } from "./verify-otp-card"

export const metadata = {
  title: "Verify OTP",
  description:
    "Enter the One-Time Password (OTP) sent to your email to verify your identity and proceed with resetting your password.",
}

export default function VerifyOtpPage() {
  return (
    <main className="carbon-page flex min-h-svh flex-col">
      <div className="flex-1 px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-110 flex-col items-stretch">
          <div className="mb-12">
            <CarbonBrand className="items-start" />
            <div className="mt-4 h-1 w-10 bg-primary" />
          </div>

          <VerifyOtpCard />

          <p className="mx-auto mt-8 max-w-sm text-center text-[13px] leading-relaxed text-muted-foreground">
            Trouble receiving the code? Check your spam folder or contact system
            support.
          </p>
        </div>
      </div>

      <footer className="border-t border-border py-8">
        <div className="carbon-section flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
          <div className="font-semibold tracking-[0.28em] text-foreground uppercase">
            Carbon Enterprise
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <a className="transition-colors hover:text-foreground" href="#">
              Privacy Policy
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Terms of Service
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Security Guidelines
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
