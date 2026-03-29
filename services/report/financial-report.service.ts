import { prisma } from "@/lib/prisma"

function getDayKey(value: Date) {
  return value.toISOString().slice(0, 10)
}

function mergeDaySeries(
  transactions: Array<{ soldAt: Date; totalAmount: number }>,
  expenses: Array<{ occurredAt: Date; amount: number }>
) {
  const series = new Map<
    string,
    {
      expenses: number
      revenue: number
    }
  >()

  for (const transaction of transactions) {
    const dayKey = getDayKey(transaction.soldAt)
    const bucket = series.get(dayKey) ?? { expenses: 0, revenue: 0 }
    bucket.revenue += transaction.totalAmount
    series.set(dayKey, bucket)
  }

  for (const expense of expenses) {
    const dayKey = getDayKey(expense.occurredAt)
    const bucket = series.get(dayKey) ?? { expenses: 0, revenue: 0 }
    bucket.expenses += expense.amount
    series.set(dayKey, bucket)
  }

  return Array.from(series.entries())
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([day, totals]) => ({
      ...totals,
      day,
      netProfit: totals.revenue - totals.expenses,
    }))
}

export class FinancialReportService {
  static async getFinancialSummary(businessId: string) {
    const [revenueAggregate, expensesAggregate] = await Promise.all([
      prisma.transaction.aggregate({
        where: { businessId },
        _sum: { totalAmount: true },
      }),
      prisma.expense.aggregate({
        where: { businessId },
        _sum: { amount: true },
      }),
    ])

    const totalRevenue = revenueAggregate._sum.totalAmount ?? 0
    const totalExpenses = expensesAggregate._sum.amount ?? 0
    const [transactions, expenses] = await Promise.all([
      prisma.transaction.findMany({
        where: { businessId },
        orderBy: { soldAt: "asc" },
        select: {
          soldAt: true,
          totalAmount: true,
        },
      }),
      prisma.expense.findMany({
        where: { businessId },
        orderBy: { occurredAt: "asc" },
        select: {
          amount: true,
          occurredAt: true,
        },
      }),
    ])

    return {
      netProfit: totalRevenue - totalExpenses,
      trendSeries: mergeDaySeries(transactions, expenses),
      totalExpenses,
      totalRevenue,
    }
  }

  static async getProfitLoss(businessId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { businessId },
      orderBy: { soldAt: "asc" },
      select: {
        soldAt: true,
        totalAmount: true,
      },
    })

    const expenses = await prisma.expense.findMany({
      where: { businessId },
      orderBy: { occurredAt: "asc" },
      select: {
        amount: true,
        occurredAt: true,
      },
    })

    return {
      expenses,
      series: mergeDaySeries(transactions, expenses),
      transactions,
    }
  }

  static async getCashFlow(businessId: string) {
    const [sales, expenses] = await Promise.all([
      prisma.transaction.findMany({
        where: { businessId },
        orderBy: { soldAt: "asc" },
        select: {
          soldAt: true,
          totalAmount: true,
        },
      }),
      prisma.expense.findMany({
        where: { businessId },
        orderBy: { occurredAt: "asc" },
        select: {
          amount: true,
          occurredAt: true,
        },
      }),
    ])

    return {
      expenses,
      series: mergeDaySeries(sales, expenses),
      sales,
    }
  }
}
