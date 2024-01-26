import dotenv from "dotenv";
dotenv.config();

import * as redis from "redis";
import { createApp } from "./app";

const { PORT, REDIS_URL } = process.env;

if (!PORT) throw new Error("PORT is requried");
if (!REDIS_URL) throw new Error("REDIS URL is requried");

async function startServer() {
  console.log("Trying to start server!");
  const client = redis.createClient({ url: REDIS_URL });
  client.connect();

  const app = createApp(client);

  const server = app.listen(PORT, () => {
    console.log(`🚀App Listening at port ${PORT}`);
  });

  return server;
}

const server = startServer();

const gracefullShutdown = async () => {
  const _server = await server;
  _server.close(() => {
    console.log("Graceful Shutdown!");
    process.exit();
  });
};

process.on("SIGTERM", gracefullShutdown);
process.on("SIGTERM", gracefullShutdown);
