import "dotenv/config";
import mongoose from "mongoose";
import Cake from "../models/Cake.js";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Promotion from "../models/Promotion.js";
import Review from "../models/Review.js";
import Session from "../models/Session.js";
import { hashPassword } from "../utils/auth.js";
import { calculateQuote } from "../utils/pricing.js";
import { connectMongo, isUsingMemoryMongo, stopMemoryServer } from "../utils/mongo.js";

const cakes = [
  { slug: "strawberry-cloud", name: "Strawberry Cloud", description: "Strawberry sponge, whipped cream, and a soft pink finish.", basePrice: 780, category: "Fruity", popular: true, imageFile: "strawberry-cloud.png", tone: "pink", stock: 18 },
  { slug: "vanilla-dream", name: "Vanilla Dream", description: "Classic vanilla layers with a clean, elegant finish.", basePrice: 650, category: "Classic", popular: true, imageFile: "vanilla-dream.png", tone: "yellow", stock: 22 },
  { slug: "matcha-bloom", name: "Matcha Bloom", description: "Soft matcha sponge with creamy layers and a fresh pastel finish.", basePrice: 800, category: "Specialty", popular: true, imageFile: "matcha-bloom.png", tone: "green", stock: 15 },
  { slug: "choco-velvet", name: "Chocolate Velvet", description: "Rich chocolate layers with smooth chocolate cream.", basePrice: 750, category: "Chocolate", popular: true, imageFile: "choco-velvet.png", tone: "lilac", stock: 20 },
  { slug: "blueberry-milk", name: "Blueberry Milk", description: "Creamy blueberry layers with a delicate pastel finish.", basePrice: 820, category: "Fruity", imageFile: "blueberry-milk.png", tone: "blue", stock: 12 },
  { slug: "birthday-pop", name: "Birthday Pop", description: "A colorful celebration cake designed for birthdays and milestones.", basePrice: 900, category: "Celebration", popular: true, imageFile: "birthday-pop.png", tone: "pink", stock: 10 },
  { slug: "lemon-cloud", name: "Lemon Cloud", description: "Bright lemon sponge with a light citrus cream filling.", basePrice: 760, category: "Fruity", imageFile: "lemon-cloud.png", tone: "yellow", stock: 14 },
  { slug: "ube-milk", name: "Ube Milk", description: "A Filipino-inspired ube cake with soft milk cream.", basePrice: 820, category: "Specialty", popular: true, imageFile: "ube-milk.png", tone: "lilac", stock: 16 },
  { slug: "red-velvet", name: "Red Velvet Kiss", description: "Velvety red cake with smooth cream cheese layers.", basePrice: 850, category: "Classic", imageFile: "red-velvet.png", tone: "rose", stock: 11 },
  { slug: "caramel-nude", name: "Caramel Nude", description: "Vanilla cake layered with salted caramel and a warm nude finish.", basePrice: 880, category: "Classic", imageFile: "caramel-nude.png", tone: "yellow", stock: 9 },
  { slug: "peach-blush", name: "Peach Blush", description: "Peach sponge with fruit cream and a soft blush palette.", basePrice: 840, category: "Fruity", imageFile: "peach-blush.png", tone: "pink", stock: 13 },
  { slug: "cookies-cream", name: "Cookies & Cream", description: "Chocolate cookie crumbs, vanilla cream, and a playful finish.", basePrice: 790, category: "Chocolate", imageFile: "cookies-cream.png", tone: "lilac", stock: 17 },
  { slug: "strawberry-shortcake", name: "Strawberry Shortcake", description: "Fresh strawberry layers with vanilla cream and soft sponge.", basePrice: 860, category: "Fruity", imageFile: "strawberry-shortcake.png", tone: "pink", stock: 8 },
  { slug: "midnight-chocolate", name: "Midnight Chocolate", description: "Deep chocolate cake with glossy ganache and chocolate cream.", basePrice: 920, category: "Chocolate", imageFile: "midnight-chocolate.png", tone: "blue", stock: 7 },
  { slug: "garden-party", name: "Garden Party", description: "A floral-inspired cake made for elegant celebrations.", basePrice: 980, category: "Celebration", imageFile: "garden-party.png", tone: "green", stock: 6 },
  { slug: "retro-cherry", name: "Retro Cherry", description: "A playful vintage-style cake with cherry-inspired details.", basePrice: 950, category: "Y2K", popular: true, imageFile: "retro-cherry.png", tone: "rose", stock: 10 },
  { slug: "pink-heart", name: "Pink Heart", description: "A soft heart-shaped celebration cake with strawberry cream.", basePrice: 890, category: "Y2K", imageFile: "pink-heart.png", tone: "pink", stock: 12 },
  { slug: "dreamy-ribbon", name: "Dreamy Ribbon", description: "A pastel ribbon cake with vanilla cream and delicate decorations.", basePrice: 990, category: "Y2K", popular: true, imageFile: "dreamy-ribbon.png", tone: "lilac", stock: 5 },
];

