# BSPCenter Medical Records - Production Guide

## 🚀 Quick Start (Production)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- SSL/TLS certificates (for HTTPS)

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Generate secure auth secret (min 32 characters)
openssl rand -base64 32

# Edit .env with production values
nano .env
```

### Deployment
```bash
# Install dependencies
npm ci

# Validate code
npm run validate

# Generate database migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Build for production
npm run build

# Start production server
npm start
```

Server runs on `http://localhost:3000` (configure reverse proxy for HTTPS)

## 📋 Production Optimizations

### Performance
- ✅ Database connection pooling (max 20 connections)
- ✅ Database indexes on critical queries
- ✅ Image optimization (WebP/AVIF)
- ✅ Code splitting and lazy loading
- ✅ Gzip compression enabled
- ✅ Package import optimization

### Security
- ✅ Security headers (HSTS, CSP, X-Frame-Options)
- ✅ Rate limiting (100 requests/min per IP)
- ✅ Input validation with Zod
- ✅ SQL injection protection
- ✅ XSS protection
- ✅ Environment variable validation

### Reliability
- ✅ Global error boundaries
- ✅ Custom 404 page
- ✅ Loading states
- ✅ Structured logging
- ✅ Health check endpoint (`/api/health`)

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Better Auth
- **Deployment**: Docker / Vercel / Node.js

### Database Schema
- `patients` - Patient records
- `appointments` - Appointment data with vitals
- `treatments` - Treatment catalog
- `appointment_treatments` - Many-to-many relationship
- `invoices` - Billing information
- `users`, `sessions`, `accounts` - Authentication

### Key Features
1. **Patient Management** - CRUD with search and filtering
2. **Appointments** - Track visits with vital signs
3. **Treatments** - Catalog with pricing
4. **Invoicing** - Generate and export invoices
5. **Dashboard** - Analytics with charts
6. **Theme Support** - Light/Dark/System modes

## 🔒 Security

### Applied Security Measures
1. **Headers**
   - HSTS (2-year max-age)
   - Content Security Policy
   - X-Frame-Options: SAMEORIGIN
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection

2. **Rate Limiting**
   - 100 requests per minute per IP
   - Configurable in `middleware.ts`
   - Ready for Redis integration

3. **Authentication**
   - Secure session management
   - CSRF protection
   - Password hashing
   - Secure cookie settings

4. **Database**
   - Parameterized queries (SQL injection protection)
   - Connection encryption (SSL in production)
   - Principle of least privilege

### Security Checklist
- [ ] Generate strong `BETTER_AUTH_SECRET` (32+ chars)
- [ ] Enable SSL/TLS for database connection
- [ ] Configure HTTPS with valid certificates
- [ ] Set up WAF (Web Application Firewall)
- [ ] Regular security audits
- [ ] Implement audit logging

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3000/api/health
```

Response includes:
- Overall status
- Database connectivity
- Memory usage
- System uptime
- Application version

### Key Metrics
1. **Performance**
   - API response time (target: < 500ms)
   - Database query time (target: < 100ms)
   - Page load time (target: < 3s)

2. **Errors**
   - Application errors
   - Database errors
   - Authentication failures
   - Rate limit hits

3. **Business**
   - Active users
   - Appointments per day
   - Invoices generated
   - New patient registrations

### Recommended Tools
- **Error Tracking**: Sentry, Rollbar
- **Performance**: New Relic, DataDog
- **Logs**: CloudWatch, Papertrail
- **Uptime**: Pingdom, UptimeRobot

## 🗄️ Database

### Connection Pool
- Max connections: 20
- Idle timeout: 30s
- Connection timeout: 2s
- SSL enabled in production

### Indexes
Optimized for common queries:
```sql
-- Patients
CREATE INDEX patients_name_idx ON patients(name);
CREATE INDEX patients_created_at_idx ON patients(created_at);

-- Appointments
CREATE INDEX appointments_patient_id_idx ON appointments(patient_id);
CREATE INDEX appointments_date_idx ON appointments(appointment_date);
CREATE INDEX appointments_created_at_idx ON appointments(created_at);

