# Cloudflare Deployment Guide for ResourceMan

## Prerequisites
- Cloudflare account (free tier works)
- Node.js 18+ installed locally
- Wrangler CLI (Cloudflare's deployment tool)

## Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

## Step 3: Create D1 Database

```bash
cd backend
wrangler d1 create resourceman-db
```

**Important:** Copy the `database_id` from the output and update it in `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "resourceman-db"
database_id = "YOUR_ACTUAL_DATABASE_ID_HERE"
```

## Step 4: Initialize Database Schema

```bash
wrangler d1 execute resourceman-db --file=schema.sql
```

## Step 5: Deploy the Worker

```bash
wrangler deploy
```

You'll see output like:
```
✨ Success! Deployed to https://resourceman-server.YOUR-SUBDOMAIN.workers.dev
```

**Copy this URL** - you'll need it for the frontend.

## Step 6: Update Frontend

In `index.js`, update the `API_BASE_URL`:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : 'https://resourceman-server.YOUR-SUBDOMAIN.workers.dev';
```

Or for production with your custom domain:
```javascript
const API_BASE_URL = 'https://api.resourceman.top';
```

## Step 7: Test the Deployment

Visit your Worker URL:
```
https://resourceman-server.YOUR-SUBDOMAIN.workers.dev/api/health
```

You should see:
```json
{"status":"ok","message":"ResourceMan Cloudflare Worker is running"}
```

## Step 8: (Optional) Custom Domain

To use your own domain (e.g., `api.resourceman.top`):

1. Go to Cloudflare Dashboard → Workers & Pages
2. Select your worker
3. Go to "Settings" → "Domains & Routes"
4. Add your custom domain
5. Update DNS records as instructed

## Project Structure

```
backend/
├── wrangler.toml          # Cloudflare Worker config
├── worker.js              # Worker code (API routes)
├── schema.sql             # Database schema
├── package.json           # Dependencies
└── CLOUDFLARE_DEPLOY.md   # This file
```

## API Endpoints

All endpoints are the same as before:
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Save customers
- `GET /api/catalog` - Get product catalog
- `POST /api/catalog` - Save catalog
- `GET /api/orders` - Get orders
- `POST /api/orders` - Save order
- `GET /api/staff` - Get staff
- `POST /api/staff` - Add staff
- `GET /api/inquiries` - Get inquiries
- `POST /api/inquiries` - Save inquiry

## Benefits of Cloudflare

✅ **Global Distribution** - Runs in 300+ locations worldwide
✅ **Zero Maintenance** - No server to manage
✅ **Auto-Scaling** - Handles any traffic
✅ **Free Tier** - 100,000 requests/day free
✅ **Fast** - Edge computing for low latency
✅ **Reliable** - 99.99% uptime SLA

## Updating Data

After deployment, any admin changes will:
1. Save to Cloudflare D1 database
2. Be accessible globally
3. Persist across all devices
4. Load instantly from nearest edge location

## Monitoring

View logs and analytics:
```bash
wrangler tail
```

## Cost

- **Free Tier:** 100,000 requests/day
- **Paid Tier:** $5/month for 10 million requests
- **D1 Storage:** 5GB free, then $0.75/GB/month

## Troubleshooting

**Worker not responding?**
```bash
wrangler tail  # Check logs
wrangler deploy  # Redeploy
```

**Database errors?**
```bash
wrangler d1 execute resourceman-db --file=schema.sql  # Re-run schema
```

**CORS errors?**
The worker already has CORS enabled for all origins (`*`).

## Next Steps

1. Deploy the worker using `wrangler deploy`
2. Update frontend `API_BASE_URL` with your worker URL
3. Test admin changes - they will now persist globally!
4. (Optional) Add custom domain in Cloudflare dashboard

Your data is now stored in Cloudflare's global network! 🚀