"use server";

import { db, treatments } from "@/db";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Create a new treatment
export async function createTreatment(data: {
  name: string;
  description?: string;
  price: string;
}) {
  try {
    const [treatment] = await db
      .insert(treatments)
      .values({
        name: data.name,
        description: data.description,
        price: data.price,
      })
      .returning();

    revalidatePath("/dashboard/treatments");
    return { success: true, data: treatment };
  } catch (error) {
    console.error("Error creating treatment:", error);
    return { success: false, error: "Failed to create treatment" };
  }
}

// Get all treatments
export async function getTreatments() {
  try {
    const result = await db
      .select()
      .from(treatments)
      .orderBy(desc(treatments.createdAt));

    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching treatments:", error);
    return { success: false, error: "Failed to fetch treatments", data: [] };
  }
}

// Get a single treatment by ID
export async function getTreatmentById(id: number) {
  try {
    const [treatment] = await db
      .select()
      .from(treatments)
      .where(eq(treatments.id, id));

    if (!treatment) {
      return { success: false, error: "Treatment not found" };
    }

    return { success: true, data: treatment };
  } catch (error) {
    console.error("Error fetching treatment:", error);
    return { success: false, error: "Failed to fetch treatment" };
  }
}

// Update a treatment
export async function updateTreatment(
  id: number,
  data: {
    name?: string;
    description?: string;
    price?: string;
  }
) {
  try {
    const [updated] = await db
      .update(treatments)
      .set(data)
      .where(eq(treatments.id, id))
      .returning();

    revalidatePath("/dashboard/treatments");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating treatment:", error);
    return { success: false, error: "Failed to update treatment" };
  }
}

// Delete a treatment
export async function deleteTreatment(id: number) {
  try {
    await db.delete(treatments).where(eq(treatments.id, id));
    revalidatePath("/dashboard/treatments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting treatment:", error);
    return { success: false, error: "Failed to delete treatment" };
  }
}