-- Invoices
CREATE INDEX invoices_appointment_id_idx ON invoices(appointment_id);
CREATE INDEX invoices_status_idx ON invoices(status);
CREATE INDEX invoices_created_at_idx ON invoices(created_at);
```

### Backup Strategy
1. Automated daily backups
2. Retain for 30 days
3. Test restore monthly
4. Document recovery procedures

### Migrations
```bash
# Generate migration
npm run db:generate

# Apply migrations
npm run db:migrate

# Rollback (manual)
psql -U postgres -d dbname < backup.sql
```

## 🔧 Configuration

### Environment Variables
```bash
# Required
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
BETTER_AUTH_SECRET=<32+ character secret>
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com

# Optional
LOG_LEVEL=info
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

### Build Configuration
```javascript
// next.config.ts
{
  output: 'standalone',        // Optimized deployment
  compress: true,              // Gzip compression
  poweredByHeader: false,      // Remove X-Powered-By
  experimental: {
    optimizePackageImports: ['lucide-react', '@tabler/icons-react']
  }
}
```

## 🚢 Deployment Options

### 1. Docker
```bash
# Build and run
npm run docker:build
npm run docker:up

# View logs
npm run docker:logs

# Stop
npm run docker:down
```

### 2. Vercel
```bash
# Install CLI
npm i -g vercel

# Set environment variables in dashboard
# Then deploy
vercel --prod
```

### 3. Traditional VPS
```bash
# Using PM2
npm ci
npm run build
pm2 start npm --name "medrec" -- start
pm2 startup
pm2 save

# Using systemd
sudo systemctl enable medrec
sudo systemctl start medrec
```

### 4. Kubernetes
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: medrec
spec:
  replicas: 3
  selector:
    matchLabels:
      app: medrec
  template:
    metadata:
      labels:
        app: medrec
    spec:
      containers:
      - name: medrec
        image: medrec:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: medrec-secrets
              key: database-url
```

## 📈 Scaling

### Current Capacity
- Single instance: ~1,000 concurrent users
- Database: 20 connections (scales to ~100)
- Rate limit: 100 req/min/IP

### Horizontal Scaling
1. Deploy behind load balancer (Nginx, HAProxy)
2. Use Redis for:
   - Rate limiting (distributed)
   - Session storage
   - Cache layer
3. Add database read replicas
4. Use CDN for static assets

### Vertical Scaling
1. Increase server resources
2. Optimize database (more RAM, SSD)
3. Add caching (Redis, Memcached)
4. Database query optimization

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check connection
psql $DATABASE_URL

# Verify SSL
openssl s_client -connect db-host:5432

# Check pool settings in db/index.ts
```

#### High Memory Usage
```bash
# Check Node.js heap
node --max-old-space-size=4096 server.js

# Monitor
curl http://localhost:3000/api/health
```

#### Rate Limit Issues
```javascript
// Adjust in middleware.ts
const MAX_REQUESTS = 200; // Increase
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
```

#### Build Failures
```bash
# Clear cache
rm -rf .next node_modules
npm ci
npm run build
```

## 📚 Documentation

- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Pre-deployment tasks
- [Production Guide](./PRODUCTION.md) - Detailed production setup
- [Optimization Summary](./OPTIMIZATION_SUMMARY.md) - All optimizations applied
- [API Documentation](./API.md) - API endpoints (if applicable)

## 🆘 Support

### Getting Help
1. Check [Troubleshooting](#troubleshooting) section
2. Review error logs: `pm2 logs medrec`
3. Check health endpoint: `/api/health`
4. Contact technical support

### Reporting Issues
Include:
- Error message and stack trace
- Steps to reproduce
- Environment (Node version, OS)
- Health check output
- Recent changes

## 📝 License

Private - BSPCenter Physiotherapy Clinic

---

**Last Updated**: 2025-01-XX
**Version**: 0.1.0
**Status**: Production Ready ✅
