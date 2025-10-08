import { getTreatments } from "@/app/actions/treatments";
import { TreatmentsTable } from "@/components/treatments/treatments-table";

// Force dynamic rendering - don't generate at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TreatmentsPage() {
  const result = await getTreatments();
  const treatments = result.data || [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <TreatmentsTable treatments={treatments} />
    </div>
  );
}
