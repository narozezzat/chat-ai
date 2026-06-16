'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  Table as ReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LoadingState } from '@/components/shared/LoadingState'
import { EmptyState } from '@/components/shared/EmptyState'

interface DataTableProps<TData> {
  table: ReactTable<TData>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[]
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export function DataTable<TData>({
  table,
  columns,
  loading = false,
  emptyTitle = "لا توجد نتائج",
  emptyDescription = "حاول تعديل فلاتر البحث أو إضافة بيانات جديدة.",
}: DataTableProps<TData>): React.JSX.Element {
  if (loading) {
    return <LoadingState variant="skeleton-list" count={5} />
  }

  const rows = table.getRowModel().rows

  return (
    <div className="rounded-2xl border border-border/60 bg-card/10 overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <EmptyState title={emptyTitle} description={emptyDescription} className="border-none min-h-[250px]" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
