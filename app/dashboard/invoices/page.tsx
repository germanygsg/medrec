import { getInvoices } from "@/app/actions/invoices";
import { InvoicesTable } from "@/components/invoices/invoices-table";

export default async function InvoicesPage() {
  const result = await getInvoices();
  const invoices = result.data || [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <InvoicesTable invoices={invoices} />
    </div>
  );
}
