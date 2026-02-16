"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

export interface Column<T> {
  key: string
  header: React.ReactNode
  accessor?: (row: T) => React.ReactNode
  render?: (row: T, index: number) => React.ReactNode
  align?: "left" | "right" | "center"
  className?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  getRowId?: (row: T, index: number) => string | number
  actions?: (row: T, index: number) => React.ReactNode
  actionsHeader?: string
  emptyMessage?: string
  className?: string
  headerClassName?: string
  stickyHeader?: boolean
  rowClassName?: (row: T, index: number) => string
  onRowClick?: (row: T, index: number) => void
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  actions,
  actionsHeader = "Actions",
  emptyMessage = "No data available",
  className,
  headerClassName,
  stickyHeader = false,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  const getRowKey = (row: T, index: number): string | number => {
    if (getRowId) {
      return getRowId(row, index)
    }
    // Try to find an 'id' property
    if (typeof row === "object" && row !== null && "id" in row) {
      return (row as { id: string | number }).id
    }
    return index
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow className={cn("bg-primary text-white hover:bg-primary", headerClassName)}>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "p-3 font-semibold text-white",
                  stickyHeader && "sticky top-0 z-20",
                  column.align === "right" && "text-right",
                  column.align === "center" && "text-center",
                  column.className
                )}
              >
                {column.header}
              </TableHead>
            ))}
            {actions && (
              <TableHead
                className={cn(
                  "p-3 font-semibold text-right text-white",
                  stickyHeader && "sticky top-0 z-20",
                  headerClassName,
                )}
              >
                {actionsHeader}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center p-8 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const rowKey = getRowKey(row, index)
              const customRowClassName = rowClassName
                ? rowClassName(row, index)
                : `border-b last:border-b-0 ${index % 2 === 0
                  ? "bg-white hover:bg-white"
                  : "bg-muted/20 hover:bg-muted/20"
                }`

              return (
                <TableRow
                  key={rowKey}
                  className={cn(customRowClassName, onRowClick && "cursor-pointer")}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {columns.map((column) => {
                    const content = column.render
                      ? column.render(row, index)
                      : column.accessor
                        ? column.accessor(row)
                        : typeof row === "object" && row !== null && column.key in row
                          ? String((row as Record<string, unknown>)[column.key])
                          : "-"

                    return (
                      <TableCell
                        key={column.key}
                        className={cn(
                          "p-3",
                          column.align === "right" && "text-right",
                          column.align === "center" && "text-center",
                          column.className
                        )}
                      >
                        {content}
                      </TableCell>
                    )
                  })}
                  {actions && (
                    <TableCell className="p-3">
                      <div className="flex items-center justify-end gap-2 [&_button]:cursor-pointer">
                        {actions(row, index)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

