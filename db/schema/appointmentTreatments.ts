import { pgTable, integer, primaryKey, decimal } from "drizzle-orm/pg-core";
import { appointments } from "./appointments";
import { treatments } from "./treatments";

export const appointmentTreatments = pgTable("appointment_treatments", {
  appointmentId: integer("appointment_id").references(() => appointments.id).notNull(),
  treatmentId: integer("treatment_id").references(() => treatments.id).notNull(),
  priceAtTime: decimal("price_at_time", { precision: 10, scale: 2 }).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.appointmentId, table.treatmentId] }),
  };
});
