import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { db, invoices, appointments, patients } from "@/db";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch all invoices with patient details
    const allInvoices = await db
      .select({
        invoice: invoices,
        appointment: appointments,
        patient: patients,
      })
      .from(invoices)
      .leftJoin(appointments, eq(invoices.appointmentId, appointments.id))
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .orderBy(desc(invoices.createdAt));

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invoices");

    // Add headers
    worksheet.columns = [
      { header: "Invoice Number", key: "invoiceNumber", width: 20 },
      { header: "Patient Name", key: "patientName", width: 30 },
      { header: "Patient Record", key: "patientRecord", width: 20 },
      { header: "Appointment Date", key: "appointmentDate", width: 20 },
      { header: "Issue Date", key: "issueDate", width: 20 },
      { header: "Total Amount", key: "totalAmount", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Add data
    allInvoices.forEach((row) => {
      worksheet.addRow({
        invoiceNumber: row.invoice.invoiceNumber,
        patientName: row.patient?.name || "N/A",
        patientRecord: row.patient?.recordNumber || "N/A",
        appointmentDate: row.appointment?.appointmentDate
          ? new Date(row.appointment.appointmentDate).toLocaleDateString()
          : "N/A",
        issueDate: new Date(row.invoice.issueDate).toLocaleDateString(),
        totalAmount: `$${row.invoice.totalAmount}`,
        status: row.invoice.status,
      });
    });

    // Generate Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return the file as a downloadable response
    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename="invoices-${new Date().toISOString().split("T")[0]}.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Error exporting invoices:", error);
    return NextResponse.json(
      { error: "Failed to export invoices" },
      { status: 500 }
    );
  }
}
