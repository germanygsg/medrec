# MedRec - Medical Records Management System

A comprehensive medical records management system built with Next.js 15, designed for healthcare facilities to manage patient records, appointments, treatments, and invoicing efficiently.

## Overview

MedRec is a full-stack medical practice management application that streamlines patient care workflows, appointment scheduling, treatment tracking, and financial operations. Built with modern web technologies, it provides a secure, scalable, and user-friendly solution for healthcare providers.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router with Turbopack)
- **Language:** TypeScript
- **Authentication:** [Better Auth](https://better-auth.com/)
- **Database:** [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (New York style)
- **Theme System:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Tables:** [TanStack Table](https://tanstack.com/table)
- **Charts:** [Recharts](https://recharts.org/)
- **Export:** [ExcelJS](https://github.com/exceljs/exceljs)

## Features

### 🏥 Patient Management
- Complete patient records with personal information
- Unique record number generation
- Patient search and filtering
- Patient demographics and contact details
- Medical history tracking

### 📅 Appointment Scheduling
- Create and manage appointments
- Track appointment status (scheduled, completed, cancelled)
- Record vital signs (blood pressure, heart rate, respiration rate, Borg scale)
- Link appointments to treatments
- **Date range filtering** - View appointments by custom date ranges, defaults to today
- Appointment deletion with cascade protection

### 💉 Treatment Management
- Define and manage treatment types
- Treatment pricing and descriptions
- Link treatments to appointments
- Track treatment history per patient
- Price snapshot at time of appointment

### 💰 Invoice Management
- Automatic invoice generation from appointments
- Unique invoice numbering system (INV-YYYY-NNNNN)
- Invoice status tracking (unpaid, paid, void)
- **Date range filtering** - Filter invoices by issue date, defaults to today
- Export invoices to Excel
- Financial reporting and analytics

### 📊 Dashboard & Analytics
- Real-time metrics and KPIs
- Patient statistics
- Appointment trends
- Revenue tracking
- Monthly performance charts

### 🔐 Security & Authentication
- Secure user authentication with Better Auth
- Role-based access control
- Session management
- Password protection

### 🎨 User Interface
- Modern, responsive design
- Dark mode support with system preference detection
- Intuitive navigation
- Real-time notifications
- Data tables with sorting, filtering, and pagination

## Prerequisites

Before you begin, ensure you have the following:
- Node.js 18+ installed
- Docker and Docker Compose (for database setup)
- PostgreSQL 14+ (if not using Docker)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/germanygsg/medrec.git
   cd medrec
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables Setup**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the environment variables as needed

4. **Start the database**
   ```bash
   npm run db:up
   ```

5. **Push database schema**
   ```bash
   npm run db:push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000) with your browser**

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/postgres
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Authentication
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

## Project Structure

```
medrec/
├── app/                           # Next.js app router
│   ├── actions/                   # Server actions
│   │   ├── appointments.ts        # Appointment CRUD operations
│   │   ├── invoices.ts           # Invoice operations
│   │   ├── patients.ts           # Patient management
│   │   └── treatments.ts         # Treatment operations
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── invoices/             # Invoice export API
│   ├── dashboard/                # Dashboard pages
│   │   ├── appointments/         # Appointments management
│   │   ├── invoices/            # Invoices management
│   │   ├── patients/            # Patient records
│   │   ├── settings/            # System settings
│   │   └── treatments/          # Treatment catalog
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── appointments/            # Appointment components
│   ├── dashboard/               # Dashboard widgets
│   ├── invoices/                # Invoice components
│   ├── patients/                # Patient components
│   ├── treatments/              # Treatment components
│   └── ui/                      # shadcn/ui components
├── db/                          # Database configuration
│   ├── index.ts                # Database connection
│   └── schema/                 # Database schemas
│       ├── appointments.ts     # Appointments schema
│       ├── invoices.ts        # Invoices schema
│       ├── patients.ts        # Patients schema
│       └── treatments.ts      # Treatments schema
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
│   ├── auth.ts                 # Authentication config
│   └── utils.ts                # Helper functions
└── docker-compose.yml          # Docker services
```

## Database Schema

### Core Tables
- **patients** - Patient records with demographics
- **appointments** - Appointment scheduling and vitals
- **treatments** - Treatment catalog with pricing
- **appointment_treatments** - Many-to-many relationship with price snapshots
- **invoices** - Financial records linked to appointments
- **users** - Authentication and user management

## Development Commands

### Application
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run validate` - Run lint and type check

### Database
- `npm run db:up` - Start PostgreSQL in Docker
- `npm run db:down` - Stop PostgreSQL container
- `npm run db:dev` - Start development PostgreSQL (port 5433)
- `npm run db:dev-down` - Stop development PostgreSQL
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Drizzle migration files
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:reset` - Reset database (drop all tables and recreate)

### Docker
- `npm run docker:build` - Build application Docker image
- `npm run docker:up` - Start full application stack
- `npm run docker:down` - Stop all containers
- `npm run docker:logs` - View container logs

## Key Features in Detail

### Date Range Filtering
Both Appointments and Invoices pages feature advanced date range filtering:
- **Default View:** Shows today's records automatically
- **Custom Ranges:** Select start and end dates using calendar picker
- **Visual Feedback:** Display selected date range
- **Server-Side Filtering:** Optimized database queries
- **Persistent State:** URL-based filter state

### Invoice Generation
- Automatically generates invoices from completed appointments
- Captures treatment prices at time of service
- Sequential invoice numbering by year
- Prevents duplicate invoices per appointment

### Appointment Management
- Record comprehensive vital signs
- Link multiple treatments per appointment
- Status tracking throughout appointment lifecycle
- Cascade protection for appointments with invoices

### Patient Records
- Unique record number system
- Complete demographic information
- View appointment history
- Track all treatments received

## Deployment

### Docker Deployment (Recommended)

1. **Build the image:**
   ```bash
   npm run docker:build
   ```

2. **Configure production environment:**
   ```bash
   # Edit .env with production values
   DATABASE_URL=postgresql://postgres:secure_password@postgres:5432/postgres
   BETTER_AUTH_SECRET=your-very-secure-secret-key
   BETTER_AUTH_URL=https://yourdomain.com
   ```

3. **Deploy:**
   ```bash
   npm run docker:up
   ```

### Vercel Deployment

1. **Deploy to Vercel:**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Add environment variables in Vercel dashboard:**
   - `DATABASE_URL`: Your managed PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: Generate a secure secret
   - `BETTER_AUTH_URL`: Your Vercel deployment URL

3. **Push database schema:**
   ```bash
   npm run db:push
   ```

## Production Considerations

### Database
- Use managed PostgreSQL (AWS RDS, Google Cloud SQL, Azure Database, Neon, Supabase)
- Configure connection pooling for production scale
- Enable SSL connections
- Regular automated backups
- Monitor query performance

### Security
- Generate strong authentication secrets (32+ characters)
- Enable HTTPS/TLS
- Implement rate limiting
- Regular security audits
- HIPAA compliance considerations for healthcare data

### Performance
- Enable Next.js output: 'standalone' for optimized containers
- Implement database query optimization
- Use CDN for static assets
- Enable caching strategies
- Monitor application performance

### Monitoring & Logging
- Application logging
- Error tracking (Sentry, LogRocket)
- Performance monitoring
- Uptime monitoring
- Database query logging

## API Documentation

### Server Actions

#### Appointments
- `getAppointments(startDate?, endDate?)` - Fetch appointments with optional date filtering
- `getAppointmentById(id)` - Get single appointment details
- `createAppointment(data)` - Create new appointment
- `updateAppointmentStatus(id, status)` - Update appointment status
- `deleteAppointment(id)` - Delete appointment (with cascade checks)

#### Invoices
- `getInvoices(startDate?, endDate?)` - Fetch invoices with optional date filtering
- `getInvoiceById(id)` - Get invoice details
- `generateInvoice(appointmentId)` - Generate invoice from appointment
- `updateInvoiceStatus(id, status)` - Update invoice payment status
- `deleteInvoice(id)` - Delete invoice

#### Patients
- `getPatients()` - List all patients
- `getPatientById(id)` - Get patient details
- `createPatient(data)` - Create new patient record
- `updatePatient(id, data)` - Update patient information
- `deletePatient(id)` - Delete patient record

#### Treatments
- `getTreatments()` - List all treatments
- `createTreatment(data)` - Add new treatment
- `updateTreatment(id, data)` - Update treatment details
- `deleteTreatment(id)` - Delete treatment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue on the GitHub repository.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database ORM by [Drizzle](https://orm.drizzle.team/)
