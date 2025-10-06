import { pgTable, serial, text, varchar, date, timestamp, index } from "drizzle-orm/pg-core";

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  recordNumber: varchar("record_number", { length: 20 }).unique().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  address: text("address"),
  initialDiagnosis: text("initial_diagnosis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  nameIdx: index("patients_name_idx").on(table.name),
  createdAtIdx: index("patients_created_at_idx").on(table.createdAt),
}));
