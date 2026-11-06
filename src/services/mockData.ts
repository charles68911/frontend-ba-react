
import type {
  Customer,
  PaymentMethod,
  PaymentStatus,
  Product,
  Sale,
  StockMovement,
  Transaction,
} from "@/types";

/**
 * SAMPLE DATA ONLY
 * -----------------
 * These records simulate the Central Seafoods database.
 * The actual application should retrieve records from the backend API.
 *
 * Current sales structure:
 * - One product per sale.
 * - One sale can have multiple payment transactions.
 * - Partial payments are supported.
 */

// ============================================
// PRODUCT AND CUSTOMER SEEDS
// ============================================

type ProductSeed = Omit<Product, "id" | "createdAt">;
type CustomerSeed = Omit<Customer, "id" | "createdAt">;

const productSeeds: ProductSeed[] = [
  {
    name: "Fresh Tanigue",
    category: "Fish",
    unit: "kg",
    price: 320,
    cost: 240,
    stock: 45,
    reorderPoint: 20,
    supplier: "Cordova Fishing Port",
    description: "Fresh Spanish mackerel sourced from local fishermen.",
  },
  {
    name: "Fresh Maya-Maya",
    category: "Fish",
    unit: "kg",
    price: 280,
    cost: 210,
    stock: 28,
    reorderPoint: 15,
    supplier: "Cordova Fishing Port",
    description: "Red snapper, ideal for grilling and steaming.",
  },
  {
    name: "Fresh Lapu-Lapu",
    category: "Fish",
    unit: "kg",
    price: 420,
    cost: 320,
    stock: 12,
    reorderPoint: 10,
    supplier: "Mactan Fish Supplier",
    description: "Premium grouper commonly served at local restaurants.",
  },
  {
    name: "Fresh Bangus",
    category: "Fish",
    unit: "kg",
    price: 180,
    cost: 130,
    stock: 60,
    reorderPoint: 25,
    supplier: "Cordova Aqua Farms",
    description: "Milkfish from nearby aquaculture farms.",
  },
  {
    name: "Fresh Tilapia",
    category: "Fish",
    unit: "kg",
    price: 150,
    cost: 105,
    stock: 8,
    reorderPoint: 20,
    supplier: "Cordova Aqua Farms",
    description: "Farm-raised tilapia for everyday meals.",
  },
  {
    name: "Galunggong",
    category: "Fish",
    unit: "kg",
    price: 140,
    cost: 100,
    stock: 75,
    reorderPoint: 30,
    supplier: "Cordova Fishing Port",
    description: "Round scad, a popular affordable local fish.",
  },
  {
    name: "Yellowfin Tuna",
    category: "Fish",
    unit: "kg",
    price: 380,
    cost: 290,
    stock: 22,
    reorderPoint: 12,
    supplier: "Cebu Tuna Traders",
    description: "Premium tuna cuts for sashimi and grilling.",
  },
  {
    name: "Imported Salmon",
    category: "Fish",
    unit: "kg",
    price: 650,
    cost: 520,
    stock: 6,
    reorderPoint: 8,
    supplier: "Cebu Seafood Imports",
    description: "Chilled Norwegian salmon for restaurants.",
  },
  {
    name: "Tiger Prawns",
    category: "Crustaceans",
    unit: "kg",
    price: 480,
    cost: 370,
    stock: 18,
    reorderPoint: 10,
    supplier: "Mactan Prawn Farms",
    description: "Large tiger prawns suitable for special dishes.",
  },
  {
    name: "Blue Swimming Crab",
    category: "Crustaceans",
    unit: "kg",
    price: 350,
    cost: 260,
    stock: 25,
    reorderPoint: 12,
    supplier: "Cordova Coastal Suppliers",
    description: "Fresh blue crab from coastal fishers.",
  },
  {
    name: "Live Mud Crab",
    category: "Crustaceans",
    unit: "kg",
    price: 520,
    cost: 400,
    stock: 4,
    reorderPoint: 6,
    supplier: "Cordova Coastal Suppliers",
    description: "Live mud crab, a premium seafood item.",
  },
  {
    name: "Fresh Squid",
    category: "Shellfish",
    unit: "kg",
    price: 260,
    cost: 190,
    stock: 32,
    reorderPoint: 15,
    supplier: "Cordova Fishing Port",
    description: "Cleaned squid ready for cooking.",
  },
  {
    name: "Green Mussels",
    category: "Shellfish",
    unit: "kg",
    price: 120,
    cost: 80,
    stock: 40,
    reorderPoint: 15,
    supplier: "Cordova Shellfish Farms",
    description: "Fresh green mussels harvested locally.",
  },
  {
    name: "Oysters",
    category: "Shellfish",
    unit: "kg",
    price: 180,
    cost: 130,
    stock: 0,
    reorderPoint: 10,
    supplier: "Cordova Shellfish Farms",
    description: "Fresh oysters, currently out of stock.",
  },
  {
    name: "Smoked Bangus",
    category: "Processed",
    unit: "pack",
    price: 220,
    cost: 160,
    stock: 35,
    reorderPoint: 15,
    supplier: "Central Seafoods Processing",
    description: "House-smoked milkfish in vacuum-sealed packs.",
  },
  {
    name: "Dried Danggit",
    category: "Processed",
    unit: "pack",
    price: 160,
    cost: 110,
    stock: 50,
    reorderPoint: 20,
    supplier: "Cebu Dried Fish Traders",
    description: "Ready-to-fry dried rabbitfish packs.",
  },
  {
    name: "Fish Fillet Pack",
    category: "Processed",
    unit: "pack",
    price: 250,
    cost: 180,
    stock: 14,
    reorderPoint: 10,
    supplier: "Central Seafoods Processing",
    description: "Boneless fish fillets packed for retail.",
  },
  {
    name: "Fresh Guso",
    category: "Others",
    unit: "kg",
    price: 90,
    cost: 60,
    stock: 30,
    reorderPoint: 10,
    supplier: "Cordova Seaweed Growers",
    description: "Fresh edible seaweed for salads.",
  },
];

