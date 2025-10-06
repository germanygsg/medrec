CREATE TYPE "public"."appointment_status" AS ENUM('scheduled', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('unpaid', 'paid', 'void');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"appointment_date" timestamp DEFAULT now() NOT NULL,
	"blood_pressure" varchar(10),
	"respiration_rate" integer,
	"borg_scale" integer,
	"status" "appointment_status" DEFAULT 'completed',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_treatments" (
	"appointment_id" integer NOT NULL,
	"treatment_id" integer NOT NULL,
	"price_at_time" numeric(10, 2) NOT NULL,
	CONSTRAINT "appointment_treatments_appointment_id_treatment_id_pk" PRIMARY KEY("appointment_id","treatment_id")
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_number" varchar(20) NOT NULL,
	"appointment_id" integer NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"issue_date" timestamp DEFAULT now() NOT NULL,
	"status" "invoice_status" DEFAULT 'unpaid',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number"),
	CONSTRAINT "invoices_appointment_id_unique" UNIQUE("appointment_id")
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"record_number" varchar(20) NOT NULL,
	"name" varchar(256) NOT NULL,
	"date_of_birth" date NOT NULL,
	"address" text,
	"initial_diagnosis" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "patients_record_number_unique" UNIQUE("record_number")
);
--> statement-breakpoint
CREATE TABLE "treatments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_treatments" ADD CONSTRAINT "appointment_treatments_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_treatments" ADD CONSTRAINT "appointment_treatments_treatment_id_treatments_id_fk" FOREIGN KEY ("treatment_id") REFERENCES "public"."treatments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE no action ON UPDATE no action;