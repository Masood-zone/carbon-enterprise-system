-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ThemeMode" AS ENUM ('SYSTEM', 'LIGHT', 'DARK');

-- CreateEnum
CREATE TYPE "ForecastGranularity" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "ForecastStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TrendDirection" AS ENUM ('UP', 'DOWN', 'STABLE', 'VOLATILE');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('SALE', 'PURCHASE', 'RETURN', 'ADJUSTMENT', 'TRANSFER', 'COUNT', 'WRITE_OFF');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('DRAFT', 'SENT', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RecommendationType" AS ENUM ('REORDER', 'STOCK_REDUCTION', 'PROMOTION', 'PRICE_ADJUSTMENT', 'TRANSFER', 'PURCHASE_PLAN');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('NEW', 'ACKNOWLEDGED', 'APPLIED', 'DISMISSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "InsightPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('STOCKOUT_RISK', 'OVERSTOCK_RISK', 'DEMAND_SPIKE', 'DEMAND_DROP', 'FORECAST_DEVIATION', 'REORDER_DUE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'VOIDED', 'REFUNDED');

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_businessId_fkey";

-- AlterTable
ALTER TABLE "AnalyticsCache" DROP COLUMN "createdAt",
DROP COLUMN "metric",
DROP COLUMN "period",
ADD COLUMN     "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "granularity" "ForecastGranularity" NOT NULL DEFAULT 'DAILY',
ADD COLUMN     "metricKey" TEXT NOT NULL,
ADD COLUMN     "payload" JSONB,
ADD COLUMN     "periodEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "periodStart" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "productId" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "sourceId" TEXT;

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "email" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "status" "BusinessStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "taxIdentificationNumber" TEXT,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Africa/Accra';

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastPurchaseAt" TIMESTAMP(3),
ADD COLUMN     "lifetimeValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "segment" TEXT;

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "vendorName" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "costPrice" DOUBLE PRECISION,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastStockCountedAt" TIMESTAMP(3),
ADD COLUMN     "leadTimeDays" INTEGER,
ADD COLUMN     "reorderPoint" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reorderQuantity" INTEGER,
ADD COLUMN     "reservedStock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "safetyStock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "unitOfMeasure" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "costAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "profitAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "soldAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "soldByUserId" TEXT,
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'COMPLETED',
ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "transactionNumber" TEXT;

-- AlterTable
ALTER TABLE "TransactionItem" ADD COLUMN     "costPrice" DOUBLE PRECISION,
ADD COLUMN     "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "lineTotal" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "lastActiveAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BusinessSettings" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "defaultForecastGranularity" "ForecastGranularity" NOT NULL DEFAULT 'WEEKLY',
    "forecastHorizonDays" INTEGER NOT NULL DEFAULT 30,
    "analyticsWindowDays" INTEGER NOT NULL DEFAULT 90,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 10,
    "reorderReviewIntervalDays" INTEGER NOT NULL DEFAULT 7,
    "stockoutAlertThreshold" INTEGER NOT NULL DEFAULT 3,
    "overstockAlertThreshold" INTEGER NOT NULL DEFAULT 90,
    "autoReorderEnabled" BOOLEAN NOT NULL DEFAULT false,
    "adaptiveInsightsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "dashboardDefaults" JSONB,
    "analyticsConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "themeMode" "ThemeMode" NOT NULL DEFAULT 'SYSTEM',
    "compactMode" BOOLEAN NOT NULL DEFAULT false,
    "preferredLandingPage" TEXT,
    "timezone" TEXT,
    "language" TEXT,
    "dateFormat" TEXT,
    "dashboardLayout" JSONB,
    "filterState" JSONB,
    "notificationSettings" JSONB,
    "adaptiveSignals" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "leadTimeDays" INTEGER,
    "paymentTerms" TEXT,
    "reliabilityScore" DOUBLE PRECISION,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "createdByUserId" TEXT,
    "orderNumber" TEXT NOT NULL,
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "orderedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedDeliveryAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrderItem" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "receivedQuantity" INTEGER NOT NULL DEFAULT 0,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lineTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "PurchaseOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "transactionItemId" TEXT,
    "purchaseOrderItemId" TEXT,
    "performedByUserId" TEXT,
    "movementType" "StockMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DOUBLE PRECISION,
    "balanceBefore" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "notes" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventorySnapshot" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "onHandQuantity" INTEGER NOT NULL,
    "reservedQuantity" INTEGER NOT NULL DEFAULT 0,
    "availableQuantity" INTEGER NOT NULL,
    "averageDailySales" DOUBLE PRECISION,
    "projectedDaysOfCover" DOUBLE PRECISION,
    "stockValue" DOUBLE PRECISION,
    "demandRiskScore" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventorySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForecastRun" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "createdByUserId" TEXT,
    "modelName" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "granularity" "ForecastGranularity" NOT NULL DEFAULT 'WEEKLY',
    "horizonDays" INTEGER NOT NULL,
    "inputStartDate" TIMESTAMP(3) NOT NULL,
    "inputEndDate" TIMESTAMP(3) NOT NULL,
    "status" "ForecastStatus" NOT NULL DEFAULT 'QUEUED',
    "config" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,

    CONSTRAINT "ForecastRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandForecast" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "forecastRunId" TEXT NOT NULL,
    "forecastDate" TIMESTAMP(3) NOT NULL,
    "horizonStart" TIMESTAMP(3) NOT NULL,
    "horizonEnd" TIMESTAMP(3) NOT NULL,
    "predictedDemand" DOUBLE PRECISION NOT NULL,
    "lowerBound" DOUBLE PRECISION,
    "upperBound" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,
    "trendDirection" "TrendDirection" NOT NULL DEFAULT 'STABLE',
    "seasonalFactor" DOUBLE PRECISION,
    "stockoutRisk" DOUBLE PRECISION,
    "surplusRisk" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemandForecast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForecastEvaluation" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "demandForecastId" TEXT NOT NULL,
    "actualDemand" DOUBLE PRECISION NOT NULL,
    "predictedDemand" DOUBLE PRECISION NOT NULL,
    "absoluteError" DOUBLE PRECISION NOT NULL,
    "percentageError" DOUBLE PRECISION,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "ForecastEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandTrend" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "productId" TEXT,
    "metricKey" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "direction" "TrendDirection" NOT NULL,
    "growthRate" DOUBLE PRECISION,
    "volatility" DOUBLE PRECISION,
    "signalStrength" DOUBLE PRECISION,
    "summary" TEXT,
    "evidence" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemandTrend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryRecommendation" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "productId" TEXT,
    "supplierId" TEXT,
    "recommendationType" "RecommendationType" NOT NULL,
    "priority" "InsightPriority" NOT NULL DEFAULT 'MEDIUM',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rationale" JSONB,
    "expectedImpact" DOUBLE PRECISION,
    "suggestedAction" TEXT,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'NEW',
    "dueAt" TIMESTAMP(3),
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "appliedAt" TIMESTAMP(3),
    "dismissedAt" TIMESTAMP(3),

    CONSTRAINT "InventoryRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "userId" TEXT,
    "alertType" "AlertType" NOT NULL,
    "severity" "InsightPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "AlertStatus" NOT NULL DEFAULT 'UNREAD',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sourceModel" TEXT,
    "sourceId" TEXT,
    "payload" JSONB,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessSettings_businessId_key" ON "BusinessSettings"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "Supplier_businessId_name_idx" ON "Supplier"("businessId", "name");

-- CreateIndex
CREATE INDEX "PurchaseOrder_businessId_status_orderedAt_idx" ON "PurchaseOrder"("businessId", "status", "orderedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_businessId_orderNumber_key" ON "PurchaseOrder"("businessId", "orderNumber");

-- CreateIndex
CREATE INDEX "PurchaseOrderItem_purchaseOrderId_idx" ON "PurchaseOrderItem"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "PurchaseOrderItem_productId_idx" ON "PurchaseOrderItem"("productId");

-- CreateIndex
CREATE INDEX "StockMovement_businessId_productId_recordedAt_idx" ON "StockMovement"("businessId", "productId", "recordedAt");

-- CreateIndex
CREATE INDEX "InventorySnapshot_businessId_snapshotDate_idx" ON "InventorySnapshot"("businessId", "snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "InventorySnapshot_businessId_productId_snapshotDate_key" ON "InventorySnapshot"("businessId", "productId", "snapshotDate");

-- CreateIndex
CREATE INDEX "ForecastRun_businessId_startedAt_idx" ON "ForecastRun"("businessId", "startedAt");

-- CreateIndex
CREATE INDEX "DemandForecast_businessId_productId_horizonStart_horizonEnd_idx" ON "DemandForecast"("businessId", "productId", "horizonStart", "horizonEnd");

-- CreateIndex
CREATE INDEX "ForecastEvaluation_businessId_productId_evaluatedAt_idx" ON "ForecastEvaluation"("businessId", "productId", "evaluatedAt");

-- CreateIndex
CREATE INDEX "DemandTrend_businessId_productId_periodEnd_idx" ON "DemandTrend"("businessId", "productId", "periodEnd");

-- CreateIndex
CREATE INDEX "InventoryRecommendation_businessId_status_priority_idx" ON "InventoryRecommendation"("businessId", "status", "priority");

-- CreateIndex
CREATE INDEX "Alert_businessId_userId_status_triggeredAt_idx" ON "Alert"("businessId", "userId", "status", "triggeredAt");

-- CreateIndex
CREATE INDEX "AnalyticsCache_businessId_metricKey_granularity_periodStart_idx" ON "AnalyticsCache"("businessId", "metricKey", "granularity", "periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");

-- CreateIndex
CREATE INDEX "Customer_businessId_name_idx" ON "Customer"("businessId", "name");

-- CreateIndex
CREATE INDEX "Expense_businessId_occurredAt_idx" ON "Expense"("businessId", "occurredAt");

-- CreateIndex
CREATE INDEX "Product_businessId_name_idx" ON "Product"("businessId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_businessId_sku_key" ON "Product"("businessId", "sku");

-- CreateIndex
CREATE INDEX "Transaction_businessId_soldAt_idx" ON "Transaction"("businessId", "soldAt");

-- CreateIndex
CREATE INDEX "Transaction_customerId_idx" ON "Transaction"("customerId");

-- CreateIndex
CREATE INDEX "Transaction_soldByUserId_idx" ON "Transaction"("soldByUserId");

-- CreateIndex
CREATE INDEX "TransactionItem_transactionId_idx" ON "TransactionItem"("transactionId");

-- CreateIndex
CREATE INDEX "TransactionItem_productId_idx" ON "TransactionItem"("productId");

-- AddForeignKey
ALTER TABLE "BusinessSettings" ADD CONSTRAINT "BusinessSettings_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_soldByUserId_fkey" FOREIGN KEY ("soldByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsCache" ADD CONSTRAINT "AnalyticsCache_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsCache" ADD CONSTRAINT "AnalyticsCache_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_transactionItemId_fkey" FOREIGN KEY ("transactionItemId") REFERENCES "TransactionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_purchaseOrderItemId_fkey" FOREIGN KEY ("purchaseOrderItemId") REFERENCES "PurchaseOrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_performedByUserId_fkey" FOREIGN KEY ("performedByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySnapshot" ADD CONSTRAINT "InventorySnapshot_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventorySnapshot" ADD CONSTRAINT "InventorySnapshot_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForecastRun" ADD CONSTRAINT "ForecastRun_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForecastRun" ADD CONSTRAINT "ForecastRun_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandForecast" ADD CONSTRAINT "DemandForecast_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandForecast" ADD CONSTRAINT "DemandForecast_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandForecast" ADD CONSTRAINT "DemandForecast_forecastRunId_fkey" FOREIGN KEY ("forecastRunId") REFERENCES "ForecastRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForecastEvaluation" ADD CONSTRAINT "ForecastEvaluation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForecastEvaluation" ADD CONSTRAINT "ForecastEvaluation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForecastEvaluation" ADD CONSTRAINT "ForecastEvaluation_demandForecastId_fkey" FOREIGN KEY ("demandForecastId") REFERENCES "DemandForecast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandTrend" ADD CONSTRAINT "DemandTrend_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandTrend" ADD CONSTRAINT "DemandTrend_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryRecommendation" ADD CONSTRAINT "InventoryRecommendation_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryRecommendation" ADD CONSTRAINT "InventoryRecommendation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryRecommendation" ADD CONSTRAINT "InventoryRecommendation_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
