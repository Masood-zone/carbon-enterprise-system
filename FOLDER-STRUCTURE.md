# Folder Structure

This document summarizes the project layout for the Next.js app. Generated and build-only folders such as `.next/`, `node_modules/`, and `.git/` are intentionally omitted.

```text
carbon-enterprise-system/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...all]/
│   │   ├── onboarding/
│   │   │   └── business/
│   │   └── uploads/
│   │       └── route.ts
│   ├── dashboard/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   ├── login/
│   │   ├── login-form.tsx
│   │   └── page.tsx
│   ├── onboarding/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── step-1/
│   │   │   └── page.tsx
│   │   ├── step-2/
│   │   │   └── page.tsx
│   │   ├── step-3/
│   │   │   └── page.tsx
│   │   └── step-4/
│   │       └── page.tsx
│   ├── reset-password/
│   │   └── page.tsx
│   ├── verify-otp/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── assets/
│   └── DESIGN-SYSTEM.md
├── components/
│   ├── auth/
│   │   └── home-header-actions.tsx
│   ├── emails/
│   │   └── welcome-notification-email.tsx
│   ├── home/
│   │   ├── home-cta-section.tsx
│   │   ├── home-features-section.tsx
│   │   ├── home-footer.tsx
│   │   ├── home-header.tsx
│   │   ├── home-hero-section.tsx
│   │   └── home-process-section.tsx
│   ├── onboarding/
│   │   └── onboarding-ui.tsx
│   ├── ui/
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── select.tsx
│   │   ├── spinner.tsx
│   │   └── switch.tsx
│   ├── carbon-brand.tsx
│   ├── provider.tsx
│   └── theme-provider.tsx
├── generated/
│   └── prisma/
│       ├── browser.ts
│       ├── client.ts
│       ├── commonInputTypes.ts
│       ├── enums.ts
│       ├── internal/
│       ├── models/
│       └── models.ts
├── hooks/
├── lib/
│   ├── auth-client.ts
│   ├── auth.ts
│   ├── cloudinary/
│   │   ├── cloudinary-service.ts
│   │   └── cloudinary-utils.ts
│   ├── email-service.ts
│   ├── notifications.ts
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   ├── migrations/
│   │   ├── 20260328174229_database_initialization/
│   │   ├── 20260328175906_authentication_setup/
│   │   ├── 20260328180144_better_auth_core_schema/
│   │   └── 20260328193000_predictive_analytics_restructure/
│   └── schema.prisma
├── public/
│   └── site.webmanifest
├── services/
│   ├── api/
│   │   └── axios.ts
│   ├── auth/
│   │   └── user-auth.ts
│   └── onboarding/
│       └── business-onboarding.ts
├── stores/
│   └── onboarding-team-members.ts
├── types/
├── utils/
│   └── platform-data.ts
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── prisma.config.ts
├── README.md
└── tsconfig.json
```

If you want, I can also turn this into a more detailed project map with a short purpose note for each folder.
