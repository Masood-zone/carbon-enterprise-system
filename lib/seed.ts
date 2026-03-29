import { randomUUID } from "node:crypto"

import { hashPassword } from "better-auth/crypto"
import type { Prisma } from "../generated/prisma/client"

import { prisma } from "./prisma"

const businessId = randomUUID()
const adminUserId = randomUUID()
const managerUserId = randomUUID()
const operationsUserId = randomUUID()

const adminPassword = "Admin@2026!"
const managerPassword = "Manager@2026!"
const operationsPassword = "Operations@2026!"

const products = [
  {
    businessId,
    category: "Beverages",
    description: "Premium malt drink for retail and event sales.",
    id: randomUUID(),
    isActive: true,
    name: "Premium Malt Drink - 330ml",
    price: 8.5,
    reorderPoint: 40,
    reorderQuantity: 120,
    sku: "GH-BEV-001",
    stock: 450,
    unitOfMeasure: "case",
  },
  {
    businessId,
    category: "Grains",
    description: "Imported basmati rice for bulk and retail distribution.",
    id: randomUUID(),
    isActive: true,
    name: "Aromatic Basmati Rice - 5kg",
    price: 145,
    reorderPoint: 25,
    reorderQuantity: 60,
    sku: "GH-GRO-112",
    stock: 15,
    unitOfMeasure: "bag",
  },
  {
    businessId,
    category: "Cooking Oils",
    description: "Vegetable oil for household and restaurant customers.",
    id: randomUUID(),
    isActive: true,
    name: "Refined Vegetable Oil - 1L",
    price: 32,
    reorderPoint: 35,
    reorderQuantity: 90,
    sku: "GH-OIL-054",
    stock: 89,
    unitOfMeasure: "bottle",
  },
  {
    businessId,
    category: "Housekeeping",
    description: "Surface disinfectant for commercial hygiene programs.",
    id: randomUUID(),
    isActive: true,
    name: "Scented Disinfectant - 500ml",
    price: 24.5,
    reorderPoint: 30,
    reorderQuantity: 100,
    sku: "GH-HOU-782",
    stock: 0,
    unitOfMeasure: "bottle",
  },
] satisfies Prisma.ProductCreateManyInput[]

const customers = [
  {
    businessId,
    email: "k.mensah@enterprise.gh",
    id: randomUUID(),
    isActive: true,
    lastPurchaseAt: daysAgo(1),
    lifetimeValue: 8420,
    name: "Kofi Mensah",
    phone: "+233 24 123 4567",
    segment: "Gold",
  },
  {
    businessId,
    email: "ama.serwaa@gmail.com",
    id: randomUUID(),
    isActive: true,
    lastPurchaseAt: daysAgo(3),
    lifetimeValue: 3150.5,
    name: "Ama Serwaa",
    phone: "+233 50 987 6543",
    segment: "Silver",
  },
  {
    businessId,
    email: "boateng_k@outlook.com",
    id: randomUUID(),
    isActive: true,
    lastPurchaseAt: daysAgo(5),
    lifetimeValue: 19800,
    name: "Kwame Boateng",
    phone: "+233 27 555 1212",
    segment: "Platinum",
  },
] satisfies Prisma.CustomerCreateManyInput[]

const transactions = [
  {
    businessId,
    customerId: customers[0].id,
    id: randomUUID(),
    paymentMethod: "Mobile Money",
    profitAmount: 1120,
    reference: "#TRX-94021",
    soldAt: daysAgo(1),
    soldByUserId: adminUserId,
    status: "COMPLETED",
    subtotal: 3680,
    taxAmount: 0,
    totalAmount: 4200,
    transactionNumber: "TRX-94021",
  },
  {
    businessId,
    customerId: customers[1].id,
    id: randomUUID(),
    paymentMethod: "Card",
    profitAmount: 610,
    reference: "#TRX-94022",
    soldAt: daysAgo(1),
    soldByUserId: managerUserId,
    status: "PENDING",
    subtotal: 2450,
    taxAmount: 0,
    totalAmount: 2850,
    transactionNumber: "TRX-94022",
  },
  {
    businessId,
    customerId: customers[2].id,
    id: randomUUID(),
    paymentMethod: "Cash",
    profitAmount: 265,
    reference: "#TRX-93985",
    soldAt: daysAgo(2),
    soldByUserId: operationsUserId,
    status: "COMPLETED",
    subtotal: 760,
    taxAmount: 0,
    totalAmount: 850,
    transactionNumber: "TRX-93985",
  },
] satisfies Prisma.TransactionCreateManyInput[]

