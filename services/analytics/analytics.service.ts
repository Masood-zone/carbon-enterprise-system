import {
  formatAnalyticsMetricValue,
  formatAnalyticsPeriodRange,
  getAnalyticsMetricMeta,
  getAnalyticsPeriodLabel,
  getAnalyticsPeriodRange,
  type AnalyticsMetricKey,
  type AnalyticsPeriod,
} from "@/lib/analytics"
import { notificationsService } from "@/lib/notifications"
import { prisma } from "@/lib/prisma"

import { MetricsService } from "./metrics.service"

export type { AnalyticsMetricKey, AnalyticsPeriod } from "@/lib/analytics"

export type AnalyticsRecomputeOptions = {
  granularity?: AnalyticsPeriod
  metricKeys?: AnalyticsMetricKey[]
}

export class AnalyticsService {
  static async listAnalytics(businessId: string) {
    return prisma.analyticsCache.findMany({
      where: { businessId },
      orderBy: { calculatedAt: "desc" },
    })
  }

  static async getMetric(businessId: string, metricKey: string) {
    return prisma.analyticsCache.findMany({
      where: { businessId, metricKey },
      orderBy: { periodStart: "desc" },
    })
  }

  static async recompute(
    businessId: string,
    options: AnalyticsRecomputeOptions = {}
  ) {
    const keys =
      options.metricKeys && options.metricKeys.length
        ? options.metricKeys
        : ["revenue", "profit", "inventory_turnover"]
    const granularity = options.granularity ?? "DAILY"
    const now = new Date()
    const periodRange = getAnalyticsPeriodRange(now, granularity)

    const computedMetrics = await Promise.all(
      keys.map(async (metricKey) => {
        let value = 0

        if (metricKey === "revenue") {
          value = await MetricsService.computeRevenue(businessId)
        }

        if (metricKey === "profit") {
          value = await MetricsService.computeProfit(businessId)
        }

        if (metricKey === "inventory_turnover") {
          value = await MetricsService.computeInventoryTurnover(businessId)
        }

        if (metricKey === "demand_forecast") {
          value = await prisma.demandForecast
            .aggregate({
              where: { businessId },
              _sum: { predictedDemand: true },
            })
            .then((aggregate) => aggregate._sum.predictedDemand ?? 0)
        }

        return prisma.analyticsCache.upsert({
          where: {
            id: `${businessId}-${metricKey}`,
          },
          create: {
            id: `${businessId}-${metricKey}`,
            businessId,
            metricKey,
            granularity,
            periodStart: periodRange.start,
            periodEnd: periodRange.end,
            value,
            source: "admin-recompute",
            calculatedAt: now,
          },
          update: {
            value,
            source: "admin-recompute",
            granularity,
            periodStart: periodRange.start,
            periodEnd: periodRange.end,
            calculatedAt: now,
          },
        })
      })
    )

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        name: true,
        users: {
          where: { role: "ADMIN" },
          select: {
            email: true,
            id: true,
            name: true,
          },
        },
      },
    })

    if (!business?.users.length) {
      return computedMetrics
    }

    const summaryMetrics = computedMetrics.map((entry) => ({
      metricKey: entry.metricKey as AnalyticsMetricKey,
      value: entry.value,
    }))
    const notificationKey = `${businessId}:${granularity}:${periodRange.start.toISOString()}:${[...keys].sort().join(",")}`
    const existingAlert = await prisma.alert.findFirst({
      where: {
        businessId,
        sourceId: notificationKey,
        sourceModel: "analytics-summary",
      },
      select: { id: true },
    })

    if (existingAlert) {
      return computedMetrics
    }

    const periodLabel = getAnalyticsPeriodLabel(granularity)
    const periodRangeLabel = formatAnalyticsPeriodRange(
      periodRange.start,
      periodRange.end
    )
    const summaryMessage = summaryMetrics
      .map((metric) => {
        const meta = getAnalyticsMetricMeta(metric.metricKey)
        return `${meta.label}: ${formatAnalyticsMetricValue(metric.metricKey, metric.value)}`
      })
      .join("; ")

    await prisma.alert.createMany({
      data: business.users.map((adminUser) => ({
        alertType: "SYSTEM",
        businessId,
        message: `${periodLabel} analytics summary for ${business.name} (${periodRangeLabel}) is ready. ${summaryMessage}`,
        payload: {
          metrics: summaryMetrics,
          period: granularity,
          periodEnd: periodRange.end.toISOString(),
          periodStart: periodRange.start.toISOString(),
        },
        severity: "MEDIUM",
        sourceId: notificationKey,
        sourceModel: "analytics-summary",
        title: `${periodLabel} analytics summary is ready`,
        userId: adminUser.id,
      })),
    })

    await Promise.allSettled(
      business.users.map((adminUser) =>
        notificationsService.sendAnalyticsSummaryEmail({
          businessName: business.name,
          metrics: summaryMetrics,
          period: granularity,
          periodEnd: periodRange.end,
          periodStart: periodRange.start,
          recipientEmail: adminUser.email,
          recipientName: adminUser.name,
        })
      )
    )

    return computedMetrics
  }
}
