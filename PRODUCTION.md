# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Copy `.env.example` to `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database URL with SSL
- [ ] Generate secure `BETTER_AUTH_SECRET` (min 32 chars): `openssl rand -base64 32`
- [ ] Set production URLs for `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL`

### 2. Database Setup
```bash
# Generate migrations
npm run db:generate

# Apply migrations to production database
npm run db:migrate

# Or push schema directly (not recommended for production)
npm run db:push
```

### 3. Security
- [ ] Review and update CORS settings if needed
- [ ] Ensure all API routes validate inputs
- [ ] Review rate limiting configuration in `middleware.ts`
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules

### 4. Performance
- [ ] Database indexes are applied (automatically via migrations)
- [ ] Enable connection pooling in database
- [ ] Configure CDN for static assets
- [ ] Set up Redis for rate limiting (replace in-memory implementation)

### 5. Monitoring & Logging
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure application monitoring (New Relic, DataDog, etc.)
- [ ] Set up log aggregation (CloudWatch, Papertrail, etc.)
- [ ] Configure uptime monitoring

## Build & Deploy

### Option 1: Docker Deployment
```bash
# Build Docker image
npm run docker:build

# Run containers
npm run docker:up

# View logs
npm run docker:logs
```

### Option 2: Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 3: Traditional Deployment
```bash
# Install dependencies
npm ci

# Validate code
npm run validate

# Build application
npm run build

# Start production server
npm start
```

## Post-Deployment

### 1. Health Checks
- [ ] Test all critical user flows
- [ ] Verify database connectivity
- [ ] Check authentication flows
- [ ] Test error handling

### 2. Performance Monitoring
- [ ] Monitor response times
- [ ] Check memory usage
- [ ] Monitor database query performance
- [ ] Review error rates

### 3. Security Audit
- [ ] Run security headers check: https://securityheaders.com
- [ ] Test rate limiting
- [ ] Verify CSP is working
- [ ] Check for exposed secrets

## Optimization Tips

### Database
- Connection pooling is enabled by default
- Indexes are applied for frequently queried fields:
  - Patients: `name`, `createdAt`
  - Appointments: `patientId`, `appointmentDate`, `createdAt`
  - Invoices: `appointmentId`, `status`, `createdAt`

### Caching
Consider implementing:
- Redis for session storage
- CDN for static assets
- Database query caching
- API response caching

### Monitoring
Integrate with:
- **Error Tracking**: Sentry, Rollbar
- **Performance**: New Relic, DataDog
- **Logs**: CloudWatch, Papertrail
- **Uptime**: Pingdom, UptimeRobot

## Security Best Practices

### Applied Security Measures
✅ Security headers (HSTS, CSP, X-Frame-Options, etc.)
✅ Rate limiting (100 req/min per IP)
✅ Input validation with Zod
✅ SQL injection protection (Drizzle ORM)
✅ Environment variable validation
✅ Error boundaries
✅ HTTPS enforcement (production)

### Additional Recommendations
- Set up WAF (Web Application Firewall)
- Implement audit logging for sensitive operations
- Regular security updates
- Database backups and disaster recovery plan
- API key rotation policy

## Scaling Considerations

### Horizontal Scaling
- Deploy multiple instances behind load balancer
- Use Redis for shared rate limiting
- Implement session store with Redis
- Consider read replicas for database

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching layers
- Use CDN for static content

## Troubleshooting

### Common Issues
1. **Database connection errors**
   - Verify DATABASE_URL is correct
   - Check SSL/TLS settings
   - Ensure firewall allows connections

2. **Authentication issues**
   - Verify BETTER_AUTH_SECRET is set
   - Check BETTER_AUTH_URL matches deployment URL
   - Ensure cookies are working (secure flag in production)

3. **Performance issues**
   - Check database indexes
   - Review slow query logs
   - Monitor memory usage
   - Check for N+1 queries

## Maintenance

### Regular Tasks
- [ ] Weekly security updates
- [ ] Monthly dependency updates
- [ ] Quarterly security audits
- [ ] Database backup verification
- [ ] Log rotation and cleanup
- [ ] Performance review

### Backup Strategy
- Automated daily database backups
- Retain backups for 30 days
- Test restore process monthly
- Document disaster recovery plan
