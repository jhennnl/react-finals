import "dotenv/config";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cake from "../models/Cake.js";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("Missing MONGO_URI");
  process.exit(1);
}

await mongoose.connect(uri);

const orders = await Order.find();
console.log(
  "ordersBefore",
  orders.length,
  orders.map((o) => `${o.orderCode}:${o.status}`).join(", ") || "(none)"
);

for (const order of orders) {
  if (order.status !== "Cancelled" && order.cake) {
    await Cake.findByIdAndUpdate(order.cake, { $inc: { stock: 1 } });
  }
}

const deleted = await Order.deleteMany({});
console.log("deleted", deleted.deletedCount);
console.log("ordersAfter", await Order.countDocuments());

await mongoose.disconnect();