const transactionItems = [
  {
    id: randomUUID(),
    lineTotal: 850,
    price: 8.5,
    productId: products[0].id,
    quantity: 100,
    transactionId: transactions[0].id,
  },
  {
    id: randomUUID(),
    lineTotal: 1200,
    price: 24.5,
    productId: products[3].id,
    quantity: 48,
    transactionId: transactions[0].id,
  },
  {
    id: randomUUID(),
    lineTotal: 2850,
    price: 145,
    productId: products[1].id,
    quantity: 19,
    transactionId: transactions[1].id,
  },
  {
    id: randomUUID(),
    lineTotal: 850,
    price: 32,
    productId: products[2].id,
    quantity: 26,
    transactionId: transactions[2].id,
  },
] satisfies Prisma.TransactionItemCreateManyInput[]

const expenses = [
  {
    amount: 4500,
    businessId,
    category: "Rent",
    id: randomUUID(),
    notes: "Warehouse rent for the month.",
    occurredAt: daysAgo(7),
    title: "Warehouse rent",
    vendorName: "Accra Logistics Hub",
  },
  {
    amount: 1200.5,
    businessId,
    category: "Utilities",
    id: randomUUID(),
    notes: "Electricity and water bill.",
    occurredAt: daysAgo(6),
    title: "Utility bill",
    vendorName: "ECG",
  },
  {
    amount: 3400,
    businessId,
    category: "Logistics",
    id: randomUUID(),
    notes: "Delivery to Kumasi branch.",
    occurredAt: daysAgo(5),
    title: "Fleet maintenance",
    vendorName: "CitiFleet",
  },
] satisfies Prisma.ExpenseCreateManyInput[]

const stockMovements = [
  {
    balanceAfter: 350,
    balanceBefore: 450,
    businessId,
    id: randomUUID(),
    movementType: "SALE",
    notes: "Seeded from initial transaction.",
    performedByUserId: adminUserId,
    productId: products[0].id,
    quantity: -100,
    recordedAt: daysAgo(1),
    transactionItemId: transactionItems[0].id,
  },
  {
    balanceAfter: 0,
    balanceBefore: 48,
    businessId,
    id: randomUUID(),
    movementType: "SALE",
    notes: "Low stock example for dashboard.",
    performedByUserId: managerUserId,
    productId: products[3].id,
    quantity: -48,
    recordedAt: daysAgo(1),
    transactionItemId: transactionItems[1].id,
  },
  {
    balanceAfter: 89,
    balanceBefore: 120,
    businessId,
    id: randomUUID(),
    movementType: "COUNT",
    notes: "Cycle count adjustment.",
    performedByUserId: operationsUserId,
    productId: products[2].id,
    quantity: -31,
    recordedAt: daysAgo(2),
  },
] satisfies Prisma.StockMovementCreateManyInput[]

const inventorySnapshots = products.map((product) => ({
  availableQuantity: product.stock,
  businessId,
  id: randomUUID(),
  onHandQuantity: product.stock,
  productId: product.id,
  snapshotDate: now(),
  stockValue: product.stock * product.price,
})) satisfies Prisma.InventorySnapshotCreateManyInput[]

const analyticsCache = [
  {
    businessId,
    calculatedAt: daysAgo(1),
    granularity: "DAILY",
    id: `${businessId}-revenue`,
    metricKey: "revenue",
    periodEnd: now(),
    periodStart: daysAgo(7),
    source: "seed",
    value: 7850,
  },
  {
    businessId,
    calculatedAt: daysAgo(1),
    granularity: "DAILY",
    id: `${businessId}-profit`,
    metricKey: "profit",
    periodEnd: now(),
    periodStart: daysAgo(7),
    source: "seed",
    value: 2450,
  },
  {
    businessId,
    calculatedAt: daysAgo(1),
    granularity: "WEEKLY",
    id: `${businessId}-inventory_turnover`,
    metricKey: "inventory_turnover",
    periodEnd: now(),
    periodStart: daysAgo(7),
    source: "seed",
    value: 3.4,
  },
  {
    businessId,
    calculatedAt: daysAgo(1),
    granularity: "WEEKLY",
    id: `${businessId}-demand_forecast`,
    metricKey: "demand_forecast",
    periodEnd: now(),
    periodStart: daysAgo(7),
    source: "seed",
    value: 1180,
  },
] satisfies Prisma.AnalyticsCacheCreateManyInput[]

const alerts = [
  {
    alertType: "STOCKOUT_RISK",
    businessId,
    id: randomUUID(),
    message: "Scented Disinfectant is at zero stock and needs replenishment.",
    payload: {
      productId: products[3].id,
    } as Prisma.InputJsonValue,
    severity: "CRITICAL",
    status: "UNREAD",
    title: "Low stock alert",
    triggeredAt: daysAgo(1),
    userId: adminUserId,
  },
  {
    alertType: "SYSTEM",
    businessId,
    id: randomUUID(),
    message: "Analytics cache was refreshed from seed data.",
    payload: {
      metric: "analytics_cache",
    } as Prisma.InputJsonValue,
    severity: "LOW",
    status: "READ",
    title: "Seed data loaded",
    triggeredAt: daysAgo(1),
    userId: adminUserId,
  },
] satisfies Prisma.AlertCreateManyInput[]

