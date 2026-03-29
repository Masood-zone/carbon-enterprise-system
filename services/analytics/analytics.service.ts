import { prisma } from "@/lib/prisma"

import { MetricsService } from "./metrics.service"

export type AnalyticsMetricKey =
  | "demand_forecast"
  | "inventory_turnover"
  | "profit"
  | "revenue"

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

  static async recompute(businessId: string, metricKeys?: AnalyticsMetricKey[]) {
    const keys = metricKeys && metricKeys.length ? metricKeys : ["revenue", "profit", "inventory_turnover"]
    const now = new Date()

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
          value = await prisma.demandForecast.aggregate({
            where: { businessId },
            _sum: { predictedDemand: true },
          }).then((aggregate) => aggregate._sum.predictedDemand ?? 0)
        }

        return prisma.analyticsCache.upsert({
          where: {
            id: `${businessId}-${metricKey}`,
          },
          create: {
            id: `${businessId}-${metricKey}`,
            businessId,
            metricKey,
            granularity: "DAILY",
            periodStart: now,
            periodEnd: now,
            value,
            source: "admin-recompute",
            calculatedAt: now,
          },
          update: {
            value,
            source: "admin-recompute",
            periodStart: now,
            periodEnd: now,
            calculatedAt: now,
          },
        })
      })
    )

    return computedMetrics
  }
}
