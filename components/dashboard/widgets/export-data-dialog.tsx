"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { MaterialSymbol } from "@/components/common/MaterialSymbol"

type ExportFormat = "pdf" | "xlsx" | "csv"

type ExportOption = {
  format: ExportFormat
  icon: string
  title: string
  description: string
}

const exportOptions: ExportOption[] = [
  {
    format: "pdf",
    icon: "picture_as_pdf",
    title: "PDF Report",
    description: "Best for presentations and offline viewing. Includes tables.",
  },
  {
    format: "xlsx",
    icon: "grid_on",
    title: "Excel Spreadsheet (.xlsx)",
    description: "Detailed data breakdown for formulas and formatting.",
  },
  {
    format: "csv",
    icon: "table_chart",
    title: "CSV Data",
    description: "Raw data format. Best for importing into other systems.",
  },
]

export function ExportDataDialog(props: {
  title?: string
  description: string
  exportPath: string
  triggerLabel?: string
  datasetLabel: string
}) {
  const {
    title = "Export Data",
    description,
    exportPath,
    triggerLabel = "Export data",
    datasetLabel,
  } = props

  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<ExportFormat>("pdf")
  const [isGenerating, setIsGenerating] = useState(false)

  const selectedOption = useMemo(
    () => exportOptions.find((option) => option.format === format),
    [format]
  )

  const onGenerate = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch(`${exportPath}?format=${format}`, {
        method: "GET",
      })

      if (!response.ok) {
        const text = await response.text().catch(() => "")
        throw new Error(text || `Export failed (${response.status})`)
      }

      const blob = await response.blob()
      const header = response.headers.get("content-disposition")
      const filename =
        parseFilenameFromContentDisposition(header) ||
        `${datasetLabel.replaceAll(/\s+/g, "-").toLowerCase()}.${format}`

      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = filename
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(url)

      toast.success(
        selectedOption
          ? `${selectedOption.title} export generated.`
          : "Export generated."
      )
      setOpen(false)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to export"
      toast.error(message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>{triggerLabel}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {exportOptions.map((option) => {
            const selected = option.format === format
            return (
              <button
                key={option.format}
                className={
                  "flex w-full items-start justify-between gap-4 border border-border bg-card p-3 text-left transition-colors hover:bg-muted" +
                  (selected ? " ring-1 ring-ring" : "")
                }
                type="button"
                onClick={() => setFormat(option.format)}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 items-center justify-center border border-border bg-background text-muted-foreground">
                    <MaterialSymbol icon={option.icon} className="text-base" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {option.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>

                <span
                  aria-hidden="true"
                  className={
                    "mt-1 size-4 rounded-full border border-border" +
                    (selected ? " bg-primary" : " bg-background")
                  }
                />
              </button>
            )
          })}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onGenerate} disabled={isGenerating}>
            {isGenerating ? <Spinner className="mr-1" /> : null}
            Generate export
            <MaterialSymbol icon="arrow_forward" className="ml-1" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function parseFilenameFromContentDisposition(header: string | null) {
  if (!header) return null
  const match = header.match(/filename\*?=(?:UTF-8''|\")?([^;\"\n]+)\"?/i)
  return match?.[1]?.trim() ?? null
}