const customerSeeds: CustomerSeed[] = [
  {
    name: "Cordova Bay Resort",
    contactNumber: "+63 917 555 0142",
    email: "purchasing@cordovabayresort.ph",
    address: "Gilutongan Road, Cordova, Cebu",
    type: "Resort",
    notes: "Orders fresh fish every Tuesday and Friday.",
  },
  {
    name: "Lantaw Seafood Grill",
    contactNumber: "+63 918 442 8891",
    email: "orders@lantawgrill.ph",
    address: "Poblacion, Cordova, Cebu",
    type: "Restaurant",
    notes: "Prefers premium grouper and tiger prawns.",
  },
  {
    name: "10,000 Roses Café",
    contactNumber: "+63 932 118 7743",
    email: "kitchen@10000rosescafe.ph",
    address: "Day-as, Cordova, Cebu",
    type: "Restaurant",
    notes: "Weekend orders are usually larger.",
  },
  {
    name: "Mactan Beach Resort",
    contactNumber: "+63 919 330 5521",
    email: "fb@mactanbeachresort.ph",
    address: "Punta Engaño, Lapu-Lapu City",
    type: "Resort",
    notes: "Requires delivery before 8:00 AM.",
  },
  {
    name: "Talisay Fish Market",
    contactNumber: "+63 927 650 3308",
    email: "talisayfishmarket@gmail.com",
    address: "Tabunok, Talisay City",
    type: "Wholesale",
    notes: "Bulk buyer of galunggong and bangus.",
  },
  {
    name: "Poblacion Barangay Canteen",
    contactNumber: "+63 915 802 6670",
    email: "canteen@poblacioncordova.ph",
    address: "Poblacion, Cordova, Cebu",
    type: "Retail",
    notes: "Small daily purchases for the canteen.",
  },
  {
    name: "Seaside Eatery",
    contactNumber: "+63 926 774 1189",
    email: "seaside.eatery@gmail.com",
    address: "Buagsong, Cordova, Cebu",
    type: "Restaurant",
    notes: "Orders squid and mussels regularly.",
  },
  {
    name: "Cebu Yacht Club",
    contactNumber: "+63 917 888 3420",
    email: "provisioning@cebuyachtclub.ph",
    address: "Punta Engaño, Lapu-Lapu City",
    type: "Resort",
    notes: "Premium seafood requirements.",
  },
  {
    name: "Marites Santos",
    contactNumber: "+63 920 114 8822",
    email: "marites.santos@gmail.com",
    address: "Bangbang, Cordova, Cebu",
    type: "Household",
    notes: "Regular weekend customer.",
  },
  {
    name: "Juan Dela Cruz",
    contactNumber: "+63 939 443 7756",
    email: "juan.delacruz@gmail.com",
    address: "San Miguel, Cordova, Cebu",
    type: "Household",
    notes: "Prefers bangus and tilapia.",
  },
  {
    name: "Ocean Fresh Trading",
    contactNumber: "+63 918 227 9043",
    email: "sales@oceanfreshtrading.ph",
    address: "Mandaue City, Cebu",
    type: "Wholesale",
    notes: "Weekly bulk order for reselling.",
  },
  {
    name: "Harbor View Hotel",
    contactNumber: "+63 932 500 8814",
    email: "purchasing@harborviewhotel.ph",
    address: "Ibo, Lapu-Lapu City",
    type: "Restaurant",
    notes: "Invoices settled by bank transfer.",
  },
];

