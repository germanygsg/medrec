# Server Specifications - Revised for Actual Usage

## Your Actual Usage Data
**22,764 invoices over 10 years (2015-2025)**

### Usage Analysis
- **Average invoices per year:** 2,276
- **Average invoices per month:** 190
- **Average invoices per day:** 6-7
- **Active patients per year:** ~750-800
- **Total unique patients (10 years):** ~11,000-12,000
- **Clinic size:** Medium to Large
- **Estimated staff:** 8-15 concurrent users

### Storage Requirements

#### Current Data (10 years):
- **Patients:** ~22 MB (11,000 records × 2 KB)
- **Appointments:** ~22 MB (22,764 records × 1 KB)
- **Invoices:** ~11 MB (22,764 records × 0.5 KB)
- **Treatments:** ~45 MB (22,764 × 2 treatments × 1 KB)

**Total raw data:** ~100 MB
**With indexes & overhead (3×):** ~300 MB

#### 5-Year Projection (2030):
- **Total invoices:** ~40,000
- **Total database size:** ~600 MB (with indexes)
- **Storage growth:** ~60 MB/year

### Concurrency Requirements
- **Peak concurrent users:** 15-25
- **Database connections needed:** 20-30
- **Peak API requests/hour:** ~20-30
- **Average requests/day:** ~120-150

---

## RECOMMENDED SERVER SPECIFICATIONS

### **OPTION 1: VPS (Best Control & Value)** ⭐

#### Single Server Setup
**Recommended for your usage:**
- **CPU:** 4 vCPUs
- **RAM:** 4 GB
- **Storage:** 50 GB SSD
- **Bandwidth:** 4 TB/month

**Why this configuration:**
- ✅ 4 vCPU handles 15-25 concurrent users comfortably
- ✅ 4 GB RAM supports 30+ database connections
- ✅ 50 GB storage = 80x current needs (10+ years runway)
- ✅ Room for growth and file attachments in future

**Provider Options:**
| Provider | Plan | Price/Month | Specs |
|----------|------|-------------|-------|
| **Hetzner** | CPX21 | **$8** | 3 vCPU, 4 GB RAM, 80 GB SSD |
| **Vultr** | Regular Performance | $18 | 4 vCPU, 4 GB RAM, 80 GB SSD |
| **DigitalOcean** | Basic | $24 | 2 vCPU, 4 GB RAM, 80 GB SSD |
| **Linode** | Shared 4GB | $24 | 2 vCPU, 4 GB RAM, 80 GB SSD |

**Recommended:** **Hetzner CPX21 @ $8/month**

---

### **OPTION 2: Separate App + Managed Database** 🎯

#### Application Server:
- **Hetzner CPX21:** $8/month (3 vCPU, 4 GB RAM)
- **Or DigitalOcean Basic:** $18/month (2 vCPU, 4 GB RAM)

#### Managed PostgreSQL:
- **DigitalOcean Managed DB (Basic):** $15/month
  - 1 vCPU, 1 GB RAM, 10 GB storage
- **AWS RDS db.t4g.small:** ~$25/month
  - 2 vCPU, 2 GB RAM, 20 GB storage
- **Neon Scale Plan:** $69/month
  - Autoscaling, 10 GB storage

**Total Cost:** $23-77/month

**Benefits:**
- ✅ Automated database backups
- ✅ Point-in-time recovery
- ✅ Automatic security patches
- ✅ Better security isolation
- ✅ Easier scaling

**Recommended:** **Hetzner CPX21 ($8) + DigitalOcean Managed DB ($15) = $23/month**

---

### **OPTION 3: PaaS (Easiest Management)**

#### Vercel + Managed Database

**Vercel:**
- **Pro Plan:** $20/month
  - Unlimited bandwidth
  - Auto-scaling
  - Edge network
  - Zero config SSL

**Database (Choose one):**

1. **Neon (Recommended)**
   - **Scale Plan:** $69/month
     - 10 GB storage (30× your needs)
     - Autoscaling
     - Daily backups
     - 99.95% uptime SLA

