import { getAppointments } from "@/app/actions/appointments";
import { AppointmentsTable } from "@/components/appointments/appointments-table";

export default async function AppointmentsPage() {
  const result = await getAppointments();
  const appointments = result.data || [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <AppointmentsTable appointments={appointments} />
    </div>
  );
}
