"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { generateInvoice } from "@/app/actions/invoices";
import { toast } from "sonner";

export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  useEffect(() => {
    async function createInvoice() {
      if (!appointmentId) {
        router.push("/dashboard/appointments");
        return;
      }

      const id = parseInt(appointmentId);

      // Generate the invoice
      const result = await generateInvoice(id);

      if (result.success && result.data) {
        // Redirect to the newly created invoice
        router.push(`/dashboard/invoices/${result.data.id}`);
      } else {
        // Show error and redirect back to appointment
        toast.error(result.error || "Failed to generate invoice");
        router.push(`/dashboard/appointments/${id}`);
      }
    }

    createInvoice();
  }, [appointmentId, router]);

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Generating Invoice...</h2>
        <p className="text-muted-foreground">Please wait while we create your invoice.</p>
      </div>
    </div>
  );
}
