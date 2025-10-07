## **Technical Specification: Web-Based Medical Record System**

### **Version 2.0**

### **Date: October 7, 2025**

### **Status:** ✅ **Fully Implemented and Deployed**

-----

### **1. Project Overview**

This document outlines the technical specifications for a web-based Medical Record Management System. The application is designed for a small practice or individual practitioner to manage patient records, define billable treatments, schedule and record appointments, and generate invoices. The system provides a comprehensive dashboard with key performance indicators to track practice activity.

  * **Application Name:** BSPCenter MedRec
  * **Objective:** To streamline patient management, appointment tracking, and billing processes into a single, easy-to-use web application.
  * **Primary User:** Medical practitioner, clinic administrator (specifically designed for BSP Center Physiotherapy Clinic).
  * **Deployment:** Production-ready system deployed on Vercel.

-----

### **2. Core Features**

The application will be built as a Single Page Application (SPA) using Next.js, with server-side logic for data processing and persistence.

#### **2.1. Dashboard** ✅ **Implemented**

  * **Analytics Cards:** Display key metrics for the current month:
      * New Patients (with quick add button)
      * Total Appointments
      * Total Revenue (formatted in Indonesian Rupiah)
  * **Charts:**
      * Bar chart showing the number of appointments per month for the last 12 months (using Recharts)
      * Line chart showing revenue per month for the last 12 months (using Recharts)
  * **Quick Actions:**
      * Floating action button for creating new appointments
      * Direct navigation to add new patients from dashboard cards

#### **2.2. Patient Management** ✅ **Implemented**

  * **Create Patient:** Form-based patient registration with validation (using React Hook Form + Zod)
      * Required fields: name, date of birth
      * Optional fields: address, initial diagnosis/notes
  * **Auto-Generated Record Number:** Unique sequential record numbers with year prefix (e.g., `PT-2025-00001`)
      * Server-side generation ensures no duplicates
      * Pattern: `PT-YYYY-#####`
  * **View Patients:** Interactive data table with:
      * Real-time search functionality (by name or record number)
      * Sortable columns
      * Calculated age display
      * Quick action buttons (view, edit, delete)
  * **Patient Detail View:** Comprehensive patient profile including:
      * Complete patient information
      * Full appointment history with vitals
      * Associated invoices
      * Edit and delete capabilities with validation
  * **Data Protection:** Cascade delete validation prevents orphaned records

#### **2.3. Treatment Management** ✅ **Implemented**

  * **Create Treatment:** Form-based treatment creation with validation
      * Required fields: name, price
      * Optional field: description
      * Price validation and decimal formatting
  * **View Treatments:** Interactive table with:
      * All treatments listed with pricing
      * In-line editing capabilities
      * Delete functionality with safety checks
      * Price history preservation via `appointmentTreatments` junction table

#### **2.4. Appointment Management** ✅ **Implemented**

  * **Create Appointment:**
      * Searchable patient dropdown (Command component with fuzzy search)
      * Clinical data inputs with validation:
          * **Blood pressure** (free text format, e.g., "120/80")
          * **Respiration rate** (integer, breaths/minute)
          * **Heart rate** (integer with range validation: 40-220 bpm)
          * **Borg scale** rating (integer, 6-20 scale)
      * Multi-select treatment checkboxes with real-time price preview
      * Automatic price capture at appointment creation time
  * **View Appointments:** Comprehensive appointment list featuring:
      * Sortable and filterable table
      * Patient information display
      * Appointment status badges (scheduled, completed, cancelled)
      * Quick navigation to appointment details
  * **Appointment Detail View:**
      * Full vitals display
      * Treatment list with notes capability
      * Invoice generation button
      * Edit and delete options
  * **Treatment Notes:** Dialog-based interface for adding notes to specific treatments during appointments

