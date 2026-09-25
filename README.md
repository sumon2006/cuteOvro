# 🛡️ BharatDrop - Zero-Cost Dropshipping System (Completely Separated Architecture)

Production-ready, zero-gateway-fee dropshipping e-commerce system where the **Public Storefront** and **Admin Console** are **completely separated** by file architecture and URL security.

---

## 🔒 SECURITY ARCHITECTURE: ZERO ADMIN TRACES ON USER SITE

1. **100% Public Storefront (`index.html`)**:
   - Strictly customer-facing with **zero** buttons, links, banners, or hints leading to any admin portal.
   - Allows public shoppers to browse trending Indian ethnic wear (Kurtis, Sarees, Gadgets, etc.), search, and order.
   - Complete checkout with Customer Name, 10-digit Phone, Delivery Address, Pincode, and Payment mode.
   - Dynamic UPI QR Code generator (`upi://pay?pa=...`) + "Pay on UPI App" button + 12-digit UTR verification.
   - Cash on Delivery (COD) radio option.
   - Celebratory order confirmation popup with tracking code and WhatsApp live updates.

2. **Isolated Owner Portal (`owner-portal-access.html`)**:
   - Dedicated unlinked secret URL accessible only by direct typing or bookmarking (`/owner-portal-access.html`).
   - **Session & Route Guard**: Checks `sessionStorage.getItem('bharatdrop_owner_session')`.
     - **Unauthenticated**: Renders a centered dark master security login screen. Direct visits cannot access any dashboard controls. Default master password: `Admin@2026` or `1234` (configurable).
     - **Authenticated**: Renders the complete integrated console:
       - **Live Orders Stream** (Supabase Realtime): Instant audio chime, order stats, data table with customer name, phone, full address, product details, payment type (UPI UTR / COD), status updater (`Pending`, `Verified`, `Dispatched`, `Delivered`), "Open in WhatsApp" quick action button for COD address verification, and CSV export.
       - **Product Catalog Management**: Image file upload directly to Supabase Storage bucket `product-images`, pricing, variants, in-stock toggle, Gemini AI Copywriter & Margin Analyzer, and delete actions.
       - **Store & UPI Configuration**: Configure UPI VPA, Merchant Name, Store Name, and Supabase credentials.
     - **Logout Button**: Completely purges the session token and redirects immediately to `index.html`.

3. **Predictable Path Defense**:
   - `/admin.html` and `/orders.html` are configured with immediate auto-redirects back to `/` (`index.html`).

---

## 📁 File Structure

```text
├── index.html                  # 100% Public Customer Storefront (Zero admin traces)
├── owner-portal-access.html    # Isolated Owner Dashboard with Session & Route Guard
├── supabase.js                 # Shared Supabase DB client, storage uploader & UPI helper
├── schema.sql                  # PostgreSQL tables, RLS policies & starter catalog
├── server.ts                   # Express server & Gemini 3.1 Pro (High Thinking) API
├── admin.html                  # Redirect stub to index.html (safety guard)
├── orders.html                 # Redirect stub to index.html (safety guard)
└── vite.config.ts              # Multi-page build configuration
```

---

## ⚡ Setup & Credentials Configuration

### 1. Database Setup in Supabase
1. Create a free account at **[supabase.com](https://supabase.com)** and create a new project.
2. In the Supabase Dashboard, go to **SQL Editor** -> **New Query**.
3. Paste the contents of `schema.sql` (or click **SQL Schema** in the owner portal) and click **Run**.
4. Go to **Storage** -> Click **New Bucket**:
   - Bucket name: `product-images`
   - Toggle **Public bucket** ON.
   - Click **Save**.

### 2. Configure Your UPI ID & Supabase Keys
You can configure credentials in two ways:

#### Option A: In the Secret Owner Portal UI (No code needed)
1. Go to `http://localhost:3000/owner-portal-access.html` in your browser.
2. Enter the master password: `Admin@2026` (or `1234`).
3. Click the ⚙️ **Settings** button in the top right.
4. Enter your **UPI ID / VPA** (e.g., `yourshop@okaxis` or `9876543210@paytm`), **Merchant Name**, **Supabase URL**, and **Anon Key**.
5. Click **Save Settings & Reconnect**.

#### Option B: In Code (`supabase.js`)
Edit lines 20–30 of `supabase.js`:
```javascript
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_PUBLIC_KEY";

const DEFAULT_STORE_CONFIG = {
  storeName: "BharatDrop MegaStore",
  upiId: "yourname@okaxis",     // <-- Your real UPI ID
  merchantName: "Your Enterprise",
  adminPin: "Admin@2026",       // <-- Master Owner Portal Password
  supportPhone: "919876543210"
};
```

---

## 🛡️ Row Level Security (RLS) Policies

In `schema.sql`, Row Level Security enforces the principle of least privilege:
- **`products` Table**:
  - `SELECT`: Allowed for public anon shoppers to browse items.
  - `INSERT / UPDATE / DELETE`: Restricted to the store owner.
- **`orders` Table**:
  - `INSERT`: Allowed for public shoppers during checkout.
  - `SELECT`: Allowed for public order confirmation and real-time owner order processing.
  - `UPDATE`: Allowed for the owner to update order lifecycle statuses (`Pending`, `Verified`, `Dispatched`, `Delivered`).
