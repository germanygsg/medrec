# On-Premise Server Specifications for Ubuntu

## Your Usage Requirements
- **22,764 invoices over 10 years** (2,276/year average)
- **8-15 concurrent staff members**
- **~750 active patients per year**
- **Database size:** ~100 MB current, ~600 MB in 5 years
- **Medium to large clinic operations**

---

## RECOMMENDED ON-PREMISE SERVER BUILD

### **Option 1: Mid-Range Server (RECOMMENDED)** ⭐

#### Hardware Specifications:
- **CPU:** Intel Core i5-12400 (6 cores, 12 threads) or AMD Ryzen 5 5600 (6 cores, 12 threads)
- **RAM:** 16 GB DDR4 (2x 8GB)
- **Storage:**
  - **Primary:** 256 GB NVMe SSD (OS + Application)
  - **Database:** 512 GB SATA SSD (PostgreSQL data)
  - **Backup:** 1 TB HDD (Automated backups)
- **Network:** 1 Gbps Ethernet
- **PSU:** 450W 80+ Bronze
- **UPS:** 1500VA/900W (3-4 hours backup)
- **Case:** Standard tower with good airflow

#### Estimated Cost:
| Component | Model | Price (USD) |
|-----------|-------|-------------|
| CPU | Intel Core i5-12400 | $180 |
| Motherboard | B660 chipset | $120 |
| RAM | 16 GB DDR4 (2×8GB) | $50 |
| SSD (OS) | 256 GB NVMe | $30 |
| SSD (DB) | 512 GB SATA SSD | $45 |
| HDD (Backup) | 1 TB HDD | $40 |
| Case | Mid-tower | $60 |
| PSU | 450W 80+ Bronze | $50 |
| UPS | 1500VA/900W | $150 |
| **TOTAL** | | **~$725** |

#### Why This Configuration:
- ✅ Handles 15-25 concurrent users easily
- ✅ Separate SSD for database = faster queries
- ✅ Built-in backup drive for daily automated backups
- ✅ UPS protects against power outages (critical for medical data)
- ✅ 10+ years of capacity
- ✅ Low power consumption (~65W CPU)
- ✅ Quiet operation for clinic environment

---

### **Option 2: Budget Server (Minimum Viable)**

#### Hardware Specifications:
- **CPU:** Intel Core i3-12100 (4 cores, 8 threads) or AMD Ryzen 3 4100
- **RAM:** 8 GB DDR4 (1x 8GB, expandable to 16GB)
- **Storage:**
  - **Primary:** 512 GB SATA SSD (OS + Application + Database)
  - **Backup:** External 1 TB USB HDD
- **Network:** 1 Gbps Ethernet
- **PSU:** 350W 80+ Bronze
- **UPS:** 1000VA/600W
- **Case:** Compact tower

#### Estimated Cost: **~$450**

#### Limitations:
- ⚠️ May struggle with 15+ concurrent users
- ⚠️ Single SSD (no performance separation)
- ⚠️ 8 GB RAM may need upgrade in 2-3 years
- ⚠️ Good for up to 10 concurrent users

---

### **Option 3: Enterprise/Future-Proof Server**

#### Hardware Specifications:
- **CPU:** Intel Core i7-13700 (16 cores, 24 threads) or AMD Ryzen 7 5800X
- **RAM:** 32 GB DDR4 (2x 16GB)
- **Storage:**
  - **Primary:** 512 GB NVMe SSD (OS)
  - **Database:** 1 TB NVMe SSD (PostgreSQL)
  - **Backup:** 2 TB HDD (Automated backups)
  - **RAID:** Optional RAID 1 for database redundancy
- **Network:** 1 Gbps Ethernet (with 10 Gbps expansion)
- **PSU:** 650W 80+ Gold (modular)
- **UPS:** 2200VA/1500W (6+ hours backup)
- **Case:** Server-grade tower with hot-swap bays

#### Estimated Cost: **~$1,200-1,500**

#### Benefits:
- ✅ Handles 50+ concurrent users
- ✅ RAID redundancy (data protection)
- ✅ 10+ years future-proof
- ✅ Room for expansion (file storage, imaging systems)
- ✅ ECC RAM option (error correction)

---

## DETAILED COMPONENT RECOMMENDATIONS

### CPU (Processor)
**Recommended: Intel Core i5-12400 or AMD Ryzen 5 5600**

**Why:**
- 6 cores handle 15 concurrent users comfortably
- Low power consumption (65W TDP)
- Excellent single-thread performance (fast web responses)
- Built-in graphics (no GPU needed)
- 5+ year longevity