#### **2.5. Invoice Management** ✅ **Implemented**

  * **Generate Invoice:** Automatic invoice creation from appointments
      * One-click generation from appointment detail page
      * Automatic calculation based on selected treatments with historical pricing
      * Duplicate prevention (one invoice per appointment)
      * Sequential invoice number generation with year prefix (e.g., `INV-2025-00001`)
  * **View Invoices:** Comprehensive invoice listing with:
      * All invoices with linked patient and appointment data
      * Status indicators (Paid, Unpaid, Void) with color-coded badges
      * Real-time status updates
      * Sortable columns (invoice number, date, amount, status)
      * Quick access to invoice details
  * **Invoice Detail View:**
      * Complete invoice information with breakdown
      * Patient details and address
      * Itemized treatment list with individual pricing
      * Total amount calculation
      * Status management dropdown (change between unpaid/paid/void)
  * **Print Invoice:** Professional print functionality
      * Dedicated print button with printer icon
      * Print-optimized layout using `@media print` CSS
      * Clean receipt format hiding navigation and UI elements
      * Includes clinic branding and complete billing information
      * Triggers browser print dialog via `window.print()`
  * **Export to Excel:** Full invoice export functionality via `/api/invoices/export`
      * Download button on invoices list page
      * Generates `.xlsx` file using ExcelJS library
      * Includes all invoice data with:
          * Invoice numbers and dates
          * Patient information (name, record number)
          * Appointment dates
          * Total amounts
          * Payment status
      * Formatted headers with styling
      * Automatic filename with current date
      * Server-side generation for optimal performance

-----

### **3. User Flow** ✅ **Implemented**

1.  **Dashboard Access:** Direct access to dashboard with real-time analytics (Note: Authentication planned for future release)
2.  **Dashboard:** User views monthly activity overview with:
    * Analytics cards showing current month statistics
    * Visual charts displaying 12-month trends
    * Quick action buttons for common tasks
3.  **Add Services:** User navigates to "Treatments" page via sidebar to:
    * Define available services/treatments
    * Set pricing for each service
    * Edit or delete existing treatments
