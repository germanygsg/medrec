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
import { getPatientById } from "@/app/actions/patients";
import { calculateAge } from "@/lib/utils/patient-utils";
import { getAppointmentsByPatientId } from "@/app/actions/appointments";

export default async function PatientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const patientId = parseInt(params.id);

  const [patientResult, appointmentsResult] = await Promise.all([
    getPatientById(patientId),
    getAppointmentsByPatientId(patientId),
  ]);

  if (!patientResult.success || !patientResult.data) {
    notFound();
  }

  const patient = patientResult.data;
  const appointments = appointmentsResult.data || [];
  const age = calculateAge(patient.dateOfBirth);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-end gap-2">
        <Link href={`/dashboard/patients/${patient.id}/edit`}>
          <Button variant="outline">Edit Patient</Button>
        </Link>
        <Link href={`/dashboard/appointments/new?patientId=${patient.id}`}>
          <Button>New Appointment</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">Age:</span>
              <span className="text-sm font-medium">{age} years</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">
                Date of Birth:
              </span>
              <span className="text-sm font-medium">
                {new Date(patient.dateOfBirth).toLocaleDateString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm text-muted-foreground">Address:</span>
              <span className="text-sm font-medium">
                {patient.address || "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Initial Diagnosis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {patient.initialDiagnosis || "No diagnosis recorded"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment History</CardTitle>
          <CardDescription>
            {appointments.length} appointment(s) on record
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Blood Pressure</TableHead>
                    <TableHead>Respiration</TableHead>
                    <TableHead>Heart Rate</TableHead>
                    <TableHead>Borg Scale</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell>
                        {new Date(apt.appointmentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{apt.bloodPressure || "—"}</TableCell>
                      <TableCell>
                        {apt.respirationRate ? `${apt.respirationRate}/min` : "—"}
                      </TableCell>
                      <TableCell>
                        {apt.heartRate ? `${apt.heartRate} bpm` : "—"}
                      </TableCell>
                      <TableCell>{apt.borgScale || "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            apt.status === "completed"
                              ? "default"
                              : apt.status === "scheduled"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {apt.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/appointments/${apt.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No appointments recorded yet.{" "}
              <Link
                href={`/dashboard/appointments/new?patientId=${patient.id}`}
                className="text-primary underline"
              >
                Create one now
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
