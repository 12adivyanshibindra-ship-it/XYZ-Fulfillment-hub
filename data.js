// data.js - Seed data and storage manager for XYZ Fulfillment Hub

// High-fidelity SVG product graphics (Offline safe, visually clear for warehouse workers)
const PRODUCT_SVGS = {
  headphones: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="16" fill="%23EEF2F6"/><path d="M30 65C30 45.67 43.43 30 60 30C76.57 30 90 45.67 90 65" stroke="%231E293B" stroke-width="8" stroke-linecap="round"/><rect x="22" y="60" width="18" height="32" rx="9" fill="%232563EB"/><rect x="80" y="60" width="18" height="32" rx="9" fill="%232563EB"/><circle cx="31" cy="76" r="4" fill="%2393C5FD"/><circle cx="89" cy="76" r="4" fill="%2393C5FD"/><rect x="42" y="31" width="36" height="8" rx="4" fill="%2364748B"/></svg>`,
  gloves: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="16" fill="%23FEF3C7"/><path d="M35 75V52C35 48.69 37.69 46 41 46C44.31 46 47 48.69 47 52V40C47 36.69 49.69 34 53 34C56.31 34 59 36.69 59 40V36C59 32.69 61.69 30 65 30C68.31 30 71 32.69 71 36V45C71 42.79 72.79 41 75 41C77.21 41 79 42.79 79 45V68C79 82 70 92 56 92H50C38 92 35 84 35 75Z" fill="%23D97706"/><rect x="36" y="85" width="46" height="10" rx="4" fill="%23B45309"/><path d="M47 54V68M59 50V68M71 52V68" stroke="%23B45309" stroke-width="2" stroke-linecap="round"/></svg>`,
  waterbottle: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="16" fill="%23ECFDF5"/><rect x="44" y="24" width="32" height="12" rx="4" fill="%23059669"/><rect x="52" y="16" width="16" height="10" rx="3" fill="%2310B981"/><path d="M40 40C40 37.79 41.79 36 44 36H76C78.21 36 80 37.79 80 40V96C80 100.42 76.42 104 72 104H48C43.58 104 40 100.42 40 96V40Z" fill="%2310B981"/><rect x="45" y="52" width="30" height="28" rx="4" fill="%23A7F3D0"/><circle cx="60" cy="66" r="6" fill="%23059669"/></svg>`,
  mouse: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="16" fill="%23F3E8FF"/><rect x="38" y="25" width="44" height="70" rx="22" fill="%237C3AED"/><path d="M60 25V50" stroke="%23DDD6FE" stroke-width="3"/><rect x="56" y="35" width="8" height="14" rx="4" fill="%23DDD6FE"/><circle cx="60" cy="74" r="6" fill="%235B21B6"/></svg>`,
  tape: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="16" fill="%23FFF7ED"/><circle cx="60" cy="60" r="38" fill="%23EA580C"/><circle cx="60" cy="60" r="22" fill="%23FED7AA"/><circle cx="60" cy="60" r="14" fill="%23FFF7ED"/><path d="M85 75L102 92" stroke="%23EA580C" stroke-width="8" stroke-linecap="round"/></svg>`,
  lamp: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="16" fill="%23EFF6FF"/><path d="M36 44L60 24L84 44H36Z" fill="%233B82F6"/><rect x="57" y="44" width="6" height="42" fill="%2364748B"/><rect x="40" y="86" width="40" height="8" rx="4" fill="%231E293B"/><polygon points="44,44 76,44 88,80 32,80" fill="%2393C5FD" opacity="0.3"/></svg>`,
  glasses: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="16" fill="%23F1F5F9"/><circle cx="42" cy="60" r="18" fill="%2338BDF8" fill-opacity="0.4" stroke="%230284C7" stroke-width="6"/><circle cx="78" cy="60" r="18" fill="%2338BDF8" fill-opacity="0.4" stroke="%230284C7" stroke-width="6"/><path d="M57 56C60 52 64 52 67 56" stroke="%230284C7" stroke-width="6" stroke-linecap="round"/><path d="M24 58L14 50M96 58L106 50" stroke="%230284C7" stroke-width="5" stroke-linecap="round"/></svg>`,
  labels: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="16" fill="%23F8FAFC"/><rect x="30" y="32" width="60" height="56" rx="8" fill="%23FFFFFF" stroke="%2364748B" stroke-width="4"/><path d="M40 44H80M40 54H80M40 64H65" stroke="%2394A3B8" stroke-width="4" stroke-linecap="round"/><rect x="40" y="72" width="20" height="8" fill="%233B82F6"/></svg>`
};

