"use server";

import { db, appointments, appointmentTreatments, patients, treatments, invoices } from "@/db";
import { eq, desc, sql, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Create a new appointment with treatments
export async function createAppointment(data: {
  patientId: number;
  appointmentDate: Date;
  bloodPressure?: string;
  respirationRate?: number;
  heartRate?: number;
  borgScale?: number;
  treatmentIds: number[];
  status?: "scheduled" | "completed" | "cancelled";
}) {
  try {
    // Start a transaction
    const [appointment] = await db
      .insert(appointments)
      .values({
        patientId: data.patientId,
        appointmentDate: data.appointmentDate,
        bloodPressure: data.bloodPressure,
        respirationRate: data.respirationRate,
        heartRate: data.heartRate,
        borgScale: data.borgScale,
        status: data.status || "completed",
      })
      .returning();

    // Add treatments to the appointment
    if (data.treatmentIds.length > 0) {
      // Get current prices for treatments
      const treatmentPrices = await db
        .select()
        .from(treatments)
        .where(
          sql`${treatments.id} IN (${sql.join(data.treatmentIds.map(id => sql`${id}`), sql`, `)})`
        );

      const appointmentTreatmentValues = treatmentPrices.map((treatment) => ({
        appointmentId: appointment.id,
        treatmentId: treatment.id,
        priceAtTime: treatment.price,
      }));

      await db.insert(appointmentTreatments).values(appointmentTreatmentValues);
    }

    revalidatePath("/dashboard/appointments");
    revalidatePath(`/dashboard/patients/${data.patientId}`);
    return { success: true, data: appointment };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, error: "Failed to create appointment" };
  }
}

// Get all appointments with patient and treatment details
export async function getAppointments() {
  try {
    const result = await db
      .select({
        appointment: {
          id: appointments.id,
          patientId: appointments.patientId,
          appointmentDate: appointments.appointmentDate,
          bloodPressure: appointments.bloodPressure,
          respirationRate: appointments.respirationRate,
          heartRate: appointments.heartRate,
          borgScale: appointments.borgScale,
          status: appointments.status,
          createdAt: appointments.createdAt,
        },
        patient: patients,
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .orderBy(desc(appointments.appointmentDate));

    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return { success: false, error: "Failed to fetch appointments", data: [] };
  }
}

// Get a single appointment by ID with all details
export async function getAppointmentById(id: number) {
  try {
    const [appointment] = await db
      .select({
        appointment: appointments,
        patient: patients,
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .where(eq(appointments.id, id));

    if (!appointment) {
      return { success: false, error: "Appointment not found" };
    }

    // Get treatments for this appointment
    const appointmentTreatmentsData = await db
      .select({
        treatment: treatments,
        priceAtTime: appointmentTreatments.priceAtTime,
      })
      .from(appointmentTreatments)
      .leftJoin(treatments, eq(appointmentTreatments.treatmentId, treatments.id))
      .where(eq(appointmentTreatments.appointmentId, id));

    return {
      success: true,
      data: {
        ...appointment,
        treatments: appointmentTreatmentsData,
      },
    };
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return { success: false, error: "Failed to fetch appointment" };
  }
}

// Get appointments for a specific patient
export async function getAppointmentsByPatientId(patientId: number) {
  try {
    const result = await db
      .select()
      .from(appointments)
      .where(eq(appointments.patientId, patientId))
      .orderBy(desc(appointments.appointmentDate));

    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    return { success: false, error: "Failed to fetch appointments", data: [] };
  }
}

// Update appointment status
export async function updateAppointmentStatus(
  id: number,
  status: "scheduled" | "completed" | "cancelled"
) {
  try {
    const [updated] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();

    revalidatePath("/dashboard/appointments");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return { success: false, error: "Failed to update appointment" };
  }
}

// Delete an appointment
export async function deleteAppointment(id: number) {
  try {
    // Check for related invoices
    const relatedInvoices = await db
      .select({ count: sql<number>`count(*)` })
      .from(invoices)
      .where(eq(invoices.appointmentId, id));

    if (relatedInvoices[0].count > 0) {
      return {
        success: false,
        error: "Cannot delete appointment with existing invoices. Please delete the invoice first."
      };
    }

    // Delete associated treatments first
    await db.delete(appointmentTreatments).where(eq(appointmentTreatments.appointmentId, id));

    // Delete appointment
    await db.delete(appointments).where(eq(appointments.id, id));

    revalidatePath("/dashboard/appointments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return { success: false, error: "Failed to delete appointment" };
  }
}

// Get total appointments count for current month
export async function getAppointmentsThisMonth() {
  try {
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(appointments)
      .where(gte(appointments.appointmentDate, firstDayOfMonth));

    return { success: true, data: Number(result.count) };
  } catch (error) {
    console.error("Error fetching appointments count:", error);
    return { success: false, error: "Failed to fetch count", data: 0 };
  }
}

// Get appointments per month for the last 12 months
export async function getAppointmentsByMonth() {
  try {
    const result = await db
      .select({
        month: sql<string>`TO_CHAR(${appointments.appointmentDate}, 'YYYY-MM')`,
        count: sql<number>`count(*)`,
      })
      .from(appointments)
      .where(
        gte(
          appointments.appointmentDate,
          sql`NOW() - INTERVAL '12 months'`
        )
      )
      .groupBy(sql`TO_CHAR(${appointments.appointmentDate}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${appointments.appointmentDate}, 'YYYY-MM')`);

    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching appointments by month:", error);
    return { success: false, error: "Failed to fetch data", data: [] };
  }
}
