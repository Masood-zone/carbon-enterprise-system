import type { Metadata, Viewport } from "next"
import { Geist_Mono, IBM_Plex_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  weight: ["300", "400", "500", "600"],
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Carbon Enterprise",
    template: "%s | Carbon Enterprise",
  },
  description:
    "Carbon Enterprise is a smart inventory management system for enterprise operations.",
  metadataBase: new URL(siteUrl),
  applicationName: "Carbon Enterprise",
  authors: [{ name: "Carbon Enterprise" }],
  creator: "Carbon Enterprise",
  publisher: "Carbon Enterprise",
  keywords: [
    "inventory management",
    "enterprise ERP",
    "business onboarding",
    "carbon enterprise",
    "operations dashboard",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Carbon Enterprise",
    title: "Carbon Enterprise",
    description:
      "Carbon Enterprise is a smart inventory management system for enterprise operations.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Carbon Enterprise logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carbon Enterprise",
    description:
      "Carbon Enterprise is a smart inventory management system for enterprise operations.",
    images: ["/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
      {
        rel: "mask-icon",
        url: "/android-chrome-192x192.png",
        color: "#0f62fe",
      },
    ],
  },
  manifest: "/site.webmanifest",
  themeColor: "#0f62fe",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f62fe",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", ibmPlexSans.variable, fontMono.variable)}
    >
      <body className="min-h-svh bg-background font-sans text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
