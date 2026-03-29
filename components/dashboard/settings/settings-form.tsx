"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

type SettingsFormValues = {
  adaptiveInsightsEnabled: boolean
  analyticsWindowDays: number
  autoReorderEnabled: boolean
  lowStockThreshold: number
  overstockAlertThreshold: number
  reorderReviewIntervalDays: number
  stockoutAlertThreshold: number
}

export function DashboardSettingsForm({
  initialValues,
  lastUpdatedLabel,
}: {
  initialValues: SettingsFormValues
  lastUpdatedLabel?: string
}) {
  const [values, setValues] = useState(initialValues)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<{
    kind: "idle" | "error" | "success"
    message: string
  }>({
    kind: "idle",
    message: "",
  })

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setStatus({ kind: "idle", message: "" })

    try {
      const response = await fetch("/api/admin/settings", {
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      })
      const payload = (await response.json()) as {
        error?: string
        ok?: boolean
        settings?: { updatedAt?: string }
      }

      if (!response.ok || payload.ok === false) {
        throw new Error(payload.error ?? "Unable to update settings")
      }

      setStatus({
        kind: "success",
        message: "Settings updated successfully.",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Update failed"
      setStatus({ kind: "error", message })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form
      className="border border-border bg-card p-4 text-card-foreground"
      onSubmit={handleSubmit}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Operational settings
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Update the live business settings and thresholds used across the
            dashboard.
          </p>
        </div>
        {lastUpdatedLabel ? (
          <p className="text-right text-xs text-muted-foreground">
            Last updated
            <br />
            {lastUpdatedLabel}
          </p>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4">
        <SettingRow
          description="Enable predictive and adaptive dashboard suggestions."
          label="Adaptive insights"
        >
          <Switch
            checked={values.adaptiveInsightsEnabled}
            onCheckedChange={(checked) =>
              setValues((current) => ({
                ...current,
                adaptiveInsightsEnabled: Boolean(checked),
              }))
            }
          />
        </SettingRow>

        <SettingRow
          description="Automatically suggest replenishment workflows when stock is low."
          label="Auto reorder"
        >
          <Switch
            checked={values.autoReorderEnabled}
            onCheckedChange={(checked) =>
              setValues((current) => ({
                ...current,
                autoReorderEnabled: Boolean(checked),
              }))
            }
          />
        </SettingRow>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Low stock threshold"
            value={values.lowStockThreshold}
            onChange={(nextValue) =>
              setValues((current) => ({
                ...current,
                lowStockThreshold: nextValue,
              }))
            }
          />
          <NumberField
            label="Analytics window days"
            value={values.analyticsWindowDays}
            onChange={(nextValue) =>
              setValues((current) => ({
                ...current,
                analyticsWindowDays: nextValue,
              }))
            }
          />
          <NumberField
            label="Stockout alert threshold"
            value={values.stockoutAlertThreshold}
            onChange={(nextValue) =>
              setValues((current) => ({
                ...current,
                stockoutAlertThreshold: nextValue,
              }))
            }
          />
          <NumberField
            label="Overstock alert threshold"
            value={values.overstockAlertThreshold}
            onChange={(nextValue) =>
              setValues((current) => ({
                ...current,
                overstockAlertThreshold: nextValue,
              }))
            }
          />
          <NumberField
            label="Reorder review interval days"
            value={values.reorderReviewIntervalDays}
            onChange={(nextValue) =>
              setValues((current) => ({
                ...current,
                reorderReviewIntervalDays: nextValue,
              }))
            }
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <Button disabled={isSaving} type="submit">
            {isSaving ? "Saving..." : "Save settings"}
          </Button>
          {status.kind !== "idle" ? (
            <p
              className={
                status.kind === "error"
                  ? "text-sm text-red-600"
                  : "text-sm text-emerald-600"
              }
            >
              {status.message}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  )
}

function SettingRow({
  children,
  description,
  label,
}: {
  children: React.ReactNode
  description: string
  label: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 border border-border bg-background px-3 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  )
}

function NumberField({
  label,
  onChange,
  value,
}: {
  label: string
  onChange: (value: number) => void
  value: number
}) {
  return (
    <label className="grid gap-2 text-sm text-foreground">
      <span className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
        {label}
      </span>
      <input
        className="carbon-input"
        min={0}
        onChange={(event) => onChange(Number(event.target.value || 0))}
        type="number"
        value={value}
      />
    </label>
  )
}