// Master Warehouse Product Catalog
const DEFAULT_PRODUCTS = [
  {
    id: "PROD-001",
    name: "Noise-Cancelling Studio Headset",
    sku: "SKU-NC-902",
    barcode: "8901234001",
    category: "Electronics",
    binLocation: "Aisle A • Bay 02 • Shelf 1",
    binCode: "A-02-1",
    unitWeight: "0.45 kg",
    stock: 142,
    image: PRODUCT_SVGS.headphones
  },
  {
    id: "PROD-002",
    name: "Heavy-Duty Grip Safety Gloves (L)",
    sku: "SKU-GL-401",
    barcode: "8901234002",
    category: "Safety Gear",
    binLocation: "Aisle B • Bay 04 • Shelf 3",
    binCode: "B-04-3",
    unitWeight: "0.20 kg",
    stock: 320,
    image: PRODUCT_SVGS.gloves
  },
  {
    id: "PROD-003",
    name: "Insulated Stainless Bottle 750ml",
    sku: "SKU-WB-118",
    barcode: "8901234003",
    category: "Lifestyle",
    binLocation: "Aisle C • Bay 01 • Shelf 2",
    binCode: "C-01-2",
    unitWeight: "0.38 kg",
    stock: 85,
    image: PRODUCT_SVGS.waterbottle
  },
  {
    id: "PROD-004",
    name: "Ergonomic Silent Wireless Mouse",
    sku: "SKU-MS-773",
    barcode: "8901234004",
    category: "Electronics",
    binLocation: "Aisle A • Bay 05 • Shelf 4",
    binCode: "A-05-4",
    unitWeight: "0.12 kg",
    stock: 210,
    image: PRODUCT_SVGS.mouse
  },
  {
    id: "PROD-005",
    name: "Reinforced Packaging Tape 6-Pack",
    sku: "SKU-TP-550",
    barcode: "8901234005",
    category: "Packing Supplies",
    binLocation: "Aisle D • Bay 02 • Shelf 1",
    binCode: "D-02-1",
    unitWeight: "1.10 kg",
    stock: 540,
    image: PRODUCT_SVGS.tape
  },
  {
    id: "PROD-006",
    name: "Adjustable LED Task Desk Lamp",
    sku: "SKU-LP-303",
    barcode: "8901234006",
    category: "Office",
    binLocation: "Aisle B • Bay 07 • Shelf 2",
    binCode: "B-07-2",
    unitWeight: "0.85 kg",
    stock: 64,
    image: PRODUCT_SVGS.lamp
  },
  {
    id: "PROD-007",
    name: "Anti-Fog UV Safety Eyewear",
    sku: "SKU-SG-209",
    barcode: "8901234007",
    category: "Safety Gear",
    binLocation: "Aisle B • Bay 03 • Shelf 1",
    binCode: "B-03-1",
    unitWeight: "0.08 kg",
    stock: 450,
    image: PRODUCT_SVGS.glasses
  },
  {
    id: "PROD-008",
    name: "Direct Thermal Shipping Roll (500)",
    sku: "SKU-LB-884",
    barcode: "8901234008",
    category: "Packing Supplies",
    binLocation: "Aisle D • Bay 05 • Shelf 3",
    binCode: "D-05-3",
    unitWeight: "0.75 kg",
    stock: 190,
    image: PRODUCT_SVGS.labels
  }
];