// ============================================
// SAMPLE PRODUCTS AND CUSTOMERS
// ============================================

function createId(index: number) {
  return `CUS-${String(index + 1).padStart(3, "0")}`;
}

function createProductId(index: number) {
  return `PRD-${String(index + 1).padStart(3, "0")}`;
}

const baseDate = new Date();
baseDate.setMonth(baseDate.getMonth() - 6);

export const sampleProducts: Product[] = productSeeds.map(
  (product, index) => {
    const createdAt = new Date(baseDate);
    createdAt.setDate(createdAt.getDate() + index);

    return {
      ...product,
      id: createProductId(index),
      createdAt: createdAt.toISOString(),
    };
  },
);

export const sampleCustomers: Customer[] = customerSeeds.map(
  (customer, index) => {
    const createdAt = new Date(baseDate);
    createdAt.setDate(createdAt.getDate() + index * 3);

    return {
      ...customer,
      id: createId(index),
      createdAt: createdAt.toISOString(),
    };
  },
);

// ============================================
// DETERMINISTIC SAMPLE DATA GENERATOR
// ============================================

function createRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

const random = createRandom(20261031);

function pick<T>(items: T[]): T {
  return items[Math.floor(random() * items.length)];
}

function pickPaymentMethod(): PaymentMethod {
  const roll = random();

  if (roll < 0.36) return "Cash";
  if (roll < 0.66) return "GCash";
  if (roll < 0.87) return "Bank Transfer";

  return "Credit";
}

function pickPaymentStatus(): PaymentStatus {
  const roll = random();

  if (roll < 0.76) return "Paid";
  if (roll < 0.88) return "Pending";
  if (roll < 0.96) return "Partial";

  return "Refunded";
}

function makeSaleDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(
    8 + Math.floor(random() * 10),
    Math.floor(random() * 60),
    0,
    0,
  );

  return date;
}

const noteOptions = [
  "Delivered to the main kitchen.",
  "Pickup at the Cordova store.",
  "Prepared for same-day delivery.",
  "Customer requested ice-packed packaging.",
  "",
];

// ============================================
// SAMPLE SALES
// ONE PRODUCT PER SALE
// ============================================

const generatedSales: Sale[] = [];

for (let daysAgo = 179; daysAgo >= 0; daysAgo -= 1) {
  const saleCount = 1 + Math.floor(random() * 3);

  for (let saleIndex = 0; saleIndex < saleCount; saleIndex += 1) {
    const customer = pick(sampleCustomers);
    const product = pick(sampleProducts);

    const maxQuantity = product.unit === "kg" ? 7 : 5;
    const quantity = 1 + Math.floor(random() * maxQuantity);

    const subtotal =
      Math.round(product.price * quantity * 100) / 100;

    const totalAmount = subtotal;
    const paymentStatus = pickPaymentStatus();

    let amountPaid = 0;

    if (paymentStatus === "Paid") {
      amountPaid = totalAmount;
    } else if (paymentStatus === "Partial") {
      const paymentPercentage = 0.2 + random() * 0.55;

      amountPaid =
        Math.round(totalAmount * paymentPercentage * 100) / 100;
    } else if (paymentStatus === "Refunded") {
      amountPaid = 0;
    }

    const remainingBalance =
      paymentStatus === "Refunded"
        ? 0
        : Math.max(
            0,
            Math.round((totalAmount - amountPaid) * 100) / 100,
          );

    const saleNumber = generatedSales.length + 1;
    const saleDate = makeSaleDate(daysAgo);

    generatedSales.push({
      id: `SL-${String(1000 + saleNumber)}`,
      customerId: customer.id,
      customerName: customer.name,
      date: saleDate.toISOString(),

      items: [
        {
          productId: product.id,
          productName: product.name,
          unit: product.unit,
          quantity,
          unitPrice: product.price,
          subtotal,
        },
      ],

      totalAmount,
      amountPaid,
      remainingBalance,
      paymentMethod: pickPaymentMethod(),
      paymentStatus,
      notes: pick(noteOptions),
    });
  }
}

export const sampleSales: Sale[] = generatedSales
  .slice()
  .sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime(),
  );

// ============================================
// SAMPLE TRANSACTIONS
// ONE SALE CAN HAVE MULTIPLE PAYMENTS
// ============================================

const generatedTransactions: Transaction[] = [];

