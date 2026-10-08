import "dotenv/config";
import Customer from "../models/Customer.js";
import { hashPassword } from "../utils/auth.js";
import { connectMongo, stopMemoryServer } from "../utils/mongo.js";

const users = [
  {
    name: "Merner Magtoto",
    email: "magtotomb@students.nu-clark.edu.ph",
    password: "merner123!",
    role: "admin",
    phone: "",
  },
  {
    name: "Merner Magtoto",
    email: "mernermagtoto55@gmail.com",
    password: "merner123!",
    role: "customer",
    phone: "",
  },
];

async function main() {
  await connectMongo(process.env.MONGO_URI);
  for (const user of users) {
    const passwordHash = hashPassword(user.password);
    const saved = await Customer.findOneAndUpdate(
      { email: user.email.toLowerCase() },
      {
        name: user.name,
        email: user.email.toLowerCase(),
        phone: user.phone,
        passwordHash,
        role: user.role,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`Upserted ${saved.role}: ${saved.email}`);
  }
  await stopMemoryServer();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
