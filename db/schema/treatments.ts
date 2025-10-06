import { pgTable, serial, varchar, text, decimal, timestamp } from "drizzle-orm/pg-core";

export const treatments = pgTable("treatments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
