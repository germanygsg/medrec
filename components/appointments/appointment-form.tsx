"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createAppointment } from "@/app/actions/appointments";

const appointmentFormSchema = z.object({
  patientId: z.number().min(1, {
    message: "Please select a patient.",
  }),
  bloodPressure: z.string().optional(),
  respirationRate: z.string().optional(),
  heartRate: z.string().optional().refine((val) => {
    if (!val) return true;
    const num = parseInt(val);
    return !isNaN(num) && num >= 40 && num <= 220;
  }, {
    message: "Heart rate must be between 40 and 220 bpm",
  }),
  borgScale: z.string().optional(),
  treatmentIds: z.array(z.number()).min(1, {
    message: "Please select at least one treatment.",
  }),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

type Patient = {
  id: number;
  name: string;
  recordNumber: string;
};

type Treatment = {
  id: number;
  name: string;
  price: string;
};

type AppointmentFormProps = {
  patients: Patient[];
  treatments: Treatment[];
};

export function AppointmentForm({
  patients,
  treatments,
}: AppointmentFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const preSelectedPatientId = searchParams.get("patientId");

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: preSelectedPatientId ? parseInt(preSelectedPatientId) : 0,
      bloodPressure: "",
      respirationRate: "",
      heartRate: "",
      borgScale: "",
      treatmentIds: [],
    },
  });

  async function onSubmit(data: AppointmentFormValues) {
    setIsSubmitting(true);
    try {
      const result = await createAppointment({
        patientId: data.patientId,
        appointmentDate: new Date(),
        bloodPressure: data.bloodPressure || undefined,
        respirationRate: data.respirationRate
          ? parseInt(data.respirationRate)
          : undefined,
        heartRate: data.heartRate ? parseInt(data.heartRate) : undefined,
        borgScale: data.borgScale ? parseInt(data.borgScale) : undefined,
        treatmentIds: data.treatmentIds,
        status: "completed",
      });

      if (result.success) {
        toast.success("Appointment created successfully");
        router.push("/dashboard/appointments");
        router.refresh();
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch {
      toast.error("Failed to create appointment");
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedPatient = patients.find(
    (p) => p.id === form.watch("patientId")
  );

  const selectedTreatmentIds = form.watch("treatmentIds");
  const totalPrice = selectedTreatmentIds.reduce((sum, id) => {
    const treatment = treatments.find((t) => t.id === id);
    return sum + (treatment ? parseFloat(treatment.price) : 0);
  }, 0);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Patient</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {selectedPatient
                        ? `${selectedPatient.name} (${selectedPatient.recordNumber})`
                        : "Select patient"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Search patient..." />
                    <CommandList>
                      <CommandEmpty>No patient found.</CommandEmpty>
                      <CommandGroup>
                        {patients.map((patient) => (
                          <CommandItem
                            value={`${patient.name} ${patient.recordNumber}`}
                            key={patient.id}
                            onSelect={() => {
                              form.setValue("patientId", patient.id);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                patient.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {patient.name} ({patient.recordNumber})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the patient for this appointment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="bloodPressure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Pressure</FormLabel>
                <FormControl>
                  <Input placeholder="120/80" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="respirationRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Respiration Rate</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="breaths/min"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="heartRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heart Rate (HR)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="40"
                    max="220"
                    placeholder="bpm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="borgScale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Borg Scale (6-20)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="6"
                    max="20"
                    placeholder="10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="treatmentIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Treatments</FormLabel>
                <FormDescription>
                  Select the treatments provided during this appointment
                </FormDescription>
              </div>
              <div className="space-y-2">
                {treatments.map((treatment) => (
                  <FormField
                    key={treatment.id}
                    control={form.control}
                    name="treatmentIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={treatment.id}
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(treatment.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      treatment.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== treatment.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <div className="flex-1 space-y-1 leading-none">
                            <FormLabel className="font-medium">
                              {treatment.name}
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Rp {parseFloat(treatment.price).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedTreatmentIds.length > 0 && (
          <div className="flex items-center justify-between rounded-md border bg-muted/50 p-4">
            <div className="text-sm font-medium">Total Price</div>
            <div className="text-lg font-bold">
              Rp {totalPrice.toLocaleString('id-ID')}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Appointment"}
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
