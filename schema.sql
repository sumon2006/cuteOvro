-- ==============================================================================
-- ZERO-COST DROPSHIPPING E-COMMERCE DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Run this script in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE PRODUCTS TABLE
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    original_price NUMERIC(10,2),
    description TEXT,
    image_url TEXT,
    image_gallery JSONB DEFAULT '[]'::jsonb,
    in_stock BOOLEAN DEFAULT true NOT NULL,
    variants JSONB DEFAULT '["Default"]'::jsonb,
    badge TEXT DEFAULT 'Trending'
);

-- Quick migration for existing products tables:
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS image_gallery JSONB DEFAULT '[]'::jsonb;

-- 3. CREATE ORDERS TABLE
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    address_line TEXT NOT NULL,
    post_office TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    product_id TEXT,
    product_name TEXT NOT NULL,
    variant TEXT DEFAULT 'Standard',
    quantity INTEGER DEFAULT 1 NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_mode TEXT NOT NULL CHECK (payment_mode IN ('COD', 'UPI')),
    utr_number TEXT,
    payment_screenshot_url TEXT,
    status TEXT DEFAULT 'Pending' NOT NULL CHECK (status IN ('Pending', 'Verified', 'Dispatched', 'Delivered', 'Cancelled')),
    notes TEXT
);

-- Quick migration for existing tables:
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4.1 PRODUCTS POLICIES
DROP POLICY IF EXISTS "Allow public select products" ON public.products;
DROP POLICY IF EXISTS "Allow anon insert products" ON public.products;
DROP POLICY IF EXISTS "Allow anon update products" ON public.products;
DROP POLICY IF EXISTS "Allow anon delete products" ON public.products;

CREATE POLICY "Allow public select products"
    ON public.products FOR SELECT
    USING (true);

CREATE POLICY "Allow anon insert products"
    ON public.products FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow anon update products"
    ON public.products FOR UPDATE
    USING (true);

CREATE POLICY "Allow anon delete products"
    ON public.products FOR DELETE
    USING (true);

-- 4.2 ORDERS POLICIES (AUTHENTICATED USERS: INSERT & VIEW OWN ORDERS ONLY)
DROP POLICY IF EXISTS "Allow anon insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public select orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anon update orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anon delete orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to view their own orders" ON public.orders;

-- a) Authenticated users can only INSERT their own orders
CREATE POLICY "Allow authenticated users to insert their own orders"
    ON public.orders FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- b) Authenticated users can only SELECT / VIEW their own orders
CREATE POLICY "Allow authenticated users to view their own orders"
    ON public.orders FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- c) Store management / service role can manage orders
CREATE POLICY "Allow anon update orders"
    ON public.orders FOR UPDATE
    TO public, anon
    USING (true);

CREATE POLICY "Allow anon delete orders"
    ON public.orders FOR DELETE
    TO public, anon
    USING (true);

-- 5. ENABLE REALTIME ON TABLES
-- Supabase Realtime enables immediate instant audio & UI updates on incoming orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
END $$;

-- 6. STORAGE SETUP INSTRUCTIONS (FOR SUPABASE DASHBOARD):
-- Navigate to Storage -> "New Bucket" -> Name: "product-images" -> Check "Public Bucket" -> Save.
-- In Storage Policies for 'product-images':
-- - Allow SELECT for public (anon)
-- - Allow INSERT for public (anon)

-- 7. INSERT STARTER HIGH-DEMAND DROPSHIPPING PRODUCTS
INSERT INTO public.products (title, category, price, original_price, description, image_url, image_gallery, in_stock, variants, badge)
VALUES
(
    'Anarkali Rayon Printed Kurti Set with Dupatta',
    'Kurtis',
    899.00,
    1899.00,
    'Premium Gold Foil printed Anarkali Kurti with matching Pant and soft Chiffon Dupatta. Breathable pure rayon fabric perfect for festive ceremonies, daily comfort, and family events. Pre-washed shrink-resistant weave with intricate neck embroidery.',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    true,
    '["S (36)", "M (38)", "L (40)", "XL (42)", "XXL (44)"]'::jsonb,
    'Bestseller'
),
(
    'Kanjivaram Silk Blend Zari Border Saree',
    'Sarees',
    1249.00,
    2999.00,
    'Exquisite royal heritage Kanjivaram banarasi silk blend saree featuring rich golden zari weaving border, heavy pallu, and matching unstitched blouse piece. Woven on traditional jacquard looms with brilliant drape and sheen.',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    true,
    '["Royal Blue", "Crimson Red", "Emerald Green", "Peacock Teal"]'::jsonb,
    'Trending'
),
(
    'Bluetooth Calling AMOLED Smartwatch (IP68 Waterproof)',
    'Gadgets',
    1499.00,
    3499.00,
    'Ultra-sleek 1.96-inch curved AMOLED display with always-on screen, AI voice assistant, heart rate & SpO2 tracking, 120+ sport modes, and 7-day battery standby. Zinc alloy casing with metallic finish and magnetic fast charger.',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    true,
    '["Space Black", "Titanium Silver", "Midnight Blue"]'::jsonb,
    'Top Tech'
),
(
    'Crystal Diamond RGB Touch Ambient Table Lamp',
    'Home Decor',
    599.00,
    1299.00,
    'Touch control acrylic rose diamond crystal lamp with 16 color lighting modes, USB rechargeable battery, and wireless remote control for bedside, dinner, or cafe vibes. Creates mesmerizing prism reflections on surfaces.',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    true,
    '["16-Color RGB with Remote", "Warm White Classic"]'::jsonb,
    'Viral TikTok'
),
(
    'Men Pure Cotton Slim Fit Chino Trousers',
    'Menswear',
    799.00,
    1699.00,
    'Stretchable premium twill cotton chinos designed with flexible waistband, wrinkle-resistant weave, and reinforced stitching for sharp smart-casual wear. Tailored European cut with deep slash pockets.',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    true,
    '["30 Waist", "32 Waist", "34 Waist", "36 Waist", "38 Waist"]'::jsonb,
    'Hot Deal'
),
(
    'Wireless ANC Earbuds with ENC Quad Mics',
    'Gadgets',
    999.00,
    2499.00,
    'Active Noise Cancellation true wireless earbuds with 13mm deep bass titanium drivers, 45ms low-latency gaming mode, and 40 hours total playtime. Type-C super-fast charge gives 5 hours playtime on a 10-minute top-up.',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    '["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"]'::jsonb,
    true,
    '["Matte Black", "Frost White"]'::jsonb,
    'Flash Sale'
);
