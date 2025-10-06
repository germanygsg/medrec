import { notFound } from "next/navigation";
import { PatientForm } from "@/components/patients/patient-form";
import { getPatientById } from "@/app/actions/patients";

export default async function EditPatientPage({
  params,
}: {
  params: { id: string };
}) {
  const patientId = parseInt(params.id);
  const result = await getPatientById(patientId);

  if (!result.success || !result.data) {
    notFound();
  }

  const patient = result.data;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="max-w-2xl">
        <PatientForm
          patient={{
            id: patient.id,
            name: patient.name,
            dateOfBirth: patient.dateOfBirth,
            address: patient.address,
            initialDiagnosis: patient.initialDiagnosis,
          }}
          mode="edit"
        />
      </div>
    </div>
  );
}