async function main() {
  await prisma.stockMovement.deleteMany()
  await prisma.transactionItem.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.inventorySnapshot.deleteMany()
  await prisma.analyticsCache.deleteMany()
  await prisma.alert.deleteMany()
  await prisma.userPreference.deleteMany()
  await prisma.businessSettings.deleteMany()
  await prisma.product.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.purchaseOrderItem.deleteMany()
  await prisma.purchaseOrder.deleteMany()
  await prisma.inventoryRecommendation.deleteMany()
  await prisma.forecastEvaluation.deleteMany()
  await prisma.demandForecast.deleteMany()
  await prisma.forecastRun.deleteMany()
  await prisma.demandTrend.deleteMany()
  await prisma.business.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verification.deleteMany()
  await prisma.user.deleteMany()

  await prisma.business.create({
    data: {
      currency: "GHS",
      email: "admin@carbonenterprise.gh",
      id: businessId,
      location: "Accra",
      metadata: {
        industry: "Retail and distribution",
        seeded: true,
      } as Prisma.InputJsonValue,
      name: "Carbon Enterprise",
      onboardingCompleted: true,
      phone: "+233 20 100 2000",
      registrationNumber: "CE-2026-0001",
      slug: "carbon-enterprise",
      status: "ACTIVE",
      taxIdentificationNumber: "TIN-CE-102938",
      taxRate: 15,
      timezone: "Africa/Accra",
      type: "Retail",
    },
  })

  await prisma.businessSettings.create({
    data: {
      adaptiveInsightsEnabled: true,
      analyticsConfig: {
        notificationPreferences: {
          email: true,
          inApp: true,
        },
      } as Prisma.InputJsonValue,
      analyticsWindowDays: 90,
      autoReorderEnabled: true,
      businessId,
      dashboardDefaults: {
        primaryView: "dashboard",
        widgets: ["revenue", "inventory", "activity"],
      } as Prisma.InputJsonValue,
      defaultForecastGranularity: "WEEKLY",
      forecastHorizonDays: 30,
      lowStockThreshold: 10,
      overstockAlertThreshold: 90,
      reorderReviewIntervalDays: 7,
      stockoutAlertThreshold: 3,
    },
  })

  await seedAuthUser({
    businessId,
    email: "admin@carbonenterprise.gh",
    id: adminUserId,
    lastActiveAt: daysAgo(1),
    name: "Administrator",
    password: adminPassword,
    role: "ADMIN",
  })

  await seedAuthUser({
    businessId,
    email: "manager@carbonenterprise.gh",
    id: managerUserId,
    lastActiveAt: daysAgo(2),
    name: "Operations Manager",
    password: managerPassword,
    role: "MANAGER",
  })

  await seedAuthUser({
    businessId,
    email: "ops.lead@carbonenterprise.gh",
    id: operationsUserId,
    lastActiveAt: daysAgo(3),
    name: "Operations Lead",
    password: operationsPassword,
    role: "MANAGER",
  })

  await prisma.product.createMany({ data: products })
  await prisma.customer.createMany({ data: customers })
  await prisma.transaction.createMany({ data: transactions })
  await prisma.transactionItem.createMany({ data: transactionItems })
  await prisma.expense.createMany({ data: expenses })
  await prisma.stockMovement.createMany({ data: stockMovements })
  await prisma.inventorySnapshot.createMany({ data: inventorySnapshots })
  await prisma.analyticsCache.createMany({ data: analyticsCache })
  await prisma.alert.createMany({ data: alerts })

  console.log("Seed data created for Carbon Enterprise")
  console.log("Admin login: admin@carbonenterprise.gh / Admin@2026!")
  console.log("Manager login: manager@carbonenterprise.gh / Manager@2026!")
  console.log(
    "Operations login: ops.lead@carbonenterprise.gh / Operations@2026!"
  )
}

async function seedAuthUser({
  businessId,
  email,
  id,
  lastActiveAt,
  name,
  password,
  role,
}: {
  businessId: string
  email: string
  id: string
  lastActiveAt: Date
  name: string
  password: string
  role: "ADMIN" | "MANAGER"
}) {
  const passwordHash = await hashPassword(password)

  await prisma.user.create({
    data: {
      id,
      businessId,
      email,
      emailVerified: true,
      lastActiveAt,
      name,
      role,
    },
  })

  await prisma.account.create({
    data: {
      accountId: id,
      id: randomUUID(),
      password: passwordHash,
      providerId: "credential",
      userId: id,
    },
  })
}

function daysAgo(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

function now() {
  return new Date()
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