**Alternative Options:**
- **Budget:** Intel i3-12100 ($110) - 4 cores, good for 10 users
- **Upgrade:** Intel i7-12700 ($280) - 12 cores, handles 30+ users

---

### RAM (Memory)
**Recommended: 16 GB DDR4 (2x 8GB)**

**Configuration:**
- Use 2 sticks for dual-channel (faster performance)
- Leave 2 slots empty for future expansion
- Speed: 3200 MHz minimum

**Memory Allocation:**
- Ubuntu OS: 2 GB
- Next.js application: 4-6 GB
- PostgreSQL: 4-6 GB
- Buffer/Cache: 4-6 GB

**When to Upgrade:**
- 8 GB: If only 5-10 concurrent users
- 32 GB: If adding file storage or future expansion

---

### Storage (Drives)

#### **OS Drive (256 GB NVMe SSD):**
- **Purpose:** Ubuntu OS, Next.js application, Node.js
- **Speed:** 3000+ MB/s read
- **Recommended:** Samsung 980, WD Blue SN570, Kingston NV2
- **Why NVMe:** 5x faster than SATA, better app responsiveness

#### **Database Drive (512 GB SATA SSD):**
- **Purpose:** PostgreSQL data only
- **Speed:** 500+ MB/s
- **Recommended:** Samsung 870 EVO, Crucial MX500
- **Why Separate:** I/O isolation, easier backups, better performance

**Storage Breakdown:**
```
OS Drive (256 GB NVMe):
- Ubuntu: ~20 GB
- Next.js app: ~5 GB
- Node.js & dependencies: ~10 GB
- System files & logs: ~20 GB
- Free space: ~200 GB

Database Drive (512 GB SSD):
- PostgreSQL: ~100 MB (current)
- Indexes & overhead: ~200 MB
- Growth room: ~511 GB
- Can store 500× current data
```

#### **Backup Drive (1 TB HDD):**
- **Purpose:** Daily automated backups
- **Speed:** 7200 RPM
- **Recommended:** WD Blue, Seagate BarraCuda
- **Retention:** Keep 30 days of daily backups

---

### Network
**Required: 1 Gbps Ethernet**

**Setup:**
- Connect to clinic router/switch via Cat6 cable
- Assign static IP (e.g., 192.168.1.10)
- Configure firewall to only allow clinic network

**For Remote Access:**
- Use VPN (WireGuard or OpenVPN)
- Or use Cloudflare Tunnel (free, secure)
- Never expose directly to internet

---

### UPS (Uninterruptible Power Supply)
**Critical for medical data protection**

**Recommended: CyberPower CP1500PFCLCD or APC BR1500MS**
- **Capacity:** 1500VA / 900W
- **Runtime:** 10-15 minutes (enough for graceful shutdown)
- **Features:**
  - Automatic voltage regulation
  - USB monitoring (connect to server)
  - LCD display
  - Surge protection

**Why UPS is Critical:**
- Prevents data corruption during power outages
- Protects against power surges
- Allows graceful PostgreSQL shutdown
- Prevents invoice/appointment data loss

**Setup:**
```bash
# Install UPS monitoring software
sudo apt install nut

# Configure automatic shutdown when battery low
# UPS will keep server running 10-15 minutes
# Enough time to save all data and shutdown safely
```

---

### Motherboard
**Recommended: B660 chipset (Intel) or B550 (AMD)**

**Required Features:**
- ✅ 4 RAM slots (expandability)
- ✅ 2+ M.2 NVMe slots
- ✅ 4+ SATA ports
- ✅ Intel or Realtek Gigabit Ethernet
- ✅ Multiple fan headers (cooling)

**Recommended Models:**
- MSI PRO B660M-A ($120)
- ASUS Prime B660M-A ($115)
- Gigabyte B660M DS3H ($110)

---

### Power Supply (PSU)
**Recommended: 450W 80+ Bronze (minimum)**

**Why 450W:**
- i5-12400: 65W
- Motherboard: 50W
- RAM: 10W
- 2x SSD: 10W
- 1x HDD: 10W
- Fans: 15W
- **Total:** ~160W
- **With 50% overhead:** 450W is perfect

**Recommended Brands:**
- Corsair CV450 ($50)
- EVGA 450 BR ($45)
- Thermaltake Smart 450W ($50)

**Avoid:**
- Generic no-name PSUs
- Less than 80+ Bronze rating

---

## UBUNTU SETUP RECOMMENDATIONS

### **Operating System:**
**Ubuntu Server 22.04 LTS**

