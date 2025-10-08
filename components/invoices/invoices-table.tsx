"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, FileDown, Eye, Trash2, Calendar } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

type Invoice = {
  invoice: {
    id: number;
    invoiceNumber: string;
    totalAmount: string;
    issueDate: Date | string;
    status: "unpaid" | "paid" | "void" | null;
  };
  appointment: {
    id: number;
  } | null;
  patient: {
    id: number;
    name: string;
    recordNumber: string;
  } | null;
};

export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = React.useState<number | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Date range filter state - initialized without default to prevent hydration issues
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);

  // Set default dates on mount to prevent hydration mismatch
  React.useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setStartDate(today);
    setEndDate(today);
  }, []);

  // Apply date filter
  const applyDateFilter = () => {
    const params = new URLSearchParams();
    if (startDate) {
      params.set("startDate", startDate.toISOString());
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      params.set("endDate", endOfDay.toISOString());
    }
    router.push(`/dashboard/invoices?${params.toString()}`);
  };

  // Clear date filter
  const clearDateFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    router.push("/dashboard/invoices");
  };

  const handleExport = async () => {
    try {
      const response = await fetch("/api/invoices/export");
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoices-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Invoices exported successfully");
    } catch {
      toast.error("Failed to export invoices");
    }
  };

  const handleDelete = async () => {
    if (!invoiceToDelete) return;

    setIsDeleting(true);
    try {
      const { deleteInvoice } = await import("@/app/actions/invoices");
      const result = await deleteInvoice(invoiceToDelete);

      if (result.success) {
        toast.success("Invoice deleted successfully");
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to delete invoice");
      }
    } catch {
      toast.error("Failed to delete invoice");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    }
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      id: "invoiceNumber",
      accessorFn: (row) => row.invoice.invoiceNumber,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Invoice #
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const invoice = row.original.invoice;
        return (
          <Link href={`/dashboard/invoices/${invoice.id}`}>
            <div className="font-medium hover:underline cursor-pointer">
              {invoice.invoiceNumber}
            </div>
          </Link>
        );
      },
    },
    {
      id: "patient",
      accessorFn: (row) => row.patient?.name || "Unknown",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Patient
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const patient = row.original.patient;
        return patient ? (
          <Link href={`/dashboard/patients/${patient.id}`}>
            <div className="hover:underline cursor-pointer">
              <div className="font-medium">{patient.name}</div>
              <div className="text-sm text-muted-foreground">
                {patient.recordNumber}
              </div>
            </div>
          </Link>
        ) : (
          <div>
            <div className="font-medium">Unknown</div>
          </div>
        );
      },
    },
    {
      id: "issueDate",
      accessorFn: (row) => row.invoice.issueDate,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.original.invoice.issueDate);
        const appointment = row.original.appointment;
        return appointment ? (
          <Link href={`/dashboard/appointments/${appointment.id}`}>
            <div className="hover:underline cursor-pointer">{date.toLocaleDateString()}</div>
          </Link>
        ) : (
          <div>{date.toLocaleDateString()}</div>
        );
      },
    },
    {
      id: "totalAmount",
      accessorFn: (row) => row.invoice.totalAmount,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.original.invoice.totalAmount);
        const formatted = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      id: "status",
      accessorFn: (row) => row.invoice.status,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.original.invoice.status;
        return (
          <Badge
            variant={
              status === "paid"
                ? "default"
                : status === "unpaid"
                ? "secondary"
                : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const invoice = row.original.invoice;
        return (
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/invoices/${invoice.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Eye className="h-4 w-4" />
                <span className="sr-only">View invoice</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => {
                setInvoiceToDelete(invoice.id);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete invoice</span>
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: invoices,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Input
            placeholder="Search by patient name..."
            value={(table.getColumn("patient")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("patient")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) =>
                      startDate ? date < startDate : false
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={applyDateFilter} className="flex-1">
                    Apply Filter
                  </Button>
                  <Button onClick={clearDateFilter} variant="outline" className="flex-1">
                    Clear
                  </Button>
                </div>
                {startDate && endDate && (
                  <div className="text-xs text-muted-foreground">
                    {format(startDate, "MMM dd, yyyy")} - {format(endDate, "MMM dd, yyyy")}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handleExport} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} invoice(s) total
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
