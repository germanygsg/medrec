import { AppointmentForm } from "@/components/appointments/appointment-form";
import { getPatients } from "@/app/actions/patients";
import { getTreatments } from "@/app/actions/treatments";

export default async function NewAppointmentPage() {
  const [patientsResult, treatmentsResult] = await Promise.all([
    getPatients(),
    getTreatments(),
  ]);

  const patients = patientsResult.data || [];
  const treatments = treatmentsResult.data || [];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="max-w-3xl">
        <AppointmentForm patients={patients} treatments={treatments} />
      </div>
    </div>
  );
}
