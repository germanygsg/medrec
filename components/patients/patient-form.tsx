"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPatient, updatePatient } from "@/app/actions/patients";
import { calculateAge } from "@/lib/utils/patient-utils";

const patientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.string().min(1, {
    message: "Age is required.",
  }).refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 0 && num <= 150;
  }, {
    message: "Age must be a valid number between 0 and 150.",
  }),
  address: z.string().optional(),
  initialDiagnosis: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

type PatientFormProps = {
  patient?: {
    id: number;
    name: string;
    dateOfBirth: string;
    address: string | null;
    initialDiagnosis: string | null;
  };
  mode?: "create" | "edit";
};

export function PatientForm({ patient, mode = "create" }: PatientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate age from dateOfBirth if in edit mode
  const initialAge = patient?.dateOfBirth ? calculateAge(patient.dateOfBirth).toString() : "";

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: patient?.name || "",
      age: initialAge,
      address: patient?.address || "",
      initialDiagnosis: patient?.initialDiagnosis || "",
    },
  });

  async function onSubmit(data: PatientFormValues) {
    setIsSubmitting(true);
    try {
      // Convert age to date of birth
      const age = parseInt(data.age);
      const currentYear = new Date().getFullYear();
      const birthYear = currentYear - age;
      const dateOfBirth = `${birthYear}-01-01`; // Use January 1st of the birth year

      const patientData = {
        name: data.name,
        dateOfBirth,
        address: data.address,
        initialDiagnosis: data.initialDiagnosis,
      };

      let result;
      if (mode === "edit" && patient) {
        result = await updatePatient(patient.id, patientData);
      } else {
        result = await createPatient(patientData);
      }

      if (result.success) {
        toast.success(
          mode === "edit" ? "Patient updated successfully" : "Patient created successfully"
        );
        router.push("/dashboard/patients");
        router.refresh();
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to save patient");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                Full name of the patient
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="25" min="0" max="150" {...field} />
              </FormControl>
              <FormDescription>
                Patient&apos;s age in years
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="123 Main St, City, State, ZIP"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Patient&apos;s residential address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="initialDiagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Diagnosis / Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Initial diagnosis or medical notes..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Initial diagnosis or medical notes
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? mode === "edit"
                ? "Updating..."
                : "Creating..."
              : mode === "edit"
              ? "Update Patient"
              : "Create Patient"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
