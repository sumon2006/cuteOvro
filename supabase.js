/**
 * @file supabase.js
 * Supabase Client Initialization & Core Dropshipping Data Service
 * 
 * INSTRUCTIONS FOR SETTING UP YOUR SUPABASE KEYS:
 * 1. Create a free account at https://supabase.com
 * 2. Create a new project.
 * 3. Go to Project Settings -> API.
 * 4. Copy 'Project URL' into SUPABASE_URL below.
 * 5. Copy 'anon / public' key into SUPABASE_ANON_KEY below.
 * 6. (Optional) You can also configure them directly in the Admin Dashboard UI via the Settings modal!
 */

(function () {
  'use strict';

  // ==========================================
  // 1. CONFIGURATION CONSTANTS (REPLACE HERE)
  // ==========================================
  const SUPABASE_URL = "https://gnrljwqaasljsfvnnunw.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imducmxqd3FhYXNsanNmdm5udW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjUyNTUsImV4cCI6MjEwNTkwMTI1NX0.BYvDePk8M27JBXC7x1-8m8S0VZpwle6nDuyt0Ei5CRo";

  // Default Store & Payment Info (Can also be customized in Admin)
  const DEFAULT_STORE_CONFIG = {
    storeName: "cuteOVRO - Shop Your Vibe",
    upiId: "cuteovro@okaxis", // Real UPI ID / VPA (GPay, PhonePe, Paytm, BHIM)
    merchantName: "cuteOVRO Store",
    adminPin: "Admin@2026", // Master PIN to access admin and orders dashboard
    supportPhone: "919876543210"
  };

  // ==========================================
  // 2. RETRIEVE ACTIVE CONFIGURATION
  // ==========================================
  function getActiveStoreConfig() {
    try {
      const saved = localStorage.getItem("bharatdrop_store_config");
      if (saved) {
        return { ...DEFAULT_STORE_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Could not read local store config:", e);
    }
    return DEFAULT_STORE_CONFIG;
  }

  function saveStoreConfig(newConfig) {
    const current = getActiveStoreConfig();
    const merged = { ...current, ...newConfig };
    localStorage.setItem("bharatdrop_store_config", JSON.stringify(merged));
    return merged;
  }

  function getSupabaseCredentials() {
    const config = getActiveStoreConfig();
    const customUrl = config.supabaseUrl || localStorage.getItem("supabase_url");
    const customKey = config.supabaseAnonKey || localStorage.getItem("supabase_anon_key");

    const url = customUrl && customUrl.trim() !== "" && !customUrl.includes("YOUR_SUPABASE") 
      ? customUrl.trim() 
      : SUPABASE_URL;

    const key = customKey && customKey.trim() !== "" && !customKey.includes("YOUR_SUPABASE") 
      ? customKey.trim() 
      : SUPABASE_ANON_KEY;

    const isConfigured = !url.includes("YOUR_SUPABASE") && !key.includes("YOUR_SUPABASE");
    return { url, key, isConfigured };
  }

  // ==========================================
  // 3. INITIALIZE SUPABASE CLIENT
  // ==========================================
  let _supabaseClient = null;

  function initSupabaseClient() {
    const { url, key, isConfigured } = getSupabaseCredentials();
    
    if (typeof window !== "undefined" && window.supabase && isConfigured) {
      try {
        if (!_supabaseClient) {
          _supabaseClient = window.supabase.createClient(url, key);
          console.log("✅ Supabase client successfully initialized for:", url);
        }
      } catch (err) {
        console.error("❌ Failed to initialize Supabase client:", err);
        _supabaseClient = null;
      }
    } else {
      _supabaseClient = null;
    }
    return _supabaseClient;
  }

  // Initialize on script evaluation if Supabase CDN is already loaded
  if (typeof window !== "undefined" && window.supabase) {
    initSupabaseClient();
  }

  // ==========================================
  // 4. STARTER MOCK DATA (OFFLINE / ZERO-SETUP FALLBACK)
  // ==========================================
  const DEFAULT_STARTER_PRODUCTS = [
    {
      id: "a0000000-0000-4000-8000-000000000001",
      title: "Anarkali Rayon Printed Kurti Set with Dupatta",
      category: "Kurtis",
      price: 899,
      original_price: 1899,
      description: "Premium Gold Foil printed Anarkali Kurti with matching Pant and soft Chiffon Dupatta. Breathable pure rayon fabric perfect for festive ceremonies, daily comfort, and family events. Pre-washed shrink-resistant weave with intricate neck embroidery.",
      image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      image_gallery: [
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
      ],
      in_stock: true,
      variants: ["S (36)", "M (38)", "L (40)", "XL (42)", "XXL (44)"],
      badge: "Bestseller"
    },
    {
      id: "a0000000-0000-4000-8000-000000000002",
      title: "Kanjivaram Silk Blend Zari Border Saree",
      category: "Sarees",
      price: 1249,
      original_price: 2999,
      description: "Exquisite royal heritage Kanjivaram banarasi silk blend saree featuring rich golden zari weaving border, heavy pallu, and matching unstitched blouse piece. Woven on traditional jacquard looms with brilliant drape and sheen.",
      image_url: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      image_gallery: [
        "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
      ],
      in_stock: true,
      variants: ["Royal Blue", "Crimson Red", "Emerald Green", "Peacock Teal"],
      badge: "Trending"
    },
    {
      id: "a0000000-0000-4000-8000-000000000003",
      title: "Bluetooth Calling AMOLED Smartwatch (IP68)",
      category: "Gadgets",
      price: 1499,
      original_price: 3499,
      description: "Ultra-sleek 1.96-inch curved AMOLED display with always-on screen, AI voice assistant, heart rate & SpO2 tracking, 120+ sport modes, and 7-day battery standby. Zinc alloy casing with metallic finish and magnetic fast charger.",
      image_url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
      image_gallery: [
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"
      ],
      in_stock: true,
      variants: ["Space Black", "Titanium Silver", "Midnight Blue"],
      badge: "Top Tech"
    },
    {
      id: "a0000000-0000-4000-8000-000000000004",
      title: "Crystal Diamond RGB Touch Ambient Table Lamp",
      category: "Home Decor",
      price: 599,
      original_price: 1299,
      description: "Touch control acrylic rose diamond crystal lamp with 16 color lighting modes, USB rechargeable battery, and wireless remote control for bedside, dinner, or cafe vibes. Creates mesmerizing prism reflections on surfaces.",
      image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
      image_gallery: [
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=800&q=80"
      ],
      in_stock: true,
      variants: ["16-Color RGB with Remote", "Warm White Classic"],
      badge: "Viral"
    },
    {
      id: "a0000000-0000-4000-8000-000000000005",
      title: "Men Pure Cotton Slim Fit Chino Trousers",
      category: "Menswear",
      price: 799,
      original_price: 1699,
      description: "Stretchable premium twill cotton chinos designed with flexible waistband, wrinkle-resistant weave, and reinforced stitching for sharp smart-casual wear. Tailored European cut with deep slash pockets.",
      image_url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
      image_gallery: [
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80"
      ],
      in_stock: true,
      variants: ["30 Waist", "32 Waist", "34 Waist", "36 Waist", "38 Waist"],
      badge: "Hot Deal"
    },
    {
      id: "a0000000-0000-4000-8000-000000000006",
      title: "Wireless ANC Earbuds with ENC Quad Mics",
      category: "Gadgets",
      price: 999,
      original_price: 2499,
      description: "Active Noise Cancellation true wireless earbuds with 13mm deep bass titanium drivers, 45ms low-latency gaming mode, and 40 hours total playtime. Type-C super-fast charge gives 5 hours playtime on a 10-minute top-up.",
      image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      image_gallery: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
      ],
      in_stock: true,
      variants: ["Matte Black", "Frost White"],
      badge: "Flash Sale"
    }
  ];

  function getLocalProducts() {
    try {
      const raw = localStorage.getItem("bharatdrop_local_products");
      if (raw) {
        const parsed = JSON.parse(raw);
        // If old string IDs like 'p1-' exist in customer localStorage, migrate to valid UUIDs
        if (Array.isArray(parsed) && parsed.some(p => p.id && p.id.startsWith("p"))) {
          const updated = parsed.map(p => {
            const match = DEFAULT_STARTER_PRODUCTS.find(dp => dp.title === p.title);
            return match ? { ...p, id: match.id } : p;
          });
          saveLocalProducts(updated);
          return updated;
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Failed to load local products:", e);
    }
    localStorage.setItem("bharatdrop_local_products", JSON.stringify(DEFAULT_STARTER_PRODUCTS));
    return DEFAULT_STARTER_PRODUCTS;
  }

  function saveLocalProducts(products) {
    localStorage.setItem("bharatdrop_local_products", JSON.stringify(products));
  }

  function getLocalOrders() {
    try {
      const raw = localStorage.getItem("bharatdrop_local_orders");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Failed to load local orders:", e);
    }
    return [
      {
        id: "ord-demo-01",
        order_code: "BD-72910",
        created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        customer_name: "Rahul Verma",
        customer_phone: "9876543210",
        address_line: "Flat 402, Sai Residency, M.G. Road",
        post_office: "Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038",
        product_id: "a0000000-0000-4000-8000-000000000001",
        product_name: "Anarkali Rayon Printed Kurti Set with Dupatta",
        variant: "L (40)",
        quantity: 1,
        total_amount: 899,
        payment_mode: "UPI",
        utr_number: "428910398492",
        status: "Verified",
        notes: "Customer paid via PhonePe and submitted valid UTR"
      },
      {
        id: "ord-demo-02",
        order_code: "BD-61042",
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        customer_name: "Pooja Sharma",
        customer_phone: "9823145678",
        address_line: "Plot 18, Green Park Extension, Near Temple",
        post_office: "Sector 14",
        city: "Gurugram",
        state: "Haryana",
        pincode: "122001",
        product_id: "a0000000-0000-4000-8000-000000000002",
        product_name: "Kanjivaram Silk Blend Zari Border Saree",
        variant: "Crimson Red",
        quantity: 1,
        total_amount: 1249,
        payment_mode: "COD",
        utr_number: null,
        status: "Pending",
        notes: "Cash on delivery - pending call/WhatsApp verification"
      }
    ];
  }

  function saveLocalOrders(orders) {
    localStorage.setItem("bharatdrop_local_orders", JSON.stringify(orders));
  }

  // ==========================================
  // 5. DATABASE OPERATIONS (SUPABASE OR LOCAL)
  // ==========================================

  async function fetchProducts() {
    const client = initSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from("products").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) return { data, source: "supabase" };
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to local data:", err.message);
      }
    }
    return { data: getLocalProducts(), source: "local" };
  }

  async function fetchProductById(productId) {
    if (!productId) return { data: null, error: "No product ID provided" };
    const client = initSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from("products").select("*").eq("id", productId).single();
        if (!error && data) return { data, source: "supabase" };
      } catch (err) {
        console.warn("Supabase single product fetch failed, checking local data:", err.message);
      }
    }
    const localList = getLocalProducts();
    const match = localList.find(p => p.id === productId || String(p.id) === String(productId));
    return { data: match || null, source: "local" };
  }

  async function createProduct(productData) {
    const client = initSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from("products").insert([productData]).select();
        if (error) throw error;
        return { success: true, data: data[0], source: "supabase" };
      } catch (err) {
        console.warn("Supabase insert failed, saving locally:", err.message);
      }
    }
    const localList = getLocalProducts();
    const newProduct = { id: "prod-" + Date.now(), created_at: new Date().toISOString(), ...productData };
    localList.unshift(newProduct);
    saveLocalProducts(localList);
    return { success: true, data: newProduct, source: "local" };
  }

  async function updateProduct(id, updates) {
    const client = initSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from("products").update(updates).eq("id", id).select();
        if (error) throw error;
        return { success: true, data: data[0], source: "supabase" };
      } catch (err) {
        console.warn("Supabase update failed, updating locally:", err.message);
      }
    }
    const localList = getLocalProducts();
    const idx = localList.findIndex(p => p.id === id);
    if (idx !== -1) {
      localList[idx] = { ...localList[idx], ...updates };
      saveLocalProducts(localList);
      return { success: true, data: localList[idx], source: "local" };
    }
    return { success: false, error: "Product not found" };
  }

  async function deleteProduct(id) {
    const client = initSupabaseClient();
    if (client) {
      try {
        const { error } = await client.from("products").delete().eq("id", id);
        if (error) throw error;
        return { success: true, source: "supabase" };
      } catch (err) {
        console.warn("Supabase delete failed, deleting locally:", err.message);
      }
    }
    const localList = getLocalProducts().filter(p => p.id !== id);
    saveLocalProducts(localList);
    return { success: true, source: "local" };
  }

  async function uploadProductImage(file) {
    const client = initSupabaseClient();
    if (client) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `products/${fileName}`;
        const { data, error } = await client.storage.from("product-images").upload(filePath, file, { cacheControl: "3600", upsert: false });
        if (error) throw error;
        const { data: publicUrlData } = client.storage.from("product-images").getPublicUrl(filePath);
        return { success: true, url: publicUrlData.publicUrl, source: "supabase" };
      } catch (err) {
        console.warn("Supabase storage upload error:", err.message);
      }
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ success: true, url: e.target.result, source: "local_base64" });
      reader.onerror = () => resolve({ success: true, url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", source: "placeholder" });
      reader.readAsDataURL(file);
    });
  }

  async function placeOrder(orderPayload) {
    const orderCode = orderPayload.order_code || ('ORD-' + Math.random().toString().slice(2, 8));
    let authUserId = orderPayload.user_id || null;
    const client = initSupabaseClient();
    if (!authUserId) {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser && currentUser.id) authUserId = currentUser.id;
      } catch (e) {
        console.warn("Could not get current auth user:", e);
      }
    }

    const isValidUuid = typeof orderPayload.product_id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderPayload.product_id);
    const fullOrder = {
      order_code: orderCode,
      created_at: new Date().toISOString(),
      status: orderPayload.payment_mode === "UPI" ? "Verified" : "Pending",
      customer_name: orderPayload.customer_name || "",
      customer_phone: orderPayload.customer_phone || "",
      address_line: orderPayload.address_line || "",
      post_office: orderPayload.post_office || "",
      city: orderPayload.city || "",
      state: orderPayload.state || "",
      pincode: orderPayload.pincode || "",
      product_id: isValidUuid ? orderPayload.product_id : null,
      product_name: orderPayload.product_name || "Trending Item",
      variant: orderPayload.variant || "Standard",
      quantity: Number(orderPayload.quantity) || 1,
      total_amount: Number(orderPayload.total_amount) || 0,
      payment_mode: orderPayload.payment_mode || "UPI",
      utr_number: orderPayload.utr_number || null,
      notes: orderPayload.notes || null,
      user_id: authUserId
    };

    if (client) {
      try {
        console.log("📦 Sending order to Supabase orders table:", fullOrder);
        let insertData = [ { ...fullOrder } ];
        let { data, error } = await client.from("orders").insert(insertData).select();
        
        if (error && (error.code === "42703" || (error.code === "23503" && (error.message && error.message.includes("user_id"))) || (error.message && error.message.includes("user_id")))) {
          console.warn("⚠️ Retrying order insert without user_id column");
          delete insertData[0].user_id;
          const retryUser = await client.from("orders").insert(insertData).select();
          data = retryUser.data;
          error = retryUser.error;
        }

        if (error && (error.code === "22P02" || error.code === "23503" || (error.message && error.message.includes("product_id")))) {
          console.warn("⚠️ Retrying order insert with product_id=null");
          insertData[0].product_id = null;
          const retry = await client.from("orders").insert(insertData).select();
          data = retry.data;
          error = retry.error;
        }

        if (error) throw error;
        
        const savedRecord = data && data[0] ? data[0] : fullOrder;
        const localOrders = getLocalOrders();
        localOrders.unshift(savedRecord);
        saveLocalOrders(localOrders);

        return { success: true, data: savedRecord, orderCode, source: "supabase" };
      } catch (err) {
        console.error("❌ Supabase order insertion failed, saving to local fallback:", err);
      }
    }

    const localOrders = getLocalOrders();
    fullOrder.id = "ord-" + Date.now();
    localOrders.unshift(fullOrder);
    saveLocalOrders(localOrders);
    window.dispatchEvent(new CustomEvent("local-order-placed", { detail: fullOrder }));
    return { success: true, data: fullOrder, orderCode, source: "local" };
  }

  async function fetchOrders() {
    const client = initSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from("orders").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        return { data, source: "supabase" };
      } catch (err) {
        console.error("❌ Supabase fetch orders failed, falling back to local:", err);
      }
    }
    return { data: getLocalOrders(), source: "local" };
  }

  async function trackOrder(orderCode) {
    if (!orderCode) return { success: false, error: "Please enter your Order Code or Phone Number" };
    const query = orderCode.trim();
    const client = initSupabaseClient();
    
    if (client) {
      try {
        const { data, error } = await client.from("orders").select("*").eq("order_code", query).maybeSingle();
        if (data) return { success: true, data, source: "supabase" };
        if (!data && query.length >= 10 && /^\d+$/.test(query)) {
          const phoneRes = await client.from("orders").select("*").eq("customer_phone", query).order("created_at", { ascending: false }).limit(1);
          if (phoneRes.data && phoneRes.data.length > 0) return { success: true, data: phoneRes.data[0], source: "supabase" };
        }
      } catch (err) {
        console.error("❌ trackOrder Supabase lookup failed:", err);
      }
    }

    const local = getLocalOrders();
    const found = local.find(o => (o.order_code && o.order_code.toLowerCase() === query.toLowerCase()) || (o.customer_phone && o.customer_phone === query));
    if (found) return { success: true, data: found, source: "local" };
    return { success: false, error: "Order not found" };
  }

  async function updateOrderStatus(orderId, newStatus) {
    const client = initSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.from("orders").update({ status: newStatus }).eq("id", orderId).select();
        if (error) throw error;
        return { success: true, data: data[0], source: "supabase" };
      } catch (err) {
        console.warn("Supabase order status update failed, updating locally:", err.message);
      }
    }
    const localOrders = getLocalOrders();
    const idx = localOrders.findIndex(o => o.id === orderId || o.order_code === orderId);
    if (idx !== -1) {
      localOrders[idx].status = newStatus;
      saveLocalOrders(localOrders);
      return { success: true, data: localOrders[idx], source: "local" };
    }
    return { success: false, error: "Order not found" };
  }

  function listenToOrders(onInsert, onUpdate) {
    const client = initSupabaseClient();
    let channel = null;
    if (client) {
      try {
        channel = client.channel("realtime-orders")
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => { if (onInsert) onInsert(payload.new); })
          .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, (payload) => { if (onUpdate) onUpdate(payload.new); })
          .subscribe();
      } catch (err) {
        console.warn("Failed to subscribe to Supabase Realtime:", err);
      }
    }
    const storageHandler = (e) => { if (e.key === "bharatdrop_last_order_ping") { const latest = getLocalOrders()[0]; if (latest && onInsert) onInsert(latest); } };
    window.addEventListener("storage", storageHandler);
    const localHandler = (e) => { if (e.detail && onInsert) onInsert(e.detail); };
    window.addEventListener("local-order-placed", localHandler);
    return () => {
      if (client && channel) client.removeChannel(channel);
      window.removeEventListener("storage", storageHandler);
      window.removeEventListener("local-order-placed", localHandler);
    };
  }

  function generateUpiUri(upiId, storeName, amount, orderCode) {
    const cleanId = (upiId || "merchant@upi").trim();
    const cleanName = (storeName || "BharatDrop Store").trim();
    const cleanAmount = Number(amount).toFixed(2);
    const note = `Order ${orderCode || 'Purchase'}`;
    return `upi://pay?pa=${encodeURIComponent(cleanId)}&pn=${encodeURIComponent(cleanName)}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(note)}`;
  }

  function getQrCodeUrl(upiUri, size = 260) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(upiUri)}`;
  }

  function generateWhatsAppOrderLink(customerPhone, order) {
    const cleanPhone = customerPhone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    const text = `*Order Confirmation - ${getActiveStoreConfig().storeName}*\n--------------------------------\nHello *${order.customer_name}*,\n\nThank you for your order! 🎉\n📦 *Order ID:* ${order.order_code}\n🛍️ *Item:* ${order.product_name} (${order.variant || 'Standard'})\n🔢 *Quantity:* ${order.quantity}\n💰 *Total Amount:* ₹${order.total_amount}\n💳 *Payment Mode:* ${order.payment_mode} ${order.payment_mode === 'UPI' ? '✅ Paid (UTR: ' + (order.utr_number || 'Verified') + ')' : '💵 Cash on Delivery'}\n\n📍 *Delivery Address:*\n${order.address_line}, ${order.post_office ? order.post_office + ', ' : ''}${order.city}, ${order.state} - ${order.pincode}\n\nYour parcel is being packed and will be dispatched within 24 hours. We will share your live courier tracking link shortly!`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
  }

  // ==========================================
  // 7. CUSTOMER AUTHENTICATION (STRICTLY EMAIL & PASSWORD)
  // ==========================================

  async function signInWithEmail(email, password) {
    const client = initSupabaseClient();
    if (!client) return { success: false, error: "Supabase client not initialized" };
    try {
      const { data, error } = await client.auth.signInWithPassword({ email: email.trim(), password: password });
      if (error) throw error;
      if (data && data.user) try { localStorage.setItem("bharatdrop_auth_customer", JSON.stringify(data.user)); } catch (e) {}
      return { success: true, session: data.session, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || "Failed to sign in with email" };
    }
  }

  async function signUpWithEmail(email, password, nameOrOptions = {}) {
    const client = initSupabaseClient();
    if (!client) return { success: false, error: "Supabase client not initialized" };
    try {
      let options = {};
      if (typeof nameOrOptions === 'string') options = { data: { full_name: nameOrOptions } };
      else if (typeof nameOrOptions === 'object') options = nameOrOptions;
      
      const { data, error } = await client.auth.signUp({ email: email.trim(), password: password, options: options });
      if (error) throw error;
      if (data && data.user) try { localStorage.setItem("bharatdrop_auth_customer", JSON.stringify(data.user)); } catch (e) {}
      return { success: true, session: data.session, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || "Failed to create account" };
    }
  }

  async function resetPasswordForEmail(email) {
    const client = initSupabaseClient();
    if (!client) return { success: false, error: "Supabase client not initialized" };
    try {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { data, error } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: redirectUrl });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message || "Failed to send password reset link" };
    }
  }

  async function updateUserPassword(newPassword) {
    const client = initSupabaseClient();
    if (!client) return { success: false, error: "Supabase client not initialized" };
    try {
      const { data, error } = await client.auth.updateUser({ password: newPassword });
      if (error) throw error;
      if (data && data.user) try { localStorage.setItem("bharatdrop_auth_customer", JSON.stringify(data.user)); } catch (e) {}
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message || "Failed to update password" };
    }
  }

  async function signInWithEmailOtp(email) {
    const client = initSupabaseClient();
    if (!client) return { success: false, error: "Supabase client not initialized" };
    try {
      const { data, error } = await client.auth.signInWithOtp({ email: email.trim() });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message || "Failed to send login email" };
    }
  }

  async function signOutCustomer() {
    const client = initSupabaseClient();
    if (client) {
      try { await client.auth.signOut(); } catch (err) { console.warn("Sign out error:", err); }
    }
    try { localStorage.removeItem("bharatdrop_auth_customer"); } catch (e) {}
    return { success: true };
  }

  async function getCurrentUser() {
    const client = initSupabaseClient();
    if (client) {
      try {
        const { data: { session } } = await client.auth.getSession();
        if (session && session.user) return session.user;
        const { data: { user } } = await client.auth.getUser();
        if (user) return user;
      } catch (err) {
        console.warn("Supabase getUser error:", err);
      }
    }
    try {
      const localCustomer = localStorage.getItem("bharatdrop_auth_customer");
      if (localCustomer) return JSON.parse(localCustomer);
    } catch (e) {}
    return null;
  }

  // ==========================================
  // 8. NEW FRONTEND UI LOGIC (Modal, Google, Submit)
  // ==========================================
  
  let isSignUpMode = false;

  window.openAuthModal = function() {
      const modal = document.getElementById('auth-modal');
      if(modal) {
          modal.classList.remove('hidden');
          modal.classList.add('flex');
      }
  };

  window.closeAuthModal = function() {
      const modal = document.getElementById('auth-modal');
      if(modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
      }
  };

  window.toggleAuthMode = function() {
      isSignUpMode = !isSignUpMode;
      const nameInput = document.getElementById('auth-name');
      const title = document.getElementById('auth-title');
      const submitBtn = document.getElementById('auth-submit-btn');
      const toggleBtn = document.getElementById('auth-toggle-btn');

      if (isSignUpMode) {
          if(nameInput) {
              nameInput.classList.remove('hidden');
              nameInput.required = true;
          }
          if(title) title.innerText = "Create Account";
          if(submitBtn) submitBtn.innerText = "Sign Up";
          if(toggleBtn) toggleBtn.innerText = "Already have an account? Log In";
      } else {
          if(nameInput) {
              nameInput.classList.add('hidden');
              nameInput.required = false;
          }
          if(title) title.innerText = "Welcome to cuteOVRO";
          if(submitBtn) submitBtn.innerText = "Log In";
          if(toggleBtn) toggleBtn.innerText = "Need an account? Sign Up";
      }
  };

  window.loginWithGoogle = async function() {
      const client = initSupabaseClient();
      if (!client) {
          alert("Supabase is not configured properly!");
          return;
      }
      try {
          const { data, error } = await client.auth.signInWithOAuth({
              provider: 'google',
              options: {
                  redirectTo: window.location.origin
              }
          });
          if (error) throw error;
      } catch (error) {
          alert("Google Login Error: " + error.message);
      }
  };

  // This function is triggered by your HTML form
  window.handleAuthSubmit = async function(event) {
      event.preventDefault(); 
      
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;
      const nameElement = document.getElementById('auth-name');
      const name = nameElement ? nameElement.value : "";
      const submitBtn = document.getElementById('auth-submit-btn');
      
      submitBtn.innerText = "Please wait...";
      submitBtn.disabled = true;

      try {
          if (isSignUpMode) {
              const res = await window.BharatDrop.signUpWithEmail(email, password, name);
              if (!res.success) throw new Error(res.error);
              
              alert("Account created successfully!");
              window.closeAuthModal();
              window.location.reload();
          } else {
              const res = await window.BharatDrop.signInWithEmail(email, password);
              if (!res.success) throw new Error(res.error);
              
              alert("Logged in successfully!");
              window.closeAuthModal();
              window.location.reload();
          }
      } catch (error) {
          alert("Error: " + error.message);
      } finally {
          submitBtn.innerText = isSignUpMode ? "Sign Up" : "Log In";
          submitBtn.disabled = false;
      }
  };

  // Password Recovery Logic (Auto-runs when user clicks reset email link)
  if (typeof window !== "undefined") {
      window.addEventListener('DOMContentLoaded', () => {
          const hash = window.location.hash;
          if (hash && hash.includes("type=recovery")) {
              setTimeout(() => {
                  const newPassword = prompt("Please enter your NEW password (min 6 characters):");
                  if (newPassword && newPassword.length >= 6) {
                      window.BharatDrop.updateUserPassword(newPassword).then(res => {
                          if (res.success) {
                              alert("Password updated successfully! You are now logged in.");
                              window.location.hash = ""; 
                          } else {
                              alert("Failed to update password: " + res.error);
                          }
                      });
                  } else {
                      alert("Password update cancelled. Must be at least 6 characters.");
                  }
              }, 1000);
          }
      });
  }

  // Expose utilities on window for standard HTML script usage
  if (typeof window !== "undefined") {
    window.BharatDrop = {
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      DEFAULT_STORE_CONFIG,
      getActiveStoreConfig,
      saveStoreConfig,
      getSupabaseCredentials,
      initSupabaseClient,
      
      fetchProducts,
      fetchProductById,
      createProduct,
      updateProduct,
      deleteProduct,
      uploadProductImage,
      placeOrder,
      fetchOrders,
      trackOrder,
      updateOrderStatus,
      listenToOrders,

      signInWithEmail,
      signUpWithEmail,
      signInWithEmailOtp,
      resetPasswordForEmail,
      updateUserPassword,
      signOutCustomer,
      getCurrentUser,

      generateUpiUri,
      getQrCodeUrl,
      generateWhatsAppOrderLink
    };
  }

})();