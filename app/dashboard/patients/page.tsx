import { getPatients } from "@/app/actions/patients";
import { calculateAge } from "@/lib/utils/patient-utils";
import { PatientsTable } from "@/components/patients/patients-table";

// Force dynamic rendering - don't generate at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PatientsPage() {
  const result = await getPatients();
  const patients = result.data || [];

  // Add age to each patient
  const patientsWithAge = patients.map((patient) => ({
    ...patient,
    age: calculateAge(patient.dateOfBirth),
  }));

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PatientsTable patients={patientsWithAge} />
    </div>
  );
}
