# Medical Record Management System - Setup Guide

## Overview

A complete web-based Medical Record Management System built with Next.js 15, PostgreSQL, Drizzle ORM, and Better Auth.

## What's Been Created

### ✅ Database Schema (Complete)
- **Patients table**: With auto-generated record numbers (PT-YYYY-#####)
- **Treatments table**: Billable services with pricing
- **Appointments table**: Patient visits with vitals (BP, respiration, Borg scale)
- **Invoices table**: Billing with auto-generated invoice numbers (INV-YYYY-#####)
- **AppointmentTreatments junction table**: Links appointments to treatments with historical pricing

### ✅ Server Actions (Complete)
All CRUD operations implemented for:
- **Patients** (`app/actions/patients.ts`)
  - Create, Read, Update, Delete
  - Search functionality
  - Auto record number generation
  - Age calculation
  - Monthly new patient count

- **Treatments** (`app/actions/treatments.ts`)
  - Create, Read, Update, Delete
  - Service management

- **Appointments** (`app/actions/appointments.ts`)
  - Create with multiple treatments
  - Full appointment history
  - Monthly appointment tracking
  - Appointment charts data

- **Invoices** (`app/actions/invoices.ts`)
  - Auto-generation from appointments
  - Invoice status management (paid/unpaid/void)
  - Monthly revenue tracking
  - Revenue charts data
  - Excel export API route at `/api/invoices/export`

### ✅ Dashboard & Navigation (Complete)
- **Dashboard** (`app/dashboard/page.tsx`)
  - Analytics cards: New Patients, Total Appointments, Total Revenue
  - Appointments per month bar chart
  - Revenue per month line chart

- **Sidebar Navigation** updated with medical system routes:
  - Dashboard
  - Patients
  - Treatments
  - Appointments
  - Invoices

### ⚠️ Still Needed - UI Pages & Components

The following pages need to be created (structure exists, components needed):

#### 1. Patients Pages
- `/dashboard/patients/page.tsx` - Created (needs PatientsTable component)
- `/dashboard/patients/new` - Form to create patient
- `/dashboard/patients/[id]` - Patient detail view with appointment history
- `/dashboard/patients/[id]/edit` - Edit patient form

#### 2. Treatments Pages
- `/dashboard/treatments/page.tsx` - List all treatments
- `/dashboard/treatments/new` - Add treatment form
- Treatment edit/delete actions in table

#### 3. Appointments Pages
- `/dashboard/appointments/page.tsx` - List all appointments
- `/dashboard/appointments/new` - Create appointment with patient selector and treatment checklist
- `/dashboard/appointments/[id]` - View appointment details
- Vitals input fields (BP, respiration rate, Borg scale)

#### 4. Invoices Pages
- `/dashboard/invoices/page.tsx` - List all invoices
- `/dashboard/invoices/[id]` - Invoice detail with print functionality
- Print-friendly invoice template with `@media print` styles
- "Generate Invoice" button on appointment pages
- "Export to Excel" button (route already created at `/api/invoices/export`)

#### 5. Reusable Components Needed
- `<PatientsTable>` - Searchable/sortable patient list
- `<PatientForm>` - Create/edit patient
- `<TreatmentsTable>` - List of services
- `<TreatmentForm>` - Add/edit treatments
- `<AppointmentsTable>` - Appointment list with patient names
- `<AppointmentForm>` - Multi-step form with patient selector, vitals, treatment checklist
- `<InvoiceList>` - Table of invoices with filters
- `<InvoiceDetail>` - Printable invoice template
- Various UI components using shadcn/ui

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
Make sure Docker is installed, then:

```bash
# Copy environment variables
cp .env.example .env

# Start PostgreSQL database
npm run db:dev

# Push schema to database
npm run db:push
```

### 3. Configure Environment Variables
Edit `.env` and update:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Database Commands

```bash
# Generate migrations from schema changes
npm run db:generate

# Push schema to database (development)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio

# Start dev database
npm run db:dev

# Stop dev database
npm run db:dev-down

# Reset database (drop all data)
npm run db:reset
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Auth**: Better Auth
- **UI**: Shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Excel Export**: ExcelJS

## Project Structure

```
medrec/
├── app/
│   ├── actions/              # Server actions
│   │   ├── patients.ts       ✅ Complete
│   │   ├── treatments.ts     ✅ Complete
│   │   ├── appointments.ts   ✅ Complete
│   │   └── invoices.ts       ✅ Complete
│   ├── api/
│   │   └── invoices/export/  ✅ Complete (Excel export)
│   └── dashboard/
│       ├── page.tsx          ✅ Complete
│       ├── patients/         ⚠️ Needs UI components
│       ├── treatments/       ⚠️ Not created
│       ├── appointments/     ⚠️ Not created
│       └── invoices/         ⚠️ Not created
├── components/
│   ├── dashboard/            ✅ Chart components complete
│   └── ui/                   ✅ Shadcn components
├── db/
│   ├── schema/              ✅ All schemas complete
│   │   ├── auth.ts
│   │   ├── patients.ts
│   │   ├── treatments.ts
│   │   ├── appointments.ts
│   │   ├── invoices.ts
│   │   └── appointmentTreatments.ts
│   └── index.ts             ✅ Complete
└── drizzle/                 ✅ Migrations generated
```

## Next Steps for Completion

1. **Create Treatment Pages**
   - List page with table
   - Form for adding/editing services

2. **Create Appointment Pages**
   - List view
   - Form with patient search dropdown
   - Treatment multi-select
   - Vitals input (blood pressure, respiration, Borg scale)

3. **Create Invoice Pages**
   - List with status badges
   - Detail view with print button
   - Generate invoice from appointment
   - Print-friendly CSS

4. **Build Forms & Tables**
   - Use react-hook-form + Zod for validation
   - Use @tanstack/react-table for data tables
   - Add search, sort, and filter capabilities

5. **Polish & Testing**
   - Add loading states
   - Error handling
   - Form validation
   - Test all CRUD operations

## Key Features Implemented

✅ Auto-generated unique record and invoice numbers
✅ Historical pricing (treatments store price at time of appointment)
✅ Month-over-month analytics
✅ Excel export for invoices
✅ Database migrations
✅ Type-safe ORM queries
✅ Server-side data fetching
✅ Authentication ready (Better Auth)

## Features Ready to Implement (Backend Complete)

- Patient management with age calculation
- Treatment/service catalog
- Appointment scheduling with clinical data
- Invoice generation and payment tracking
- Dashboard analytics
- Excel reporting
- Print-friendly invoices

All backend logic is complete. Only UI components and page layouts remain.
