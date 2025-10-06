import { PatientForm } from "@/components/patients/patient-form";

export default function NewPatientPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="max-w-2xl">
        <PatientForm mode="create" />
      </div>
    </div>
  );
}
