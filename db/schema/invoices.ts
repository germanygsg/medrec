import { pgTable, serial, integer, varchar, timestamp, decimal, pgEnum, index } from "drizzle-orm/pg-core";
import { appointments } from "./appointments";

export const invoiceStatusEnum = pgEnum("invoice_status", ["unpaid", "paid", "void"]);

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 20 }).unique().notNull(),
  appointmentId: integer("appointment_id").references(() => appointments.id).unique().notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  issueDate: timestamp("issue_date").defaultNow().notNull(),
  status: invoiceStatusEnum("status").default("unpaid"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  appointmentIdIdx: index("invoices_appointment_id_idx").on(table.appointmentId),
  statusIdx: index("invoices_status_idx").on(table.status),
  createdAtIdx: index("invoices_created_at_idx").on(table.createdAt),
}));