const promotions = [
  { code: "WELCOME10", title: "A little welcome treat", description: "Get 10% off your first custom cake order.", type: "percent", value: 10, minimum: 800, label: "10% OFF", active: true },
  { code: "SWEET150", title: "Sweet savings", description: "Save ₱150 when your cake subtotal reaches ₱1,500.", type: "fixed", value: 150, minimum: 1500, label: "₱150 OFF", active: true },
  { code: "Y2K15", title: "Pastel weekend", description: "Enjoy 15% off selected Y2K designs during the promotional period.", type: "percent", value: 15, minimum: 1000, label: "15% OFF", active: true },
  { code: "BIRTHDAY200", title: "Birthday bonus", description: "Save ₱200 on birthday orders worth ₱1,800 or more.", type: "fixed", value: 200, minimum: 1800, label: "₱200 OFF", active: true },
];

export async function seedDatabase() {
  await Promise.all([
    Cake.deleteMany({}),
    Customer.deleteMany({}),
    Order.deleteMany({}),
    Promotion.deleteMany({}),
    Review.deleteMany({}),
    Session.deleteMany({}),
  ]);

  const createdCakes = await Cake.insertMany(cakes);
  const createdPromos = await Promotion.insertMany(promotions);

  const demo = await Customer.create({
    name: "Aya Santos",
    email: "aya@cakette.test",
    phone: "09171234567",
    passwordHash: hashPassword("password123"),
    loyaltyPoints: 40,
  });

  const admin = await Customer.create({
    name: "Cakette Admin",
    email: "admin@cakette.test",
    phone: "09179876543",
    passwordHash: hashPassword("admin123"),
    role: "admin",
    loyaltyPoints: 0,
  });

  const guest = await Customer.create({
    name: "Mika Reyes",
    email: "mika@cakette.test",
    phone: "09175551234",
    passwordHash: hashPassword("password123"),
    loyaltyPoints: 12,
  });

  await Customer.create({
    name: "Merner Magtoto",
    email: "magtotomb@students.nu-clark.edu.ph",
    phone: "",
    passwordHash: hashPassword("merner123!"),
    role: "admin",
    loyaltyPoints: 0,
  });

  await Customer.create({
    name: "Merner Magtoto",
    email: "mernermagtoto55@gmail.com",
    phone: "",
    passwordHash: hashPassword("merner123!"),
    role: "customer",
    loyaltyPoints: 0,
  });

  const configs = [
    { cake: createdCakes[3], size: "8-inch", flavor: "Chocolate", filling: "Chocolate", design: "Y2K Pastel", addOns: ["Cake Topper"], promoCode: "WELCOME10", pickupDate: "2026-10-08", status: "In Production", customer: demo },
    { cake: createdCakes[1], size: "6-inch", flavor: "Vanilla", filling: "Vanilla Cream", design: "Minimalist", addOns: ["Custom Message"], promoCode: "", pickupDate: "2026-09-20", status: "Completed", customer: demo },
    { cake: createdCakes[0], size: "8-inch", flavor: "Strawberry", filling: "Strawberry", design: "Heart Ribbon", addOns: ["Fresh Flowers"], promoCode: "SWEET150", pickupDate: "2026-09-05", status: "Completed", customer: guest },
    { cake: createdCakes[2], size: "6-inch", flavor: "Matcha", filling: "Ube Cream", design: "Korean Minimal", addOns: [], promoCode: "", pickupDate: "2026-08-22", status: "Completed", customer: guest },
  ];

  for (const [index, config] of configs.entries()) {
    const promo = config.promoCode
      ? createdPromos.find((item) => item.code === config.promoCode)
      : null;
    const quote = calculateQuote({
      cake: config.cake,
      size: config.size,
      flavor: config.flavor,
      filling: config.filling,
      design: config.design,
      addOns: config.addOns,
      promo,
    });

    await Order.create({
      orderCode: `CC-${1000 + index}`,
      customer: config.customer._id,
      cake: config.cake._id,
      cakeSlug: config.cake.slug,
      cakeName: config.cake.name,
      ...quote,
      pickupDate: config.pickupDate,
      specialInstructions: "",
      status: config.status,
    });
  }

  await Review.insertMany([
    {
      customer: demo._id,
      cake: createdCakes[1]._id,
      rating: 5,
      title: "Soft and elegant",
      comment: "Vanilla Dream was perfect for our small celebration. Moisture and frosting were on point.",
      status: "approved",
    },
    {
      customer: guest._id,
      cake: createdCakes[0]._id,
      rating: 4,
      title: "Pretty and tasty",
      comment: "Strawberry Cloud looked exactly like the photos and tasted fresh.",
      status: "approved",
    },
    {
      customer: demo._id,
      cake: createdCakes[3]._id,
      rating: 5,
      title: "Chocolate heaven",
      comment: "Chocolate Velvet is rich without being too heavy. Will order again.",
      status: "approved",
    },
  ]);

  console.log("Seed complete.");
  console.log("Demo login: aya@cakette.test / password123");
  console.log("Admin login: admin@cakette.test / admin123");
  console.log("Admin login: magtotomb@students.nu-clark.edu.ph / merner123!");
  console.log("Demo login: mernermagtoto55@gmail.com / merner123!");
}

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("Missing MONGO_URI");
    process.exit(1);
  }

  await connectMongo(uri);
  await seedDatabase();

  if (isUsingMemoryMongo()) {
    console.warn(
      "Note: seed used an in-memory MongoDB. Data is discarded when this process exits; the API auto-seeds on startup when memory fallback is active."
    );
  }

  await mongoose.disconnect();
  await stopMemoryServer();
}

const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith("seed.js") || process.argv[1].endsWith("seed\\seed.js") || process.argv[1].endsWith("seed/seed.js"));

if (isDirectRun) {
  seed().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
