import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

dotenv.config();
connectDB();

const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const products = [
  {
    name: "ShockArmor Silicone Case",
    description:
      "Military-grade drop protection with a soft-touch silicone shell and raised edges to guard your camera and screen.",
    category: "Mobile Covers",
    price: 599,
    discountPrice: 449,
    material: "Liquid silicone",
    color: "Midnight Blue",
    compatibleModels: ["iPhone 15", "iPhone 15 Pro", "iPhone 14"],
    countInStock: 120,
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800"],
    tags: ["case", "silicone", "protection"],
  },
  {
    name: "ClearView 9H Tempered Glass",
    description:
      "Ultra-clear 9H hardness tempered glass with oleophobic coating and bubble-free installation kit included.",
    category: "Tempered Glass",
    price: 299,
    discountPrice: 199,
    material: "Tempered glass, 0.3mm",
    color: "Clear",
    compatibleModels: ["iPhone 15", "Samsung S24", "OnePlus 12"],
    countInStock: 200,
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800"],
    tags: ["screen protector", "glass"],
  },
  {
    name: "PowerDash 65W GaN Charger",
    description:
      "Compact dual-port GaN fast charger delivering 65W — charge a laptop and phone simultaneously without the bulk.",
    category: "Chargers",
    price: 1499,
    discountPrice: 1199,
    material: "GaN semiconductor",
    color: "White",
    countInStock: 75,
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800"],
    tags: ["charger", "fast charging", "gan"],
  },
  {
    name: "BraidLink USB-C to USB-C Cable",
    description:
      "Nylon-braided 100W USB-C cable rated for 20,000+ bend cycles. Supports fast charging and 480Mbps data sync.",
    category: "Cables",
    price: 399,
    discountPrice: 0,
    material: "Braided nylon, aluminum housing",
    color: "Space Grey",
    countInStock: 150,
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1591290619762-c6ffa2e2bda1?w=800"],
    tags: ["cable", "usb-c", "fast charging"],
  },
  {
    name: "VoltCell 20000mAh Power Bank",
    description:
      "Slim high-capacity power bank with 22.5W fast output, dual USB-A + USB-C ports, and an LED charge display.",
    category: "Power Banks",
    price: 1999,
    discountPrice: 1599,
    material: "Polymer battery cell, aluminum shell",
    color: "Graphite",
    countInStock: 60,
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800"],
    tags: ["power bank", "battery"],
  },
  {
    name: "PulseBeat Pro Wireless Earbuds",
    description:
      "Active noise-cancelling earbuds with 30-hour total battery life, IPX5 sweat resistance, and low-latency gaming mode.",
    category: "Earphones",
    price: 2999,
    discountPrice: 2299,
    material: "ABS plastic, silicone tips",
    color: "Pearl White",
    countInStock: 40,
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800"],
    tags: ["earbuds", "wireless", "anc"],
  },
  {
    name: "PulseFit Active Smart Watch",
    description:
      "1.9-inch AMOLED display smart watch with heart-rate and SpO2 tracking, 100+ sport modes, and 7-day battery life.",
    category: "Smart Watches",
    price: 3499,
    discountPrice: 2799,
    material: "Aluminum alloy, silicone strap",
    color: "Jet Black",
    countInStock: 35,
    isFeatured: true,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"],
    tags: ["smartwatch", "fitness"],
  },
  {
    name: "GripStand Magnetic Phone Mount",
    description:
      "MagSafe-compatible car mount with a one-hand release lock and 360° rotation for vent or dash mounting.",
    category: "Gadgets",
    price: 799,
    discountPrice: 0,
    material: "Aluminum, N52 magnets",
    color: "Black",
    countInStock: 90,
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1592286927505-1def25115558?w=800"],
    tags: ["mount", "magsafe", "car accessory"],
  },
  {
    name: "FlexBeam Ring Light & Tripod",
    description:
      "10-inch LED ring light with adjustable tripod and phone clamp — ideal for calls, content creation, and streaming.",
    category: "Gadgets",
    price: 1299,
    discountPrice: 999,
    material: "ABS, aluminum tripod",
    color: "White/Black",
    countInStock: 55,
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=800"],
    tags: ["ring light", "tripod", "content creation"],
  },
  {
    name: "AeroWave Wireless Charging Pad",
    description:
      "15W Qi wireless charging pad with anti-slip surface and foreign object detection for safe, cable-free charging.",
    category: "Chargers",
    price: 899,
    discountPrice: 699,
    material: "ABS, silicone grip",
    color: "White",
    countInStock: 70,
    isFeatured: false,
    images: ["https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800"],
    tags: ["wireless charger", "qi"],
  },
];

const importData = async () => {
  try {
    await Product.deleteMany();

    const withSlugs = products.map((p) => ({
      ...p,
      slug: slugify(p.name) + "-" + Math.floor(1000 + Math.random() * 9000),
    }));

    await Product.insertMany(withSlugs);

    const adminExists = await User.findOne({ email: "admin@hyra.com" });
    if (!adminExists) {
      await User.create({
        name: "HYRA Admin",
        email: "admin@hyra.com",
        password: "admin1234",
        role: "admin",
      });
      console.log("Admin user created: admin@hyra.com / admin1234");
    }

    console.log(`Seeded ${withSlugs.length} products successfully.`);
    process.exit();
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("All products destroyed.");
    process.exit();
  } catch (error) {
    console.error(`Destroy error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