2. **Supabase**
   - **Pro Plan:** $25/month
     - 8 GB storage
     - Daily backups
     - 99.9% uptime

3. **PlanetScale**
   - **Scaler Plan:** $39/month
     - 10 GB storage
     - Automated backups
     - Branch & merge workflows

**Total Cost:** $45-89/month

**Benefits:**
- ✅ Zero server management
- ✅ Git-based deployments
- ✅ Automatic SSL & CDN
- ✅ Built-in monitoring
- ✅ Focus 100% on your clinic

**Recommended:** **Vercel Pro ($20) + Supabase Pro ($25) = $45/month**

---

## DATABASE CONFIGURATION UPDATES NEEDED

### Current Configuration (db/index.ts):
```typescript
max: process.env.NODE_ENV === 'production' ? 10 : 5
```

### **Recommended Update for Your Scale:**
```typescript
max: process.env.NODE_ENV === 'production' ? 25 : 5
```

**Why:**
- 15 staff × 2 connections each = 30 connections needed at peak
- Current limit of 10 is **too low** for your usage
- Recommended: 25-30 max connections

### PostgreSQL Server Settings:
```
max_connections = 100
shared_buffers = 1GB (if 4GB RAM)
effective_cache_size = 3GB
maintenance_work_mem = 256MB
work_mem = 10MB
```

---

## MY RECOMMENDATION FOR YOUR CLINIC

### **Best Value: VPS with Managed Database**

**Configuration:**
- **Hetzner CPX21:** $8/month (app server)
- **DigitalOcean Managed PostgreSQL:** $15/month (database)

**Total: $23/month**

**Why this is perfect for you:**
1. ✅ Handles 8-15 concurrent users easily
2. ✅ 600 MB database fits comfortably in 10 GB
3. ✅ Automated backups (critical for medical data)
4. ✅ 10+ years of storage runway
5. ✅ Easy to scale when needed
6. ✅ Low cost for medium-sized clinic
7. ✅ Managed DB = peace of mind

---

## SCALING PATH

### Current (2025): 2,276 invoices/year
**Setup:** Hetzner CPX21 + DO Managed DB
**Cost:** $23/month
**Capacity:** Up to 5,000 invoices/year

### Growth (2027): 3,000 invoices/year
**Setup:** Same
**Cost:** $23/month
**Action:** None needed

### Large Growth (2030): 5,000+ invoices/year
**Setup:** Upgrade to CPX31 (4 vCPU, 8 GB)
**Cost:** $35/month total
**Or:** Add read replica to database

---

## IMMEDIATE ACTION REQUIRED

### Update Database Configuration:

**File:** `db/index.ts`

Change line 22 from:
```typescript
max: process.env.NODE_ENV === 'production' ? 10 : 5,
```

To:
```typescript
max: process.env.NODE_ENV === 'production' ? 25 : 5,
```

This ensures you won't hit connection limits with 15 concurrent users.

---

## COMPARISON TABLE

| Option | Monthly Cost | Management | Best For |
|--------|-------------|------------|----------|
| Hetzner VPS (Single) | $8 | Manual backups | Tech-savvy, budget |
| VPS + Managed DB | $23 | Automated | **Recommended** |
| Vercel + Supabase | $45 | Zero touch | Busy clinic, no IT |
| VPS + AWS RDS | $33 | Semi-managed | Enterprise needs |

---

## CONCLUSION

For **22,764 invoices** over 10 years with **8-15 staff members**:

**Production-Ready Setup:**
- ✅ Hetzner CPX21: $8/month
- ✅ DigitalOcean Managed PostgreSQL: $15/month
- ✅ **Total: $23/month**

This gives you:
- Professional-grade infrastructure
- Automated backups
- 10+ years storage capacity
- Room to double your patient load
- Peace of mind for medical data

**Next Steps:**
1. Update `db/index.ts` connection pool to 25
2. Sign up for Hetzner + DigitalOcean
3. Deploy using the `PRODUCTION_DEPLOYMENT.md` guide
4. Set up automated daily backups
5. Monitor with PM2
