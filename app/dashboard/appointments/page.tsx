import { getAppointments } from "@/app/actions/appointments";
import { AppointmentsTable } from "@/components/appointments/appointments-table";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: { startDate?: string; endDate?: string };
}) {
  // Default to today's date if no date range is provided
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(23, 59, 59, 999);

  const startDate = searchParams.startDate
    ? new Date(searchParams.startDate)
    : today;
  const endDate = searchParams.endDate
    ? new Date(searchParams.endDate)
    : tomorrow;

  const result = await getAppointments(startDate, endDate);
  const appointments = result.data || [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <AppointmentsTable appointments={appointments} />
    </div>
  );
}