**Why Server Edition:**
- ✅ No GUI = more resources for applications
- ✅ More secure (smaller attack surface)
- ✅ Long-term support until 2027
- ✅ Easier remote management
- ✅ Lower RAM usage (~500 MB vs 2 GB)

**Alternative:** Ubuntu 22.04 Desktop
- Use if you need GUI access on the server
- Good for troubleshooting
- Uses ~2 GB RAM

---

### **Software Stack:**

```bash
# System
Ubuntu Server 22.04 LTS

# Runtime
Node.js 20 LTS
npm 10+

# Database
PostgreSQL 16 (latest stable)

# Process Manager
PM2 (for running Next.js)

# Reverse Proxy
Nginx (for SSL and static files)

# Monitoring
- htop (resource monitoring)
- iotop (disk monitoring)
- nethogs (network monitoring)

# Backup
- pg_dump (database backups)
- rsync (file backups)
- cron (automated scheduling)

# Security
- ufw (firewall)
- fail2ban (intrusion prevention)
- unattended-upgrades (auto security updates)
```

---

## NETWORK SETUP

### **Static IP Configuration:**
```yaml
# /etc/netplan/01-netcfg.yaml
network:
  version: 2
  ethernets:
    enp1s0:
      dhcp4: no
      addresses:
        - 192.168.1.10/24
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
```

### **Client Devices Connection:**
- All clinic computers connect via `http://192.168.1.10:3000`
- Or setup local domain: `http://clinic.local`
- Configure router DNS for friendly name

---

## BACKUP STRATEGY

### **Automated Daily Backups:**

```bash
# /usr/local/bin/backup-medrec.sh

#!/bin/bash
BACKUP_DIR="/mnt/backup/medrec"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
pg_dump -U postgres medrec > $BACKUP_DIR/db_backup_$DATE.sql

# Keep last 30 days only
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +30 -delete

# Upload to cloud (optional)
# rclone sync $BACKUP_DIR remote:medrec-backups
```

**Cron Schedule:**
```bash
# Run backup daily at 2 AM
0 2 * * * /usr/local/bin/backup-medrec.sh
```

---

## COOLING & ENVIRONMENT

### **Temperature Management:**
- **Ideal room temp:** 18-24°C (64-75°F)
- **Max room temp:** 27°C (80°F)
- **Humidity:** 40-60%

### **Case Fans:**
- 2× 120mm intake fans (front)
- 1× 120mm exhaust fan (rear)
- Keep dust filters clean (monthly)

### **Placement:**
- Well-ventilated area
- Off the floor (avoid dust)
- Away from direct sunlight
- Not in cramped cabinet

---

## ESTIMATED POWER & RUNNING COSTS

### **Power Consumption:**
- **Idle:** ~60W
- **Average load:** ~100W
- **Peak load:** ~150W

### **Monthly Electricity Cost:**
```
Average usage: 100W × 24 hours × 30 days = 72 kWh/month

At $0.12/kWh: $8.64/month
At $0.15/kWh: $10.80/month
At $0.20/kWh: $14.40/month
```

**Annual cost:** ~$100-170/year in electricity

---

## SECURITY RECOMMENDATIONS

### **Physical Security:**
- ✅ Lock server in dedicated room or cabinet
- ✅ Access control (only authorized staff)
- ✅ Security cameras recommended
- ✅ Temperature/humidity monitoring