4.  **Register a New Patient:** User registers patients by:
    * Clicking "Add New" on Patients page
    * Filling out patient information form with validation
    * System automatically generates unique record number (PT-YYYY-#####)
    * Viewing confirmation with assigned record number
5.  **Book an Appointment:** User creates appointments by:
    * Navigating to "Appointments" and clicking "New Appointment"
    * Searching and selecting patient from dropdown
    * Entering clinical vitals (BP, respiration, heart rate, Borg scale)
    * Selecting multiple treatments from checklist
    * System captures current treatment prices for historical accuracy
6.  **Billing:** User generates invoices by:
    * Viewing appointment detail page
    * Clicking "Generate Invoice" button
    * System automatically calculates total from treatments
    * Unique invoice number assigned (INV-YYYY-#####)
7.  **Payment & Record Keeping:** User manages payments by:
    * Accessing invoice detail page
    * Updating status via dropdown (Unpaid → Paid)
    * Printing professional receipt via Print button
    * Providing physical receipt to patient
8.  **Reporting:** User generates reports by:
    * Navigating to Invoices page
    * Clicking "Export to Excel" button
    * Downloading comprehensive XLSX file with all billing data
    * Using exported data for accounting and archival purposes

-----

### **4. Technology Stack** ✅ **Fully Configured**

**Core Framework:**
  * **Framework:** Next.js 15.5.0 (App Router with Turbopack)
  * **Language:** TypeScript 5.x
  * **Runtime:** React 19.1.0

**Database & ORM:**
  * **Database:** PostgreSQL (hosted with connection pooling)
  * **ORM:** Drizzle ORM 0.44.5
  * **Driver:** node-postgres (pg) 8.16.3
  * **Migrations:** Drizzle Kit 0.18.1
  * **Connection Pool:** Configured with 20 max connections, SSL support for production

**UI & Styling:**
  * **UI Components:** Shadcn/ui (complete suite installed)
  * **Styling:** Tailwind CSS v4 with @tailwindcss/postcss
  * **Theme System:** next-themes 0.4.6 (dark/light/system modes)
  * **Icons:**
      * Lucide React 0.541.0 (primary icons)
      * Tabler Icons React 3.34.1 (supplementary icons)
  * **Charts:** Recharts 2.15.4

**Form Handling & Validation:**
  * **Forms:** React Hook Form 7.62.0
  * **Validation:** Zod 4.1.3
  * **Resolvers:** @hookform/resolvers 5.2.1

**UI Components Library:**
  * **Radix UI:** Complete suite including Dialog, Dropdown, Select, Popover, etc.
  * **Data Tables:** TanStack Table 8.21.3
  * **Date Picker:** React Day Picker 9.9.0
  * **Drag & Drop:** DnD Kit 6.3.1
  * **Notifications:** Sonner 2.0.7
  * **Command Palette:** CMDK 1.1.1

**Data Export:**
  * **Excel Generation:** ExcelJS 4.4.0

**Development Tools:**
  * **Build Tool:** Turbopack (Next.js integrated)
  * **Linter:** ESLint 9 with Next.js config
  * **Type Checking:** TypeScript strict mode
  * **Dev Server:** Next.js dev server with hot reload

**Deployment & Monitoring:**
  * **Hosting:** Vercel (production deployment)
  * **Analytics:** @vercel/speed-insights 1.2.0
  * **Environment:** Docker Compose for local PostgreSQL

**Authentication:**
  * Better Auth 1.3.7 (installed but not yet implemented in current version)

**Additional Utilities:**
  * **Utility Functions:** class-variance-authority, clsx, tailwind-merge
  * **Date Handling:** date-fns 4.1.0
  * **Panels:** react-resizable-panels 3.0.5
  * **Carousel:** embla-carousel-react 8.6.0

-----

### **5. Database Schema** ✅ **Fully Implemented**

The following schema is designed for a PostgreSQL database and is represented using Drizzle ORM syntax. All tables include proper indexes for query optimization.

**Schema Documentation:** See `schema.md` for complete entity relationships and detailed field descriptions.

#### **5.1. `patients` Table** ✅ **Implemented**

Stores all patient information with indexes on frequently queried fields.

```typescript
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
```

#### **5.2. `treatments` Table** ✅ **Implemented**

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

#### **5.3. `appointments` Table** ✅ **Implemented**

Stores records of each patient visit and their vitals with comprehensive indexing.

```typescript
import { pgTable, serial, integer, varchar, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { patients } from "./patients";

export const appointmentStatusEnum = pgEnum("appointment_status", ["scheduled", "completed", "cancelled"]);

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  appointmentDate: timestamp("appointment_date").defaultNow().notNull(),
  bloodPressure: varchar("blood_pressure", { length: 10 }), // e.g., "120/80"
  respirationRate: integer("respiration_rate"), // breaths per minute
  heartRate: integer("heart_rate"), // beats per minute (ADDED: enhanced vital tracking)
  borgScale: integer("borg_scale"), // Rating from 6-20
  status: appointmentStatusEnum("status").default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  patientIdIdx: index("appointments_patient_id_idx").on(table.patientId),
  appointmentDateIdx: index("appointments_date_idx").on(table.appointmentDate),
  createdAtIdx: index("appointments_created_at_idx").on(table.createdAt),
}));
```

#### **5.4. `invoices` Table** ✅ **Implemented**

Stores billing information generated from appointments with status tracking indexes.

```typescript
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
```

#### **5.5. `appointmentTreatments` (Junction Table)** ✅ **Implemented**

Links appointments to the specific treatments provided during that session with price history and notes.

```typescript
import { pgTable, integer, primaryKey, decimal, text } from "drizzle-orm/pg-core";
import { appointments } from "./appointments";
import { treatments } from "./treatments";

export const appointmentTreatments = pgTable("appointment_treatments", {
  appointmentId: integer("appointment_id").references(() => appointments.id).notNull(),
  treatmentId: integer("treatment_id").references(() => treatments.id).notNull(),
  // Store price at time of appointment to prevent changes affecting old invoices
  priceAtTime: decimal("price_at_time", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"), // ADDED: Per-treatment notes capability
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.appointmentId, table.treatmentId] }),
  };
});
```

-----

### **6. Key Implementation Details** ✅ **Fully Implemented**

  * **Number Generation:** ✅ **Implemented**
    * Server-side generation using async functions in Server Actions
    * Pattern: `PREFIX-YYYY-#####` (e.g., `PT-2025-00001`, `INV-2025-00001`)
    * Year-based sequences for better organization
    * Database queries ensure no duplicates using `ILIKE` pattern matching
    * Sequential numbering with zero-padding
    * Located in: `app/actions/patients.ts` and `app/actions/invoices.ts`

  * **Excel Export:** ✅ **Implemented**
    * Using **ExcelJS 4.4.0** library
    * API Route: `/api/invoices/export/route.ts`
    * Server-side generation with in-memory workbook creation
    * Styled headers with gray background
    * Automatic column width adjustment
    * Includes all invoice data: invoice number, patient details, dates, amounts, status
    * Returns proper headers: `Content-Disposition` and `Content-Type`
    * Filename format: `invoices-YYYY-MM-DD.xlsx`
    * Full data joins with patients and appointments

  * **Charting:** ✅ **Implemented**
    * Using **Recharts 2.15.4** for all visualizations
    * Server Actions for data aggregation (no separate API endpoints needed)
    * Dashboard charts:
        * `AppointmentsChart`: Bar chart showing monthly appointment counts
        * `RevenueChart`: Line chart showing monthly revenue trends
    * SQL aggregation using Drizzle ORM with `COUNT`, `SUM`, `GROUP BY`
    * Data fetched via Server Actions in `app/actions/`:
        * `getAppointmentsByMonth()` - 12 months of appointment data
        * `getRevenueByMonth()` - 12 months of revenue data (paid invoices only)
    * Responsive chart sizing with Tailwind integration

  * **Printing:** ✅ **Implemented**
    * Dedicated `@media print` CSS in `invoice-detail.tsx`
    * Professional receipt layout with:
        * Hidden navigation, sidebar, and UI controls
        * Clean paper-friendly formatting
        * Clinic branding and information
        * Complete invoice breakdown
    * Print button triggers `window.print()`
    * Browser's native print dialog
    * Located in: `components/invoices/invoice-detail.tsx`

  * **State Management:** ✅ **Implemented**
    * Next.js App Router with Server Components for data fetching
    * React's `useState` for client-side form state
    * React Hook Form for form state management
    * Server Actions for mutations with automatic revalidation
    * `revalidatePath()` for cache invalidation
    * No additional state management library needed
    * Toast notifications via Sonner for user feedback

  * **Connection Pooling:** ✅ **Implemented**
    * PostgreSQL connection pool via `pg` library
    * Configuration in `db/index.ts`:
        * Max 20 connections
        * 30s idle timeout
        * 10s connection timeout (optimized for serverless)
        * SSL support for production
        * Error logging via custom logger
        * Connection monitoring in development

  * **Database Indexing:** ✅ **Implemented**
    * Strategic indexes on all tables:
        * Patients: name, created_at
        * Appointments: patient_id, appointment_date, created_at
        * Invoices: appointment_id, status, created_at
    * Optimizes common queries (searches, filters, date ranges)

  * **Form Validation:** ✅ **Implemented**
    * Zod schemas for all forms
    * Type-safe validation with TypeScript inference
    * Real-time client-side validation
    * Server-side validation in Server Actions
    * Error messages displayed via React Hook Form
    * Examples: heart rate range validation (40-220 bpm), required fields

  * **Settings Page:** ✅ **Implemented**
    * Theme switching (Light/Dark/System modes)
    * Data management tools
    * "Wipe All Data" functionality with confirmation dialog
    * Requires typing "DELETE ALL DATA" to confirm
    * Located in: `app/dashboard/settings/page.tsx`

  * **Responsive Design:** ✅ **Implemented**
    * Mobile-first responsive layout
    * Collapsible sidebar on mobile
    * Responsive data tables
    * Touch-friendly buttons and controls
    * Adaptive grid layouts

-----

### **7. Additional Features & Enhancements** ✅ **Implemented**

**UI/UX Enhancements:**
  * **Dark Mode Support:** Complete theme switching with system preference detection
  * **Toast Notifications:** Real-time user feedback for all actions using Sonner
  * **Loading States:** Loading indicators for async operations
  * **Error Handling:** Comprehensive error handling with user-friendly messages
  * **Confirmation Dialogs:** AlertDialogs for destructive actions (delete, wipe data)
  * **Searchable Dropdowns:** Command component for intuitive patient selection
  * **Sortable Tables:** TanStack Table integration for all data tables
  * **Icons:** Consistent icon usage throughout the application

**Data Management:**
  * **Search Functionality:** Real-time search for patients by name or record number
  * **Cascade Delete Protection:** Prevents deletion of records with dependencies
  * **Data Integrity:** Foreign key constraints and unique constraints enforced
  * **Audit Trails:** All tables include `createdAt` timestamps
  * **Price History:** Historical pricing preserved in `appointmentTreatments`

**Navigation & Layout:**
  * **Sidebar Navigation:** Collapsible sidebar with active state indicators
  * **Breadcrumbs:** Clear navigation hierarchy
  * **Quick Actions:** Floating action buttons and card-level shortcuts
  * **Responsive Grid:** Adaptive layouts for different screen sizes

**Performance Optimizations:**
  * **Connection Pooling:** Optimized database connection management
  * **Database Indexes:** Strategic indexing for query performance
  * **Server Components:** Leverage Next.js 15 Server Components for reduced client bundle
  * **Parallel Data Fetching:** Multiple Promise.all() calls for dashboard stats
  * **Cache Revalidation:** Automatic cache invalidation after mutations
  * **Turbopack:** Fast development builds and hot reload

**Developer Experience:**
  * **TypeScript:** Full type safety throughout the application
  * **Type Generation:** Drizzle ORM generates types from schema
  * **ESLint:** Code quality and consistency enforcement
  * **Docker Compose:** Easy local development environment setup
  * **Environment Variables:** Secure configuration management
  * **Logging:** Custom logger for database operations

-----

### **8. Project Structure**

```
medrec/
├── app/
│   ├── actions/              # Server Actions for data mutations
│   │   ├── appointments.ts
│   │   ├── invoices.ts
│   │   ├── patients.ts
│   │   ├── settings.ts
│   │   └── treatments.ts
│   ├── api/                  # API Routes
│   │   ├── health/          # Health check endpoint
│   │   └── invoices/
│   │       └── export/      # Excel export route
│   ├── dashboard/           # Main application pages
│   │   ├── page.tsx         # Dashboard with analytics
│   │   ├── patients/        # Patient management
│   │   ├── treatments/      # Treatment management
│   │   ├── appointments/    # Appointment management
│   │   ├── invoices/        # Invoice management
│   │   └── settings/        # Settings page
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── ui/                  # Shadcn/ui components
│   ├── dashboard/           # Dashboard-specific components
│   ├── patients/            # Patient components
│   ├── treatments/          # Treatment components
│   ├── appointments/        # Appointment components
│   ├── invoices/            # Invoice components
│   ├── app-sidebar.tsx      # Main sidebar navigation
│   └── [other components]
├── db/                      # Database layer
│   ├── schema/              # Drizzle ORM schemas
│   │   ├── patients.ts
│   │   ├── treatments.ts
│   │   ├── appointments.ts
│   │   ├── appointmentTreatments.ts
│   │   └── invoices.ts
│   └── index.ts             # Database connection & exports
├── lib/                     # Utility functions
│   ├── utils.ts             # Common utilities
│   └── logger.ts            # Custom logger
├── drizzle.config.ts        # Drizzle ORM configuration
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

-----

### **9. Deployment & Infrastructure**

**Hosting:**
  * Platform: Vercel (production deployment)
  * Automatic deployments from Git
  * Preview deployments for pull requests
  * Edge network for optimal performance

**Database:**
  * PostgreSQL hosted database with SSL
  * Connection pooling configured for serverless
  * Automatic backups (provider-dependent)

**Environment Variables:**
  * `DATABASE_URL`: PostgreSQL connection string
  * `NODE_ENV`: Environment (development/production)

**Build & Deploy:**
  * Build command: `npm run build`
  * Start command: `npm start`
  * Development: `npm run dev`
  * Turbopack for faster builds

**Monitoring:**
  * Vercel Speed Insights for performance monitoring
  * Custom error logging via logger
  * Database connection monitoring

-----

### **10. Future Enhancements**

**Planned Features (Not Yet Implemented):**
  * **Authentication System:** Better Auth integration for secure user login
  * **Multi-user Support:** Role-based access control
  * **Appointment Scheduling:** Calendar view for scheduling
  * **SMS/Email Notifications:** Appointment reminders
  * **Patient Portal:** Allow patients to view their records
  * **Reporting Dashboard:** Advanced analytics and reports
  * **Backup/Export System:** Automatic data backups
  * **Multi-language Support:** Internationalization (i18n)
  * **Mobile App:** Native mobile applications
  * **API Documentation:** REST API for integrations

-----

### **11. Conclusion**

The BSPCenter MedRec application is a **fully functional, production-ready** medical record management system that successfully implements all core features outlined in the original specification. The system provides:

✅ Complete patient management with auto-generated record numbers
✅ Treatment catalog with pricing management
✅ Appointment tracking with comprehensive vital signs
✅ Invoice generation with Excel export capabilities
✅ Professional print-ready invoice layouts
✅ Real-time dashboard analytics with charts
✅ Dark mode support and responsive design
✅ Robust data validation and error handling
✅ Optimized database performance with indexing
✅ Modern, intuitive user interface

The application is built on a solid technical foundation using the latest web technologies and best practices, making it maintainable, scalable, and ready for future enhancements.