import { spawn } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const server = spawn(process.execPath, ["server/server.js"], { stdio: "inherit" });
const client = spawn(npm, ["run", "dev:client"], { stdio: "inherit" });
const stop = () => { server.kill(); client.kill(); process.exit(); };
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
server.on("exit", (code) => { if (code && code !== 0) client.kill(); });
client.on("exit", () => server.kill());