// Seed Incoming Orders
// Required columns: Order ID, Priority Status (Regular/Priority), Items, Workflow Status (To Pick, Packing, Staged, Shipped)
// + Flagged Issue lane
const DEFAULT_ORDERS = [
  {
    id: "XYZ-1081",
    priority: "Priority", // Priority vs Regular
    status: "To Pick",    // To Pick, Packing, Staged, Shipped, Issue
    customerName: "Acme Logistics Center",
    destination: "Express Delivery (Dock 4)",
    createdAtMinutesAgo: 45, // Exceeded 30 min SLA -> Delayed!
    targetSlaMinutes: 30,
    isForceDelayed: true,   // Demonstrates bright red flashing alert!
    items: [
      {
        productId: "PROD-001",
        quantity: 2,
        confirmed: false
      },
      {
        productId: "PROD-004",
        quantity: 1,
        confirmed: false
      }
    ],
    notes: "RUSH order requested by regional director."
  },
  {
    id: "XYZ-1082",
    priority: "Priority",
    status: "To Pick",
    customerName: "Summit Healthcare",
    destination: "Urgent Clinic Care",
    createdAtMinutesAgo: 10,
    targetSlaMinutes: 30,
    isForceDelayed: false,
    items: [
      {
        productId: "PROD-002",
        quantity: 4,
        confirmed: false
      },
      {
        productId: "PROD-007",
        quantity: 2,
        confirmed: false
      }
    ],
    notes: "Priority shipment - verify double seal."
  },
  {
    id: "XYZ-1077",
    priority: "Regular",
    status: "To Pick",
    customerName: "Pacific Retailers Co.",
    destination: "Standard Freight (Bay 9)",
    createdAtMinutesAgo: 15,
    targetSlaMinutes: 60,
    isForceDelayed: false,
    items: [
      {
        productId: "PROD-003",
        quantity: 3,
        confirmed: false
      },
      {
        productId: "PROD-005",
        quantity: 1,
        confirmed: false
      }
    ],
    notes: "Pallet batch 14B."
  },
  {
    id: "XYZ-1065",
    priority: "Priority",
    status: "Packing",
    customerName: "Apex High-Tech Labs",
    destination: "Courier Pickup (Zone 1)",
    createdAtMinutesAgo: 38, // Exceeded 30m -> Flashing bright red in Packing lane!
    targetSlaMinutes: 30,
    isForceDelayed: true,
    items: [
      {
        productId: "PROD-001",
        quantity: 1,
        confirmed: true
      },
      {
        productId: "PROD-006",
        quantity: 2,
        confirmed: false // Needs 2nd item confirmation before staging
      }
    ],
    notes: "Requires fragile packaging."
  },
  {
    id: "XYZ-1070",
    priority: "Regular",
    status: "Packing",
    customerName: "Horizon Supplies Ltd.",
    destination: "Ground Courier",
    createdAtMinutesAgo: 22,
    targetSlaMinutes: 60,
    isForceDelayed: false,
    items: [
      {
        productId: "PROD-005",
        quantity: 4,
        confirmed: true
      },
      {
        productId: "PROD-008",
        quantity: 2,
        confirmed: true
      }
    ],
    notes: "All items ready for box sealing."
  },
  {
    id: "XYZ-1054",
    priority: "Priority",
    status: "Staged",
    customerName: "Global Aerotech Corp.",
    destination: "Bay 3 (Flight Ready)",
    createdAtMinutesAgo: 25,
    targetSlaMinutes: 30,
    isForceDelayed: false,
    items: [
      {
        productId: "PROD-004",
        quantity: 5,
        confirmed: true
      }
    ],
    notes: "Ready for direct carrier loading."
  },
  {
    id: "XYZ-1049",
    priority: "Regular",
    status: "Staged",
    customerName: "Urban Home Goods",
    destination: "Pallet Stack #12",
    createdAtMinutesAgo: 40,
    targetSlaMinutes: 90,
    isForceDelayed: false,
    items: [
      {
        productId: "PROD-003",
        quantity: 2,
        confirmed: true
      },
      {
        productId: "PROD-006",
        quantity: 1,
        confirmed: true
      }
    ],
    notes: "Scheduled for 3:00 PM trailer."
  },
  {
    id: "XYZ-1033",
    priority: "Priority",
    status: "Shipped",
    customerName: "Nordic Engineering",
    destination: "Dispatched via FedEx Air",
    createdAtMinutesAgo: 85,
    targetSlaMinutes: 45,
    isForceDelayed: false,
    items: [
      {
        productId: "PROD-001",
        quantity: 1,
        confirmed: true
      },
      {
        productId: "PROD-007",
        quantity: 3,
        confirmed: true
      }
    ],
    shippedAt: "Today, 11:20 AM",
    trackingNumber: "TRK-990812-XYZ"
  },
  {
    id: "XYZ-1060",
    priority: "Regular",
    status: "Issue", // Dedicated Issue Lane
    customerName: "Beacon Distribution",
    destination: "Awaiting Resolution",
    createdAtMinutesAgo: 70,
    targetSlaMinutes: 60,
    isForceDelayed: true,
    issueReason: "Damaged box on arrival at Rack B-04. Unit dented.",
    issueReportedAt: "10 mins ago",
    previousStatus: "Packing",
    items: [
      {
        productId: "PROD-003",
        quantity: 2,
        confirmed: false
      }
    ],
    notes: "Supervisor inspection requested."
  }
];

