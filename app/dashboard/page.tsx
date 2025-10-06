import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getNewPatientsThisMonth } from "@/app/actions/patients";
import { getAppointmentsThisMonth, getAppointmentsByMonth } from "@/app/actions/appointments";
import { getRevenueThisMonth, getRevenueByMonth } from "@/app/actions/invoices";
import { AppointmentsChart } from "@/components/dashboard/appointments-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { IconUsers, IconCalendar, IconCurrencyDollar, IconPlus } from "@tabler/icons-react";

export default async function DashboardPage() {
  // Fetch dashboard stats
  const [newPatientsResult, appointmentsResult, revenueResult, appointmentsByMonthResult, revenueByMonthResult] = await Promise.all([
    getNewPatientsThisMonth(),
    getAppointmentsThisMonth(),
    getRevenueThisMonth(),
    getAppointmentsByMonth(),
    getRevenueByMonth(),
  ]);

  const newPatients = newPatientsResult.data || 0;
  const totalAppointments = appointmentsResult.data || 0;
  const totalRevenue = revenueResult.data || 0;
  const appointmentsByMonth = appointmentsByMonthResult.data || [];
  const revenueByMonth = revenueByMonthResult.data || [];

  return (
    <div className="relative flex flex-1 flex-col gap-4 p-4">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        {/* New Patients Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/patients/new">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <IconPlus className="h-4 w-4" />
                </Button>
              </Link>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newPatients}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        {/* Total Appointments Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        {/* Total Revenue Card */}
        <Card className="col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">This month (paid invoices)</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointments per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentsChart data={appointmentsByMonth} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueByMonth} />
          </CardContent>
        </Card>
      </div>

      {/* Floating New Appointment Button */}
      <Link href="/dashboard/appointments/new" className="fixed bottom-6 right-6 z-50">
        <Button size="lg" className="h-14 rounded-full shadow-lg">
          <IconPlus className="mr-2 h-5 w-5" />
          New Appointment
        </Button>
      </Link>
    </div>
  );
}
