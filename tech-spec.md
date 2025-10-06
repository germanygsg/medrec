## **Technical Specification: Web-Based Medical Record System**

### **Version 1.0**

### **Date: October 6, 2025**

-----

### **1. Project Overview**

This document outlines the technical specifications for a web-based Medical Record Management System. The application is designed for a small practice or individual practitioner to manage patient records, define billable treatments, schedule and record appointments, and generate invoices. The system will also provide a dashboard with key performance indicators to track practice activity.

  * **Application Name:** (To be determined)
  * **Objective:** To streamline patient management, appointment tracking, and billing processes into a single, easy-to-use web application.
  * **Primary User:** Medical practitioner, clinic administrator.

-----

### **2. Core Features**

The application will be built as a Single Page Application (SPA) using Next.js, with server-side logic for data processing and persistence.

#### **2.1. Dashboard**

  * **Analytics Cards:** Display key metrics for the current month:
      * New Patients
      * Total Appointments
      * Total Revenue
  * **Charts:**
      * A bar chart showing the number of appointments per month for the last 12 months.
      * A line chart showing revenue per month for the last 12 months.

#### **2.2. Patient Management**

  * **Create Patient:** A form to input patient details including **name, date of birth, address,** and **initial diagnosis/notes**.
  * **Auto-Generated Record Number:** Upon creation, each patient will be assigned a unique, sequential record number (e.g., `PT-00001`).
  * **View Patients:** A searchable and sortable table displaying all patients with their record number, name, and calculated age.
  * **Patient Detail View:** A dedicated page to view a specific patient's complete details and their appointment history.

#### **2.3. Treatment Management**

  * **Create Treatment:** A form to add billable services with a **name, description,** and **price**.
  * **View Treatments:** A table listing all available treatments, which can be edited or deleted.

#### **2.4. Appointment Management**

  * **Create Appointment:**
      * Select a patient from a searchable dropdown list.
      * Input clinical data: **blood pressure** (e.g., "120/80"), **respiration rate** (breaths/minute), and **Borg scale** rating.
      * Select multiple treatments for the session from a checklist or multi-select component.
  * **View Appointments:** A list of all past and upcoming appointments, showing patient name, date, and status.

#### **2.5. Invoice Management**

  * **Generate Invoice:** Automatically create an invoice from a completed appointment, calculating the total cost based on the selected treatments.
  * **View Invoices:** A central page listing all generated invoices with details like invoice number, patient name, date, total amount, and status (e.g., Paid, Unpaid).
  * **Print Invoice:** A "Print" button on each invoice detail page that opens a clean, print-friendly receipt format and triggers the browser's print dialog.
  * **Export to Excel:** A button on the main invoices page to download an `.xlsx` file containing all invoice data for accounting and archival purposes.

-----

### **3. User Flow**

1.  **Login:** The user authenticates using their credentials via **Better Auth**.
2.  **Dashboard:** The user lands on the dashboard and gets a quick overview of the clinic's monthly activity.
3.  **Add Services:** The user navigates to the "Treatments" page to define the services they offer and their prices.
4.  **Register a New Patient:** The user goes to the "Patients" page, clicks "Add New," and fills out the patient's information. A unique record number is automatically generated and displayed.
5.  **Book an Appointment:** The user navigates to "Appointments," clicks "New Appointment," selects the registered patient, enters their vitals for the visit, and chooses the treatments administered.
6.  **Billing:** After the appointment is complete, the user goes to the appointment's detail page and clicks "Generate Invoice." The system calculates the total and creates a new invoice record.
7.  **Payment & Record Keeping:** The user can view the invoice, mark it as paid, and use the "Print" button to provide the patient with a physical receipt.
8.  **Reporting:** At the end of the month, the user can visit the "Invoices" page and click "Export to Excel" to get a complete report of all billing activities.

-----

### **4. Technology Stack**

  * **Framework:** Next.js 15 (App Router)
  * **UI Components:** Shadcn/ui
  * **Database:** PostgreSQL
  * **ORM:** Drizzle ORM
  * **Authentication:** Better Auth

-----

### **5. Database Schema**

The following schema is designed for a PostgreSQL database and is represented using Drizzle ORM syntax.

#### **5.1. `patients` Table**

Stores all patient information.

```typescript
import { pgTable, serial, text, varchar, date, timestamp } from "drizzle-orm/pg-core";

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  recordNumber: varchar("record_number", { length: 20 }).unique().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  address: text("address"),
  initialDiagnosis: text("initial_diagnosis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

#### **5.2. `treatments` Table**

Stores all available medical treatments or services.

```typescript
import { pgTable, serial, varchar, text, decimal, timestamp } from "drizzle-orm/pg-core";

export const treatments = pgTable("treatments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // e.g., 99999999.99
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

#### **5.3. `appointments` Table**

Stores records of each patient visit and their vitals.

```typescript
import { pgTable, serial, integer, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { patients } from "./patients";

export const appointmentStatusEnum = pgEnum("appointment_status", ["scheduled", "completed", "cancelled"]);

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  appointmentDate: timestamp("appointment_date").defaultNow().notNull(),
  bloodPressure: varchar("blood_pressure", { length: 10 }), // e.g., "120/80"
  respirationRate: integer("respiration_rate"), // breaths per minute
  borgScale: integer("borg_scale"), // Rating from 6-20
  status: appointmentStatusEnum("status").default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

#### **5.4. `invoices` Table**

Stores billing information generated from appointments.

```typescript
import { pgTable, serial, integer, varchar, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
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
});
```

#### **5.5. `appointmentTreatments` (Junction Table)**

Links appointments to the specific treatments provided during that session.

```typescript
import { pgTable, serial, integer, primaryKey, decimal } from "drizzle-orm/pg-core";
import { appointments } from "./appointments";
import { treatments } from "./treatments";

export const appointmentTreatments = pgTable("appointment_treatments", {
  appointmentId: integer("appointment_id").references(() => appointments.id).notNull(),
  treatmentId: integer("treatment_id").references(() => treatments.id).notNull(),
  // Store price at time of appointment to prevent changes affecting old invoices
  priceAtTime: decimal("price_at_time", { precision: 10, scale: 2 }).notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.appointmentId, table.treatmentId] }),
  };
});
```

-----

### **6. Key Implementation Details**

  * **Number Generation:** Unique `recordNumber` and `invoiceNumber` should be generated server-side within a database transaction to ensure atomicity and prevent duplicates. A common pattern is `PREFIX-YYYY-######`.
  * **Excel Export:** Use a library like **`exceljs`** or **`xlsx`** within a Next.js API Route or Server Action. The server will query all invoice data, build the workbook in memory, and stream it to the client with the appropriate `Content-Disposition` and `Content-Type` headers to trigger a file download.
  * **Charting:** Use a client-side charting library like **`Recharts`** or **`Chart.js`**. Create dedicated API endpoints (e.g., `/api/dashboard/stats`) that perform the necessary SQL aggregation queries (`COUNT`, `SUM`, `GROUP BY`) to fetch the data required for the charts.
  * **Printing:** Implement a dedicated print stylesheet (`@media print`) to hide the application's UI (sidebar, navigation) and format the invoice component into a clean, paper-friendly layout. The print action can be triggered via a button that calls `window.print()`.
  * **State Management:** For a simple application like this, Next.js's built-in capabilities combined with React's `useState`, `useContext`, or a lightweight library like `Zustand` will be sufficient for managing client-side state.