### **Network Security:**
```bash
# Firewall setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow from 192.168.1.0/24 to any port 3000
sudo ufw enable

# Disable SSH password auth (use keys only)
# Automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## MAINTENANCE SCHEDULE

### **Daily (Automated):**
- ✅ Database backups (2 AM)
- ✅ Log rotation
- ✅ Health checks

### **Weekly:**
- ✅ Review backup logs
- ✅ Check disk space
- ✅ Review error logs

### **Monthly:**
- ✅ Clean dust filters
- ✅ Check UPS battery status
- ✅ Review system updates
- ✅ Test backup restoration

### **Quarterly:**
- ✅ Full system updates
- ✅ Hardware inspection
- ✅ Performance review
- ✅ Security audit

---

## ASSEMBLY & SETUP CHECKLIST

### **Hardware Assembly:**
- [ ] Install CPU with thermal paste
- [ ] Install RAM in correct slots (A2 & B2 for dual-channel)
- [ ] Install NVMe SSD in M.2 slot 1
- [ ] Connect SATA SSD and HDD
- [ ] Install PSU and cable management
- [ ] Connect case fans to motherboard
- [ ] Connect UPS via USB

### **Software Installation:**
- [ ] Install Ubuntu Server 22.04 LTS
- [ ] Configure static IP
- [ ] Setup firewall (ufw)
- [ ] Install Node.js 20 LTS
- [ ] Install PostgreSQL 16
- [ ] Install PM2
- [ ] Install Nginx
- [ ] Setup automated backups
- [ ] Configure UPS monitoring

### **Application Deployment:**
- [ ] Clone git repository
- [ ] Install dependencies (`npm ci`)
- [ ] Configure `.env.production`
- [ ] Run database migrations
- [ ] Build application (`npm run build:prod`)
- [ ] Start with PM2
- [ ] Configure Nginx reverse proxy
- [ ] Test from client computers

---

## RECOMMENDED BUILD: PARTS LIST

### **Complete Shopping List (Mid-Range Server)**

| Item | Model | Qty | Price | Link |
|------|-------|-----|-------|------|
| CPU | Intel Core i5-12400 | 1 | $180 | Amazon/Newegg |
| Motherboard | MSI PRO B660M-A | 1 | $120 | Amazon/Newegg |
| RAM | Corsair Vengeance 16GB (2×8GB) DDR4-3200 | 1 | $50 | Amazon/Newegg |
| NVMe SSD | Samsung 980 256GB | 1 | $30 | Amazon/Newegg |
| SATA SSD | Samsung 870 EVO 500GB | 1 | $45 | Amazon/Newegg |
| HDD | WD Blue 1TB 7200RPM | 1 | $40 | Amazon/Newegg |
| Case | Fractal Design Focus G | 1 | $60 | Amazon/Newegg |
| PSU | Corsair CV450 450W 80+ Bronze | 1 | $50 | Amazon/Newegg |
| UPS | CyberPower CP1500PFCLCD 1500VA | 1 | $150 | Amazon |
| **TOTAL** | | | **$725** | |

**Optional:**
- Cat6 Ethernet cable: $10
- Extra case fans: $20
- Thermal paste (if not included): $10

---

## PERFORMANCE EXPECTATIONS

### **With Recommended Build (i5-12400, 16GB):**
- ✅ Supports 15-20 concurrent users comfortably
- ✅ Page load time: <500ms (local network)
- ✅ Database queries: <50ms
- ✅ Invoice generation: <1 second
- ✅ Report generation: <2 seconds
- ✅ Can handle 5,000+ invoices/year
- ✅ 10+ years of capacity

---

## COMPARISON: On-Premise vs Cloud

| Factor | On-Premise Server | Cloud (Hetzner+DO) |
|--------|-------------------|---------------------|
| **Initial Cost** | $725 | $0 |
| **Monthly Cost** | $10-15 (electricity) | $23 |
| **3-Year Total** | $725 + $360 = **$1,085** | $828 |
| **5-Year Total** | $725 + $600 = **$1,325** | $1,380 |
| **Data Control** | ✅ Full control | ❌ Third-party |
| **Internet Required** | ❌ No | ✅ Yes |
| **Maintenance** | You manage | Managed |
| **Backups** | Manual setup | Automatic |
| **Scalability** | Hardware upgrade | Click to scale |

**On-Premise is Better If:**
- ✅ You want full data control
- ✅ Internet connection is unreliable
- ✅ You have IT staff
- ✅ Long-term cost savings matter
- ✅ Medical data regulations require it

**Cloud is Better If:**
- ✅ You want zero maintenance
- ✅ Reliable internet available
- ✅ You want automatic backups
- ✅ You prefer monthly payments
- ✅ You need easy scalability

---

## MY RECOMMENDATION

### **For Your Clinic (22,764 invoices, 8-15 staff):**

**Build the Mid-Range Server ($725)**

**Why:**
1. ✅ One-time cost = 2.5 years of cloud
2. ✅ Full control of medical data
3. ✅ No internet dependency
4. ✅ Faster (local network = <500ms response)
5. ✅ 10+ year lifespan
6. ✅ Can expand storage easily
7. ✅ Lower long-term cost

**Immediate ROI:**
- Break-even point: 32 months vs cloud
- 5-year savings: ~$55
- 10-year savings: ~$2,000+

**Next Steps:**
1. Purchase components from parts list
2. Assemble server (or hire local PC shop for $50-100)
3. Install Ubuntu Server 22.04 LTS
4. Follow `PRODUCTION_DEPLOYMENT.md` guide
5. Setup automated backups
6. Train staff on new system

Your clinic's scale justifies an on-premise server! 🚀
