"use server";

import { db, patients, treatments, appointments, appointmentTreatments, invoices } from "@/db";
import { revalidatePath } from "next/cache";

export async function wipeAllData() {
  try {
    // Delete in correct order to respect foreign key constraints
    await db.delete(appointmentTreatments);
    await db.delete(invoices);
    await db.delete(appointments);
    await db.delete(patients);
    await db.delete(treatments);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error wiping data:", error);
    return { success: false, error: "Failed to wipe data" };
  }
}
