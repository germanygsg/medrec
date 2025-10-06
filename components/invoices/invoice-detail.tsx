"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateInvoiceStatus } from "@/app/actions/invoices";

type InvoiceDetailProps = {
  invoice: {
    id: number;
    invoiceNumber: string;
    totalAmount: string;
    issueDate: Date | string;
    status: "unpaid" | "paid" | "void" | null;
  };
  patient: {
    id: number;
    name: string;
    recordNumber: string;
    address: string | null;
  } | null;
  appointment: {
    id: number;
    appointmentDate: Date | string;
  } | null;
  treatments: Array<{
    treatment: {
      id: number;
      name: string;
      description: string | null;
    } | null;
    priceAtTime: string;
  }>;
};

export function InvoiceDetail({
  invoice,
  patient,
  appointment,
  treatments,
}: InvoiceDetailProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = async (
    newStatus: "unpaid" | "paid" | "void"
  ) => {
    setIsUpdating(true);
    try {
      const result = await updateInvoiceStatus(invoice.id, newStatus);
      if (result.success) {
        toast.success("Invoice status updated");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      {/* Actions - Hidden on print */}
      <div className="mb-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Status:</span>
          <Select
            value={invoice.status || "unpaid"}
            onValueChange={handleStatusChange}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="void">Void</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
      </div>

      {/* Invoice Content - Printable */}
      <Card className="print:border-0 print:shadow-none" id="invoice-content">
        <CardContent className="p-8 print:p-0">
          {/* Print Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">BSP CENTER PHYSIOTHERAPY CLINIC</h1>
            <p className="text-sm">Ruko Rose Garden 7 No.11, JakaSetia, Bekasi Selatan 17148</p>
            <h2 className="text-lg font-bold mt-4">TREATMENT RECEIPT</h2>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed my-4"></div>

          {/* Invoice Details */}
          <div className="space-y-1 text-sm mb-4">
            <div className="flex justify-between">
              <span>DATE:</span>
              <span>{new Date(invoice.issueDate).toLocaleDateString('en-GB')}</span>
            </div>
            <div className="flex justify-between">
              <span>INVOICE NUMBER:</span>
              <span>{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>RECORD NUMBER:</span>
              <span>{patient?.recordNumber || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Patient Name:</span>
              <span>{patient?.name || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Address:</span>
              <span>{patient?.address || "—"}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed my-4"></div>

          {/* Treatments */}
          <div className="mb-4">
            <p className="font-bold text-sm mb-2">TREATMENTS:</p>
            <div className="space-y-1 text-sm">
              {treatments.map((t, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{t.treatment?.name || "Unknown"}</span>
                  <span>Rp {parseFloat(t.priceAtTime).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed my-4"></div>

          {/* Additional Notes */}
          <div className="mb-4">
            <p className="font-bold text-sm mb-2">ADDITIONAL NOTES:</p>
            <p className="text-sm">None-</p>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed my-4"></div>

          {/* Total */}
          <div className="mb-6">
            <div className="flex justify-between text-lg font-bold">
              <span>TOTAL</span>
              <span>RP {parseFloat(invoice.totalAmount).toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm space-y-1">
            <p className="font-medium">Thank you for your visit!</p>
            <p className="italic">Semoga kesehatan selalu menyertai anda</p>
          </div>

          {/* Status Badge - Hidden on print */}
          <div className="mt-6 flex items-center justify-center print:hidden">
            <Badge
              variant={
                invoice.status === "paid"
                  ? "default"
                  : invoice.status === "unpaid"
                  ? "secondary"
                  : "destructive"
              }
              className="text-sm"
            >
              Status: {(invoice.status || "unpaid").toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content,
          #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .print\\:hidden {
            display: none !important;
          }
          nav,
          aside,
          header,
          [data-sidebar],
          [role="navigation"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
