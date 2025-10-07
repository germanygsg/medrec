import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAppointmentById } from "@/app/actions/appointments";
import { getInvoiceByAppointmentId } from "@/app/actions/invoices";
import { TreatmentsTableClient } from "@/components/appointments/treatments-table-client";

export default async function AppointmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const appointmentId = parseInt(params.id);

  const [appointmentResult, invoiceResult] = await Promise.all([
    getAppointmentById(appointmentId),
    getInvoiceByAppointmentId(appointmentId),
  ]);

  if (!appointmentResult.success || !appointmentResult.data) {
    notFound();
  }

  const { appointment, patient, treatments } = appointmentResult.data;
  const invoice = invoiceResult.data;

  const totalCost = treatments.reduce(
    (sum, t) => sum + parseFloat(t.priceAtTime),
    0
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-end gap-2">
        {patient && (
          <Link href={`/dashboard/patients/${patient.id}`}>
            <Button variant="outline">View Patient</Button>
          </Link>
        )}
        {!invoice && (
          <Link href={`/dashboard/invoices/new?appointmentId=${appointment.id}`}>
            <Button>Generate Invoice</Button>
          </Link>
        )}
        {invoice && (
          <Link href={`/dashboard/invoices/${invoice.id}`}>
            <Button variant="secondary">View Invoice</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            {patient ? (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <span className="text-sm font-medium">{patient.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-muted-foreground">
                    Record #:
                  </span>
                  <span className="text-sm font-medium">
                    {patient.recordNumber}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Patient information not available
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vital Signs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">
                Blood Pressure:
              </span>
              <span className="text-sm font-medium">
                {appointment.bloodPressure || "—"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">
                Respiration Rate:
              </span>
              <span className="text-sm font-medium">
                {appointment.respirationRate
                  ? `${appointment.respirationRate} /min`
                  : "—"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">
                Heart Rate:
              </span>
              <span className="text-sm font-medium">
                {appointment.heartRate
                  ? `${appointment.heartRate} bpm`
                  : "—"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">Borg Scale:</span>
              <span className="text-sm font-medium">
                {appointment.borgScale || "—"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Treatments Provided</CardTitle>
          <CardDescription>
            {treatments.length} treatment(s) administered - Click on a treatment to add notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {treatments.length > 0 ? (
            <TreatmentsTableClient
              treatments={treatments}
              appointmentId={appointment.id}
              totalCost={totalCost}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              No treatments recorded for this appointment.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge
            variant={
              appointment.status === "completed"
                ? "default"
                : appointment.status === "scheduled"
                ? "secondary"
                : "destructive"
            }
          >
            {appointment.status}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
