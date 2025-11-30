"use client";

import { useState } from "react";
import { cn, getPageNumbers } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowClassNames?: string;
  tableClass?: string;
  cellClassNames?: string;
  pagination?: {
    current_page: number;
    last_page: number;
    total: number;
  };
  onPageChange?: (page: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowClassNames,
  tableClass,
  cellClassNames,
  pagination,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});

  const currentPage = pagination?.current_page || 1;
  const totalPages = pagination?.last_page || 1;

  const pageNumbers = getPageNumbers({ currentPage, totalPages });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: pagination?.last_page || 1,
    state: {
      rowSelection,
    },
  });

  return (
    <div className="space-y-4 relative">
      <div className="rounded-md max-w-full overflow-x-auto p-4">
        <Table
          className={cn(
            "border-separate border-spacing-y-3 min-w-full",
            tableClass,
          )}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-transparent text-nowrap"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(rowClassNames)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className={cn("text-nowrap", cellClassNames)}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <Pagination className="my-4 sticky bottom-4 mt-auto py-4 bg-transparent backdrop-blur">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange?.(currentPage - 1)}
                className={cn(
                  "cursor-pointer",
                  currentPage <= 1 && "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>

            {pageNumbers.map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => onPageChange?.(Number(page))}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange?.(currentPage + 1)}
                className={cn(
                  "cursor-pointer",
                  currentPage >= totalPages && "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
