import { pgTable, serial, integer, varchar, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { patients } from "./patients";

export const appointmentStatusEnum = pgEnum("appointment_status", ["scheduled", "completed", "cancelled"]);

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  appointmentDate: timestamp("appointment_date").defaultNow().notNull(),
  bloodPressure: varchar("blood_pressure", { length: 10 }),
  respirationRate: integer("respiration_rate"),
  heartRate: integer("heart_rate"),
  borgScale: integer("borg_scale"),
  status: appointmentStatusEnum("status").default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index("appointments_patient_id_idx").on(table.patientId),
  appointmentDateIdx: index("appointments_date_idx").on(table.appointmentDate),
  createdAtIdx: index("appointments_created_at_idx").on(table.createdAt),
}));