function addSampleTransaction(
  sale: Sale,
  amount: number,
  paymentMethod: PaymentMethod,
  paymentStatus: PaymentStatus,
  paymentIndex: number,
) {
  const saleNumber = sale.id.replace("SL-", "");
  const year = new Date(sale.date).getFullYear();

  const transactionNumber = generatedTransactions.length + 1;

  generatedTransactions.push({
    id: `TRX-${String(transactionNumber).padStart(6, "0")}`,
    saleId: sale.id,
    customerId: sale.customerId,
    customerName: sale.customerName,
    date: new Date(
      new Date(sale.date).getTime() +
        paymentIndex * 60 * 60 * 1000,
    ).toISOString(),
    amount,
    paymentMethod,
    paymentStatus,
    referenceNo: `CS-${year}-${saleNumber}-${paymentIndex + 1}`,
  });
}

sampleSales.forEach((sale) => {
  if (sale.paymentStatus === "Pending") {
    // No payment has been received yet.
    return;
  }

  if (sale.paymentStatus === "Refunded") {
    // The original payment was refunded.
    addSampleTransaction(
      sale,
      sale.totalAmount,
      sale.paymentMethod,
      "Refunded",
      0,
    );

    return;
  }

  if (sale.paymentStatus === "Partial") {
    // A partial sale may have one or two payments.
    const paymentCount = random() < 0.5 ? 1 : 2;

    if (paymentCount === 1) {
      addSampleTransaction(
        sale,
        sale.amountPaid,
        sale.paymentMethod,
        "Partial",
        0,
      );

      return;
    }

    const firstPayment =
      Math.round(sale.amountPaid * 0.6 * 100) / 100;

    const secondPayment =
      Math.round((sale.amountPaid - firstPayment) * 100) / 100;

    addSampleTransaction(
      sale,
      firstPayment,
      sale.paymentMethod,
      "Partial",
      0,
    );

    addSampleTransaction(
      sale,
      secondPayment,
      pickPaymentMethod(),
      "Partial",
      1,
    );

    return;
  }

  // Paid sales can have one or two payment transactions.
  const paymentCount = random() < 0.5 ? 1 : 2;

  if (paymentCount === 1) {
    addSampleTransaction(
      sale,
      sale.amountPaid,
      sale.paymentMethod,
      "Paid",
      0,
    );

    return;
  }

  const firstPayment =
    Math.round(sale.amountPaid * 0.4 * 100) / 100;

  const secondPayment =
    Math.round((sale.amountPaid - firstPayment) * 100) / 100;

  addSampleTransaction(
    sale,
    firstPayment,
    sale.paymentMethod,
    "Partial",
    0,
  );

  addSampleTransaction(
    sale,
    secondPayment,
    pickPaymentMethod(),
    "Paid",
    1,
  );
});

export const sampleTransactions: Transaction[] =
  generatedTransactions.sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime(),
  );

// ============================================
// SAMPLE STOCK MOVEMENTS
// ============================================

const stockMovements: StockMovement[] = [];

sampleSales.slice(0, 18).forEach((sale) => {
  const item = sale.items[0];

  if (!item) return;

  stockMovements.push({
    id: `MOV-SO-${sale.id}`,
    productId: item.productId,
    productName: item.productName,
    type: "Stock Out",
    quantity: item.quantity,
    unit: item.unit,
    reason: `Sold through ${sale.id}`,
    date: sale.date,
    reference: sale.id,
  });
});

sampleProducts.slice(0, 9).forEach((product, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (index + 1));
  date.setHours(7 + index, 15, 0, 0);

  stockMovements.push({
    id: `MOV-SI-${product.id}`,
    productId: product.id,
    productName: product.name,
    type: "Stock In",
    quantity: 20 + index * 5,
    unit: product.unit,
    reason: "Supplier delivery",
    date: date.toISOString(),
    reference: `PO-${String(2401 + index)}`,
  });
});

stockMovements.push(
  {
    id: "MOV-ADJ-001",
    productId: sampleProducts[13].id,
    productName: sampleProducts[13].name,
    type: "Adjustment",
    quantity: -3,
    unit: sampleProducts[13].unit,
    reason: "Spoilage / quality check",
    date: new Date(
      Date.now() - 2 * 86400000,
    ).toISOString(),
    reference: "ADJ-1001",
  },
  {
    id: "MOV-ADJ-002",
    productId: sampleProducts[10].id,
    productName: sampleProducts[10].name,
    type: "Adjustment",
    quantity: -1,
    unit: sampleProducts[10].unit,
    reason: "Dead stock removed",
    date: new Date(
      Date.now() - 5 * 86400000,
    ).toISOString(),
    reference: "ADJ-1002",
  },
);

export const sampleStockMovements: StockMovement[] =
  stockMovements.sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime(),
  );
