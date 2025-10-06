import { TreatmentForm } from "@/components/treatments/treatment-form";

export default function NewTreatmentPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="max-w-2xl">
        <TreatmentForm />
      </div>
    </div>
  );
}
