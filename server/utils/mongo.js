import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;
let usingMemory = false;

export function isUsingMemoryMongo() {
  return usingMemory;
}

function isLocalUri(uri) {
  return (
    uri === "memory" ||
    uri.includes("127.0.0.1") ||
    uri.includes("localhost")
  );
}

export async function resolveMongoUri(preferredUri) {
  if (!preferredUri) {
    throw new Error("Missing MONGO_URI");
  }

  if (preferredUri === "memory") {
    return startMemoryServer();
  }

  try {
    const probe = await mongoose
      .createConnection(preferredUri, { serverSelectionTimeoutMS: 5000 })
      .asPromise();
    await probe.close();
    return preferredUri;
  } catch (error) {
    // Only fall back for local URIs so Atlas misconfig fails loudly (required for class).
    if (!isLocalUri(preferredUri)) {
      throw new Error(
        `Could not connect to MongoDB Atlas (${error.message}). Check MONGO_URI, database user password, and Network Access (0.0.0.0/0 for demos).`
      );
    }

    const allowMemory =
      preferredUri === "memory" ||
      String(process.env.ALLOW_MEMORY_FALLBACK || "true").toLowerCase() !== "false";

    if (!allowMemory) {
      throw new Error(
        `Local MongoDB unavailable (${error.message}). Grading mode requires Atlas — set MONGO_URI to mongodb+srv://... and ALLOW_MEMORY_FALLBACK=false.`
      );
    }

    console.warn(
      `Local MongoDB unavailable (${error.message}). Falling back to mongodb-memory-server for local demo.`
    );
    return startMemoryServer();
  }
}

async function startMemoryServer() {
  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create();
    usingMemory = true;
  }
  const uri = memoryServer.getUri("cakette");
  console.log("Using in-memory MongoDB at", uri);
  return uri;
}

export async function connectMongo(preferredUri) {
  const uri = await resolveMongoUri(preferredUri);
  await mongoose.connect(uri);
  return uri;
}

export async function stopMemoryServer() {
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
    usingMemory = false;
  }
}
