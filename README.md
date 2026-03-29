# Carbon Enterprise System

Carbon Enterprise System is a multi-business inventory management platform built with Next.js App Router, Prisma, Better Auth, TanStack Query, and PostgreSQL. It supports onboarding, inventory, sales, customers, expenses, reporting, and analytics for enterprise retail and trading workflows.

## Overview

The application is structured around three layers:

1. UI and route segments in `app/`
2. API controllers in `app/api/admin/`
3. Business logic in `services/`

Prisma lives in `lib/prisma.ts`, and database access is isolated to the service layer.

## Core Capabilities

- Business onboarding with draft persistence and finalization
- Admin and Manager access control through Better Auth sessions
- Product and inventory management
- Sales, transaction, and transaction-item inspection
- Customer and expense management
- Financial summaries, cash flow, and profit/loss reporting
- Analytics cache access and recomputation
- Dashboard aggregation for operational oversight

## Role Scope

| Module           | Admin can do                                             | Manager can do                                           |
| ---------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| Dashboard        | Full overview, trends, low-stock, recent sales           | Limited overview, trends, low-stock, recent sales        |
| Business Profile | View and update business details                         | No access                                                |
| User Management  | Create, update, delete users and roles                   | No access                                                |
| Products         | Full CRUD on products and services                       | Full CRUD on products and services                       |
| Inventory        | View stock levels, low-stock, and stock movements        | View stock levels, low-stock, and stock movements        |
| Sales            | View transaction list, drill into details, inspect items | View transaction list, drill into details, inspect items |
| Customers        | Full CRUD plus transaction history                       | Full CRUD plus transaction history                       |
| Expenses         | Full CRUD for operational expenses                       | Full CRUD for operational expenses                       |
| Reports          | Advanced financial reporting                             | Basic financial reporting                                |
| Analytics        | Cached analytics, metric drill-down, recompute           | Cached analytics and metric drill-down only              |
| Settings         | View and update system settings                          | No access                                                |

Manager-accessible endpoints use the shared `withManager()` guard in `services/shared/admin-guards.ts`. Admin-only endpoints continue to use `withAdmin()`.

## API Surface

Admin endpoints live under `app/api/admin/` and are grouped by module:

- `business/`
- `users/`
- `products/`
- `inventory/`
- `transactions/`
- `transaction-items/`
- `customers/`
- `expenses/`
- `reports/`
- `analytics/`
- `dashboard/`
- `settings/`

## Service Layer

Business logic is grouped under `services/` and split by domain:

- `services/business/`
- `services/user/`
- `services/product/`
- `services/transaction/`
- `services/customer/`
- `services/expense/`
- `services/report/`
- `services/analytics/`
- `services/dashboard/`
- `services/settings/`
- `services/shared/`

React Query hooks live beside their services in `*.query.ts` files, including manager-facing wrappers in `services/manager/manager.query.ts`.

## Tech Stack

- Next.js 16 App Router
- React 19
- Prisma 7
- PostgreSQL
- Better Auth
- TanStack Query
- Axios
- Tailwind CSS
- shadcn/ui primitives

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Run the app

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
```

### Run linting

```bash
pnpm lint
```

### Type-check

```bash
pnpm typecheck
```

## Environment Variables

The project uses the following environment variables:

- `DIRECT_URL` - Prisma direct database connection
- `DATABASE_URL` - Prisma fallback database connection
- `ACCELERATE_URL` - Prisma Accelerate URL when used
- `NEXT_PUBLIC_API_BASE_URL` - shared API base URL for client requests
- `NEXT_PUBLIC_APP_URL` - app base URL for email links and navigation
- `NEXT_PUBLIC_SITE_URL` - public site URL for metadata and sitemap generation
- `APP_URL` - server-side app URL fallback for links
- `APP_NAME` - application display name used in email content
- `SMTP_HOST` - SMTP host or service name
- `SMTP_SERVICE` - SMTP service preset
- `SMTP_PORT` - SMTP port
- `SMTP_SECURE` - secure SMTP toggle
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_FROM` - sender address
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

## Notes

- Better Auth is wired at `app/api/auth/[...all]/route.ts`.
- Onboarding finalization uses the business onboarding service and API route pair.
- The analytics and reporting layers are intentionally split into basic and advanced entry points to support the Manager versus Admin boundary.
