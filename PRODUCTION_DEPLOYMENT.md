# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Copy `.env.production` and configure all production values
- [ ] Set `NODE_ENV=production`
- [ ] Configure production database with SSL enabled
- [ ] Set secure `SESSION_SECRET` (use `openssl rand -base64 32`)
- [ ] Configure `APP_URL` to production domain

### 2. Database Preparation
```bash
# Run database migrations
npm run db:migrate:prod

# Verify database connection
# Check app health endpoint after deployment: /api/health
```

### 3. Code Quality
```bash
# Run linting
npm run lint

# Run type checking
npm run type-check

# Or run both
npm run validate
```

### 4. Build and Test
```bash
# Create production build
npm run build:prod

# Test production build locally
npm run start:prod
```

## Deployment Options

### Option 1: Docker Deployment (Recommended)

```bash
# Build Docker image
npm run docker:build

# Start services (includes database and app)
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Option 2: VPS/Cloud Server Deployment

#### Requirements
- Node.js 20+ installed
- PostgreSQL 14+ with SSL
- PM2 or similar process manager
- Nginx or similar reverse proxy

#### Steps

1. **Install Dependencies**
```bash
npm ci --production=false
```

2. **Build Application**
```bash
npm run build:prod
```

3. **Set up Process Manager (PM2)**
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start npm --name "medrec-app" -- run start:prod

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

4. **Configure Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Setup SSL with Let's Encrypt**
```bash
sudo certbot --nginx -d your-domain.com
```

### Option 3: Platform as a Service (Vercel, Railway, etc.)

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Environment Variables to Set:**
- `DATABASE_URL`
- `NODE_ENV=production`
- `SESSION_SECRET`

## Post-Deployment

### 1. Verify Deployment
- [ ] Check health endpoint: `https://your-domain.com/api/health`
- [ ] Test user authentication
- [ ] Verify database connectivity
- [ ] Test critical user flows

### 2. Monitoring Setup
```bash
# Monitor application logs
pm2 logs medrec-app

# Monitor resource usage
pm2 monit
```

### 3. Backup Strategy
```bash
# Database backups (example with PostgreSQL)
pg_dump -U username -h host -d database > backup_$(date +%Y%m%d_%H%M%S).sql

# Automated daily backups (cron job)
0 2 * * * /path/to/backup-script.sh
```

## Performance Optimizations Applied

### Database
- ✅ Optimized connection pooling (10 connections max in production)
- ✅ Query timeouts configured (10s statement timeout)
- ✅ SSL enabled for production
- ✅ Proper indexes on frequently queried columns

### Application
- ✅ Standalone output mode for smaller Docker images
- ✅ Gzip compression enabled
- ✅ Security headers configured
- ✅ Rate limiting middleware (100 req/min)
- ✅ Structured logging with production-safe output

### Frontend
- ✅ Image optimization (WebP/AVIF formats)
- ✅ Package import optimization (lucide-react, tabler-icons)
- ✅ Build validation (lint + type-check before build)

## Security Features

### Application Security
- ✅ Strict-Transport-Security header
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection enabled
- ✅ Content-Security-Policy configured
- ✅ Rate limiting on all routes
- ✅ Database query parameterization (SQL injection protection)

### Database Security
- ✅ SSL/TLS encryption required
- ✅ Environment-based credentials
- ✅ Connection pooling limits
- ✅ Query timeout protection

## Troubleshooting

### Application Won't Start
```bash
# Check environment variables
cat .env.production

# Verify database connection
psql $DATABASE_URL

# Check application logs
pm2 logs medrec-app --lines 100
```

### Database Connection Issues
- Verify `DATABASE_URL` includes `?sslmode=require`
- Check database firewall rules
- Verify database user permissions
- Test connection: `psql "$DATABASE_URL"`

### Performance Issues
```bash
# Check database query performance
# Enable PostgreSQL slow query log

# Monitor application metrics
pm2 monit

# Check health endpoint
curl https://your-domain.com/api/health
```

### High Memory Usage
- Review connection pool settings in `db/index.ts`
- Check for memory leaks with `pm2 monit`
- Consider scaling horizontally

## Maintenance

### Regular Updates
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm ci --production=false

# Run migrations
npm run db:migrate:prod

# Rebuild application
npm run build:prod

# Restart with PM2
pm2 restart medrec-app
```

### Database Maintenance
```bash
# Vacuum and analyze
VACUUM ANALYZE;

# Reindex if needed
REINDEX DATABASE your_database;

# Check database size
SELECT pg_size_pretty(pg_database_size('your_database'));
```

## Scaling Considerations

### Horizontal Scaling
- Deploy multiple application instances behind a load balancer
- Use Redis for session storage across instances
- Configure database connection pool per instance

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Adjust database connection pool settings
- Monitor and optimize database queries

### Database Scaling
- Consider read replicas for read-heavy workloads
- Implement caching layer (Redis)
- Partition large tables
- Regular index maintenance

## Support and Resources

- Health Check: `/api/health`
- Application Logs: `pm2 logs medrec-app`
- Database Status: Check health endpoint
- Documentation: See README.md

## Rollback Procedure

If issues arise:

```bash
# Stop current version
pm2 stop medrec-app

# Checkout previous version
git checkout <previous-commit-hash>

# Restore database backup if needed
psql $DATABASE_URL < backup_file.sql

# Rebuild and restart
npm ci --production=false
npm run build:prod
pm2 restart medrec-app
```
