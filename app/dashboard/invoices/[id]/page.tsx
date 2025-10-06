import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InvoiceDetail } from "@/components/invoices/invoice-detail";
import { getInvoiceById } from "@/app/actions/invoices";

export default async function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const invoiceId = parseInt(params.id);
  const result = await getInvoiceById(invoiceId);

  if (!result.success || !result.data) {
    notFound();
  }

  const { invoice, patient, appointment, treatments } = result.data;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-end gap-2 print:hidden">
        {patient && (
          <Link href={`/dashboard/patients/${patient.id}`}>
            <Button variant="outline">View Patient</Button>
          </Link>
        )}
        {appointment && (
          <Link href={`/dashboard/appointments/${appointment.id}`}>
            <Button variant="outline">View Appointment</Button>
          </Link>
        )}
      </div>

      <InvoiceDetail
        invoice={invoice}
        patient={patient}
        appointment={appointment}
        treatments={treatments}
      />
    </div>
  );
}