// Issue reasons for fast single-tap reporting
const COMMON_ISSUE_REASONS = [
  "Item Missing from Bin Location",
  "Item Damaged / Packaging Broken",
  "Barcode Label Scratched or Unreadable",
  "Quantity in Bin does not match system",
  "Wrong Product in assigned Bin",
  "Item Requires Heavy Machinery / Forklift"
];

// Storage Keys
const STORAGE_KEYS = {
  ORDERS: "xyz_hub_orders_v1",
  PRODUCTS: "xyz_hub_products_v1",
  SOUND_ENABLED: "xyz_hub_sound_v1",
  HIGH_CONTRAST: "xyz_hub_contrast_v1"
};

// Data Store Class
class DataStore {
  constructor() {
    this.products = this.loadProducts();
    this.orders = this.loadOrders();
  }

  loadProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Error reading products from storage:", e);
    }
    this.saveProducts(DEFAULT_PRODUCTS);
    return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
  }

  saveProducts(products) {
    this.products = products;
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error("Failed to save products:", e);
    }
  }

  loadOrders() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Error reading orders from storage:", e);
    }
    const freshOrders = JSON.parse(JSON.stringify(DEFAULT_ORDERS));
    this.saveOrders(freshOrders);
    return freshOrders;
  }

  saveOrders(orders) {
    this.orders = orders;
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save orders:", e);
    }
  }

  getProductById(id) {
    return this.products.find(p => p.id === id);
  }

  getOrderById(id) {
    return this.orders.find(o => o.id === id);
  }

  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    this.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    this.orders = JSON.parse(JSON.stringify(DEFAULT_ORDERS));
    this.saveProducts(this.products);
    this.saveOrders(this.orders);
    return this.orders;
  }

  // Create and seed a brand new incoming order (Priority or Regular)
  createRandomOrder(isPriority = false) {
    const nextNum = Math.floor(1090 + Math.random() * 900);
    const orderId = `XYZ-${nextNum}`;
    
    // Pick 1 to 3 random items
    const numItems = 1 + Math.floor(Math.random() * 2);
    const shuffledProducts = [...this.products].sort(() => 0.5 - Math.random());
    const orderItems = [];
    
    for (let i = 0; i < numItems; i++) {
      orderItems.push({
        productId: shuffledProducts[i].id,
        quantity: 1 + Math.floor(Math.random() * 3),
        confirmed: false
      });
    }

    const customers = [
      "Vanguard Logistics", "Cascade Outfitters", "SwiftSupply Depot",
      "Prime Direct Global", "Summit Retail Co.", "Metro Hub Express"
    ];
    const customer = customers[Math.floor(Math.random() * customers.length)];

    const newOrder = {
      id: orderId,
      priority: isPriority ? "Priority" : "Regular",
      status: "To Pick",
      customerName: customer,
      destination: isPriority ? "Urgent Dispatch Bay A" : "Standard Dock B",
      createdAtMinutesAgo: 0,
      targetSlaMinutes: isPriority ? 30 : 60,
      isForceDelayed: false,
      items: orderItems,
      notes: isPriority ? "⚡ HIGH PRIORITY: Expedite fulfillment immediately." : "Standard warehouse dispatch."
    };

    this.orders.unshift(newOrder);
    this.saveOrders(this.orders);
    return newOrder;
  }
}

// Global store instance
window.xyzStore = new DataStore();
