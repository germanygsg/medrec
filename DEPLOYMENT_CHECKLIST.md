# Production Deployment Checklist

## Pre-Deployment Tasks

### 1. Code Quality ✓
- [x] All TypeScript errors resolved
- [x] ESLint warnings addressed
- [x] Code reviewed and tested
- [ ] Run: `npm run validate` (type-check + lint)

### 2. Environment Configuration ✓
- [ ] Copy `.env.example` to `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Configure production `DATABASE_URL` with SSL
- [ ] Generate secure `BETTER_AUTH_SECRET` (min 32 chars)
  ```bash
  openssl rand -base64 32
  ```
- [ ] Set production URLs:
  - `BETTER_AUTH_URL=https://yourdomain.com`
  - `NEXT_PUBLIC_BETTER_AUTH_URL=https://yourdomain.com`

### 3. Database Setup ✓
- [ ] Database server running
- [ ] Database created
- [ ] Migrations applied:
  ```bash
  npm run db:migrate
  ```
- [ ] Verify indexes created:
  ```sql
  SELECT * FROM pg_indexes WHERE tablename IN ('patients', 'appointments', 'invoices');
  ```
- [ ] Database backups configured
- [ ] Connection pooling tested (max 20 connections)

### 4. Security Verification ✓
- [x] Security headers configured
- [x] Rate limiting enabled (100 req/min)
- [x] CSP policy set
- [x] SSL/TLS configured
- [ ] Test security headers: https://securityheaders.com
- [ ] Verify HTTPS redirect working
- [ ] Test rate limiting with load tool

### 5. Performance Testing ✓
- [ ] Build application: `npm run build`
- [ ] Test production build locally: `npm start`
- [ ] Load test with expected traffic
- [ ] Verify database query performance
- [ ] Check Core Web Vitals
- [ ] Review bundle size: `npm run build:analyze`

## Deployment Steps

### Option 1: Docker Deployment
```bash
# 1. Build image
npm run docker:build

# 2. Start containers
npm run docker:up

# 3. Check logs
npm run docker:logs

# 4. Verify health
curl http://localhost:3000
```

### Option 2: Vercel Deployment
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Set environment variables in Vercel dashboard
vercel env add DATABASE_URL production
vercel env add BETTER_AUTH_SECRET production
vercel env add BETTER_AUTH_URL production
vercel env add NEXT_PUBLIC_BETTER_AUTH_URL production

# 3. Deploy
vercel --prod
```

### Option 3: Manual Deployment
```bash
# 1. SSH to server
ssh user@your-server.com

# 2. Clone/pull repository
git pull origin main

# 3. Install dependencies
npm ci

# 4. Generate migrations
npm run db:generate

# 5. Run migrations
npm run db:migrate

# 6. Build application
npm run build

# 7. Start with PM2
pm2 start npm --name "medrec" -- start
pm2 save
```

## Post-Deployment Verification

### 1. Functional Testing
- [ ] Landing page loads
- [ ] Sign in works
- [ ] Sign up works
- [ ] Dashboard displays
- [ ] Create patient
- [ ] Create appointment
- [ ] Generate invoice
- [ ] Search functionality
- [ ] Delete operations (with cascading checks)

### 2. Performance Checks
- [ ] Page load time < 3s
- [ ] API response time < 500ms
- [ ] Database queries optimized (check slow query log)
- [ ] No memory leaks (monitor for 1 hour)
- [ ] Connection pool stable

### 3. Security Validation
- [ ] All HTTP redirects to HTTPS
- [ ] Security headers present (check with curl)
- [ ] Rate limiting triggers at 100 req/min
- [ ] CSP policy enforced
- [ ] No exposed secrets in client bundle
- [ ] Authentication flows secure

### 4. Error Handling
- [ ] 404 page displays correctly
- [ ] Error boundary catches errors
- [ ] Errors logged properly
- [ ] No sensitive data in error messages
- [ ] Database errors handled gracefully

### 5. Monitoring Setup
- [ ] Error tracking configured (Sentry/Rollbar)
- [ ] Performance monitoring active (New Relic/DataDog)
- [ ] Log aggregation working (CloudWatch/Papertrail)
- [ ] Uptime monitoring configured (Pingdom/UptimeRobot)
- [ ] Alerts configured for critical issues

## Production Optimizations Applied

### ✅ Database
- Connection pooling (max 20)
- Indexes on frequently queried fields:
  - patients: name, createdAt
  - appointments: patientId, appointmentDate, createdAt
  - invoices: appointmentId, status, createdAt
- SSL enabled for production

### ✅ Security
- HSTS enabled (max-age: 2 years)
- CSP policy configured
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Rate limiting: 100 req/min/IP
- Input validation with Zod
- SQL injection protection

### ✅ Performance
- Image optimization (WebP/AVIF)
- Gzip compression
- Package import optimization
- Code splitting
- Lazy loading
- 60s image cache TTL

### ✅ Reliability
- Error boundaries (global + page-level)
- Custom 404 page
- Loading states
- Structured logging
- Connection error handling

## Rollback Plan

If issues occur after deployment:

### Quick Rollback
```bash
# Docker
docker-compose down
docker-compose up -d --scale app=0
git checkout <previous-commit>
docker-compose build
docker-compose up -d

# Vercel
vercel rollback

# Manual
pm2 stop medrec
git checkout <previous-commit>
npm ci
npm run build
pm2 restart medrec
```

### Database Rollback
```bash
# Restore from backup
psql -U postgres -d dbname < backup.sql

# Or rollback migration
npm run db:rollback
```

## Monitoring Dashboards

### Key Metrics to Watch (First 24h)
1. **Error Rate**: Should be < 0.1%
2. **Response Time**: 95th percentile < 1s
3. **Database Pool**: < 80% utilization
4. **Memory Usage**: Stable (no growth)
5. **CPU Usage**: < 70% average

### Alert Thresholds
- Error rate > 1%: Warning
- Error rate > 5%: Critical
- Response time > 2s: Warning
- Response time > 5s: Critical
- Database pool > 90%: Warning
- Memory growth > 20% in 1h: Warning

## Post-Launch Tasks

### Week 1
- [ ] Monitor error rates daily
- [ ] Review performance metrics
- [ ] Check database slow queries
- [ ] Verify backup restoration
- [ ] User feedback collection

### Week 2-4
- [ ] Optimize based on real usage patterns
- [ ] Address any performance bottlenecks
- [ ] Security audit results review
- [ ] Load testing with real traffic patterns

### Monthly
- [ ] Security updates
- [ ] Dependency updates
- [ ] Performance review
- [ ] Cost optimization review

## Support Contacts

- **Technical Lead**: [Name/Email]
- **DevOps**: [Name/Email]
- **Database Admin**: [Name/Email]
- **Security Team**: [Name/Email]

## Emergency Procedures

### Critical Issue Response
1. **Alert**: Check monitoring dashboard
2. **Assess**: Determine severity (P0-P3)
3. **Mitigate**: Quick fix or rollback
4. **Communicate**: Notify stakeholders
5. **Resolve**: Permanent fix
6. **Document**: Post-mortem report

### Contact Priority
1. On-call engineer (immediate)
2. Technical lead (< 30 min)
3. Management (P0 only)

---

## Sign-off

- [ ] Technical Lead: _________________ Date: _______
- [ ] DevOps: _________________ Date: _______
- [ ] Security: _________________ Date: _______
- [ ] Product Owner: _________________ Date: _______

**Deployment Status**: ⬜ Ready | ⬜ In Progress | ⬜ Complete | ⬜ Rolled Back

**Notes**:
_______________________________________
_______________________________________
_______________________________________
