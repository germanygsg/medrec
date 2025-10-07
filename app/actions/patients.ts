"use server";

import { db, patients, appointments, invoices } from "@/db";
import { eq, desc, sql, or, ilike } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";
import { logger } from "@/lib/logger";

// Generate unique record number
async function generateRecordNumber(): Promise<string> {
  const year = new Date().getFullYear();

  const lastPatient = await db
    .select({ recordNumber: patients.recordNumber })
    .from(patients)
    .where(ilike(patients.recordNumber, `PT-${year}-%`))
    .orderBy(desc(patients.recordNumber))
    .limit(1);

  if (lastPatient.length === 0) {
    return `PT-${year}-00001`;
  }

  const lastNumber = parseInt(lastPatient[0].recordNumber.split('-')[2]);
  const nextNumber = (lastNumber + 1).toString().padStart(5, '0');
  return `PT-${year}-${nextNumber}`;
}

// Create a new patient
export async function createPatient(data: {
  name: string;
  dateOfBirth: string;
  address?: string;
  initialDiagnosis?: string;
}) {
  try {
    const recordNumber = await generateRecordNumber();

    const [patient] = await db
      .insert(patients)
      .values({
        recordNumber,
        name: data.name,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        initialDiagnosis: data.initialDiagnosis,
      })
      .returning();

    revalidatePath("/dashboard/patients");
    return { success: true, data: patient };
  } catch (error) {
    logger.error("Error creating patient", error as Error, { data });
    return { success: false, error: "Failed to create patient" };
  }
}

// Get all patients
export async function getPatients(searchQuery?: string) {
  try {
    const queryBuilder = db.select().from(patients);

    const result = searchQuery
      ? await queryBuilder
          .where(
            or(
              ilike(patients.name, `%${searchQuery}%`),
              ilike(patients.recordNumber, `%${searchQuery}%`)
            )
          )
          .orderBy(desc(patients.createdAt))
      : await queryBuilder.orderBy(desc(patients.createdAt));

    return { success: true, data: result };
  } catch (error) {
    logger.error("Error fetching patients", error as Error, { searchQuery });
    return { success: false, error: "Failed to fetch patients", data: [] };
  }
}

// Get a single patient by ID
export async function getPatientById(id: number) {
  try {
    const [patient] = await db
      .select()
      .from(patients)
      .where(eq(patients.id, id));

    if (!patient) {
      return { success: false, error: "Patient not found" };
    }

    return { success: true, data: patient };
  } catch (error) {
    logger.error("Error fetching patient", error as Error, { id });
    return { success: false, error: "Failed to fetch patient" };
  }
}

// Update a patient
export async function updatePatient(
  id: number,
  data: {
    name?: string;
    dateOfBirth?: string;
    address?: string;
    initialDiagnosis?: string;
  }
) {
  try {
    const [updated] = await db
      .update(patients)
      .set(data)
      .where(eq(patients.id, id))
      .returning();

    revalidatePath("/dashboard/patients");
    revalidatePath(`/dashboard/patients/${id}`);
    return { success: true, data: updated };
  } catch (error) {
    logger.error("Error updating patient", error as Error, { id, data });
    return { success: false, error: "Failed to update patient" };
  }
}

// Delete a patient
export async function deletePatient(id: number) {
  try {
    // Check for related appointments
    const relatedAppointments = await db
      .select({ id: appointments.id })
      .from(appointments)
      .where(eq(appointments.patientId, id));

    if (relatedAppointments.length > 0) {
      // Check if any appointments have invoices
      const appointmentIds = relatedAppointments.map(a => a.id);
      const relatedInvoices = await db
        .select({ count: sql<number>`count(*)` })
        .from(invoices)
        .where(sql`${invoices.appointmentId} IN (${sql.join(appointmentIds.map(id => sql`${id}`), sql`, `)})`);

      if (relatedInvoices[0].count > 0) {
        return {
          success: false,
          error: `Cannot delete patient. Patient has ${relatedAppointments.length} appointment(s) with ${relatedInvoices[0].count} invoice(s). Please delete all invoices and appointments first.`
        };
      }

      return {
        success: false,
        error: `Cannot delete patient. Patient has ${relatedAppointments.length} appointment(s). Please delete all appointments first.`
      };
    }

    await db.delete(patients).where(eq(patients.id, id));
    revalidatePath("/dashboard/patients");
    return { success: true };
  } catch (error) {
    logger.error("Error deleting patient", error as Error, { id });
    return { success: false, error: "Failed to delete patient. Please ensure all related appointments and invoices are deleted first." };
  }
}

// Get new patients count for current month
export async function getNewPatientsThisMonth() {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayISO = firstDayOfMonth.toISOString();

    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(patients)
      .where(sql`${patients.createdAt} >= ${firstDayISO}`);

    return { success: true, data: Number(result.count) };
  } catch (error) {
    logger.error("Error fetching new patients count", error as Error);
    return { success: false, error: "Failed to fetch count", data: 0 };
  }
}
