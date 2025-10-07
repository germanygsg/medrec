# Database Schema Documentation

This document describes the database schema for the MedRec (Medical Records) application.

## Technology Stack
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL

## Schema Overview

The database consists of 5 main tables:
1. **patients** - Patient information
2. **appointments** - Patient appointments with vitals
3. **treatments** - Available medical treatments
4. **appointment_treatments** - Junction table linking appointments to treatments
5. **invoices** - Billing information for appointments

---

## Tables

### 1. patients

Stores patient demographic and medical information.

**Columns:**
- `id` (serial, PRIMARY KEY) - Unique patient identifier
- `record_number` (varchar(20), UNIQUE, NOT NULL) - Patient record number
- `name` (varchar(256), NOT NULL) - Patient full name
- `date_of_birth` (date, NOT NULL) - Patient's date of birth
- `address` (text) - Patient's address
- `initial_diagnosis` (text) - Initial medical diagnosis
- `created_at` (timestamp, NOT NULL, DEFAULT NOW) - Record creation timestamp

**Indexes:**
- `patients_name_idx` on `name`
- `patients_created_at_idx` on `created_at`

**Relationships:**
- One-to-many with `appointments`

---

### 2. appointments

Records patient appointments and vital signs measurements.

**Columns:**
- `id` (serial, PRIMARY KEY) - Unique appointment identifier
- `patient_id` (integer, NOT NULL, FOREIGN KEY → patients.id) - Reference to patient
- `appointment_date` (timestamp, NOT NULL, DEFAULT NOW) - Date and time of appointment
- `blood_pressure` (varchar(10)) - Blood pressure reading (e.g., "120/80")
- `respiration_rate` (integer) - Respiration rate (breaths per minute)
- `heart_rate` (integer) - Heart rate (beats per minute)
- `borg_scale` (integer) - Borg scale rating (perceived exertion)
- `status` (appointment_status, DEFAULT 'completed') - Appointment status
- `created_at` (timestamp, NOT NULL, DEFAULT NOW) - Record creation timestamp

**Enums:**
- `appointment_status`: ['scheduled', 'completed', 'cancelled']

**Indexes:**
- `appointments_patient_id_idx` on `patient_id`
- `appointments_date_idx` on `appointment_date`
- `appointments_created_at_idx` on `created_at`

**Relationships:**
- Many-to-one with `patients`
- One-to-one with `invoices`
- Many-to-many with `treatments` (through `appointment_treatments`)

---

### 3. treatments

Catalog of available medical treatments and their prices.

**Columns:**
- `id` (serial, PRIMARY KEY) - Unique treatment identifier
- `name` (varchar(256), NOT NULL) - Treatment name
- `description` (text) - Detailed treatment description
- `price` (decimal(10,2), NOT NULL) - Treatment price
- `created_at` (timestamp, NOT NULL, DEFAULT NOW) - Record creation timestamp

**Relationships:**
- Many-to-many with `appointments` (through `appointment_treatments`)

---

### 4. appointment_treatments

Junction table linking appointments to treatments performed.

**Columns:**
- `appointment_id` (integer, NOT NULL, FOREIGN KEY → appointments.id) - Reference to appointment
- `treatment_id` (integer, NOT NULL, FOREIGN KEY → treatments.id) - Reference to treatment
- `price_at_time` (decimal(10,2), NOT NULL) - Price of treatment at time of appointment
- `notes` (text) - Additional notes about the treatment

**Primary Key:**
- Composite key: (`appointment_id`, `treatment_id`)

**Relationships:**
- Many-to-one with `appointments`
- Many-to-one with `treatments`

**Note:** The `price_at_time` field stores a historical price snapshot, allowing treatment prices to change over time without affecting past records.

---

### 5. invoices

Billing and payment information for appointments.

**Columns:**
- `id` (serial, PRIMARY KEY) - Unique invoice identifier
- `invoice_number` (varchar(20), UNIQUE, NOT NULL) - Human-readable invoice number
- `appointment_id` (integer, UNIQUE, NOT NULL, FOREIGN KEY → appointments.id) - Reference to appointment
- `total_amount` (decimal(10,2), NOT NULL) - Total invoice amount
- `issue_date` (timestamp, NOT NULL, DEFAULT NOW) - Invoice issue date
- `status` (invoice_status, DEFAULT 'unpaid') - Payment status
- `created_at` (timestamp, NOT NULL, DEFAULT NOW) - Record creation timestamp

**Enums:**
- `invoice_status`: ['unpaid', 'paid', 'void']

**Indexes:**
- `invoices_appointment_id_idx` on `appointment_id`
- `invoices_status_idx` on `status`
- `invoices_created_at_idx` on `created_at`

**Relationships:**
- One-to-one with `appointments`

---

## Entity Relationships

```
patients (1) ──── (∞) appointments (1) ──── (1) invoices
                          │
                          │
                          │ (∞)
                          │
                     appointment_treatments
                          │
                          │ (∞)
                          │
                      treatments
```

### Relationship Details:

1. **Patient → Appointments**: One patient can have many appointments
2. **Appointment → Treatments**: Many-to-many relationship through `appointment_treatments`
3. **Appointment → Invoice**: One appointment has one invoice (1:1)

---

## Enumerations

### appointment_status
- `scheduled` - Appointment is scheduled for the future
- `completed` - Appointment has been completed
- `cancelled` - Appointment was cancelled

### invoice_status
- `unpaid` - Invoice has not been paid
- `paid` - Invoice has been paid
- `void` - Invoice has been voided/cancelled

---

## Indexes Summary

The schema includes indexes on the following columns for improved query performance:

**patients:**
- name
- created_at

**appointments:**
- patient_id
- appointment_date
- created_at

**invoices:**
- appointment_id
- status
- created_at

---

## Notes

1. **Timestamps**: All tables include `created_at` timestamps for audit purposes
2. **Pricing History**: The `appointment_treatments` table stores `price_at_time` to maintain historical pricing data
3. **Unique Constraints**: Both patients and invoices have unique identifiers (`record_number` and `invoice_number`)
4. **Decimal Precision**: All monetary values use `decimal(10,2)` for accurate financial calculations
