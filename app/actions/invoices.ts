"use server";

import { db, invoices, appointments, appointmentTreatments, patients, treatments } from "@/db";
import { eq, desc, sql, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Generate unique invoice number
async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();

  const lastInvoice = await db
    .select({ invoiceNumber: invoices.invoiceNumber })
    .from(invoices)
    .where(ilike(invoices.invoiceNumber, `INV-${year}-%`))
    .orderBy(desc(invoices.invoiceNumber))
    .limit(1);

  if (lastInvoice.length === 0) {
    return `INV-${year}-00001`;
  }

  const lastNumber = parseInt(lastInvoice[0].invoiceNumber.split('-')[2]);
  const nextNumber = (lastNumber + 1).toString().padStart(5, '0');
  return `INV-${year}-${nextNumber}`;
}

// Generate invoice from appointment
export async function generateInvoice(appointmentId: number) {
  try {
    // Check if invoice already exists for this appointment
    const existingInvoice = await db
      .select()
      .from(invoices)
      .where(eq(invoices.appointmentId, appointmentId))
      .limit(1);

    if (existingInvoice.length > 0) {
      return {
        success: false,
        error: "Invoice already exists for this appointment",
      };
    }

    // Get appointment treatments and calculate total
    const appointmentTreatmentsData = await db
      .select({
        priceAtTime: appointmentTreatments.priceAtTime,
      })
      .from(appointmentTreatments)
      .where(eq(appointmentTreatments.appointmentId, appointmentId));

    const totalAmount = appointmentTreatmentsData.reduce(
      (sum, item) => sum + parseFloat(item.priceAtTime),
      0
    );

    const invoiceNumber = await generateInvoiceNumber();

    const [invoice] = await db
      .insert(invoices)
      .values({
        invoiceNumber,
        appointmentId,
        totalAmount: totalAmount.toFixed(2),
        status: "unpaid",
      })
      .returning();

    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/appointments");
    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error generating invoice:", error);
    return { success: false, error: "Failed to generate invoice" };
  }
}

// Get all invoices with patient and appointment details
export async function getInvoices(startDate?: Date, endDate?: Date) {
  try {
    let query = db
      .select({
        invoice: invoices,
        appointment: appointments,
        patient: patients,
      })
      .from(invoices)
      .leftJoin(appointments, eq(invoices.appointmentId, appointments.id))
      .leftJoin(patients, eq(appointments.patientId, patients.id));

    // Apply date filters if provided
    if (startDate && endDate) {
      query = query.where(
        sql`${invoices.issueDate} >= ${startDate} AND ${invoices.issueDate} <= ${endDate}`
      ) as typeof query;
    } else if (startDate) {
      query = query.where(sql`${invoices.issueDate} >= ${startDate}`) as typeof query;
    }

    const result = await query.orderBy(desc(invoices.createdAt));

    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return { success: false, error: "Failed to fetch invoices", data: [] };
  }
}

// Get a single invoice by ID with full details
export async function getInvoiceById(id: number) {
  try {
    const [invoice] = await db
      .select({
        invoice: invoices,
        appointment: appointments,
        patient: patients,
      })
      .from(invoices)
      .leftJoin(appointments, eq(invoices.appointmentId, appointments.id))
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .where(eq(invoices.id, id));

    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }

    // Get treatments for this invoice's appointment
    const appointmentTreatmentsData = await db
      .select({
        treatment: treatments,
        priceAtTime: appointmentTreatments.priceAtTime,
        notes: appointmentTreatments.notes,
      })
      .from(appointmentTreatments)
      .leftJoin(treatments, eq(appointmentTreatments.treatmentId, treatments.id))
      .where(eq(appointmentTreatments.appointmentId, invoice.appointment!.id));

    return {
      success: true,
      data: {
        ...invoice,
        treatments: appointmentTreatmentsData,
      },
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return { success: false, error: "Failed to fetch invoice" };
  }
}

// Update invoice status
export async function updateInvoiceStatus(
  id: number,
  status: "unpaid" | "paid" | "void"
) {
  try {
    const [updated] = await db
      .update(invoices)
      .set({ status })
      .where(eq(invoices.id, id))
      .returning();

    revalidatePath("/dashboard/invoices");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating invoice:", error);
    return { success: false, error: "Failed to update invoice" };
  }
}

// Delete an invoice
export async function deleteInvoice(id: number) {
  try {
    await db.delete(invoices).where(eq(invoices.id, id));
    revalidatePath("/dashboard/invoices");
    return { success: true };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return { success: false, error: "Failed to delete invoice" };
  }
}

// Get invoice by appointment ID
export async function getInvoiceByAppointmentId(appointmentId: number) {
  try {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.appointmentId, appointmentId))
      .limit(1);

    if (!invoice) {
      return { success: false, error: "Invoice not found", data: null };
    }

    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error fetching invoice by appointment:", error);
    return { success: false, error: "Failed to fetch invoice", data: null };
  }
}

// Get total revenue for current month
export async function getRevenueThisMonth() {
  try {
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [result] = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(${invoices.totalAmount} AS DECIMAL)), 0)` })
      .from(invoices)
      .where(
        sql`${invoices.issueDate} >= ${firstDayOfMonth} AND ${invoices.status} = 'paid'`
      );

    return { success: true, data: Number(result.total) };
  } catch (error) {
    console.error("Error fetching revenue:", error);
    return { success: false, error: "Failed to fetch revenue", data: 0 };
  }
}

// Get revenue per month for the last 12 months
export async function getRevenueByMonth() {
  try {
    const result = await db
      .select({
        month: sql<string>`TO_CHAR(${invoices.issueDate}, 'YYYY-MM')`,
        revenue: sql<number>`COALESCE(SUM(CAST(${invoices.totalAmount} AS DECIMAL)), 0)`,
      })
      .from(invoices)
      .where(
        sql`${invoices.issueDate} >= NOW() - INTERVAL '12 months' AND ${invoices.status} = 'paid'`
      )
      .groupBy(sql`TO_CHAR(${invoices.issueDate}, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${invoices.issueDate}, 'YYYY-MM')`);

    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching revenue by month:", error);
    return { success: false, error: "Failed to fetch data", data: [] };
  }
}
