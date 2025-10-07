import { getInvoices } from "@/app/actions/invoices";
import { InvoicesTable } from "@/components/invoices/invoices-table";

// Force dynamic rendering - don't generate at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getTodayDateRange() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);

  return { today, tomorrow };
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: { startDate?: string; endDate?: string };
}) {
  // Default to today's date if no date range is provided
  const { today, tomorrow } = getTodayDateRange();

  const startDate = searchParams.startDate
    ? new Date(searchParams.startDate)
    : today;
  const endDate = searchParams.endDate
    ? new Date(searchParams.endDate)
    : tomorrow;

  const result = await getInvoices(startDate, endDate);
  const invoices = result.data || [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <InvoicesTable invoices={invoices} />
    </div>
  );
}
