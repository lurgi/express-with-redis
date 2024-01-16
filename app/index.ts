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

  app.listen(PORT, () => {
    console.log(`🚀App Listening at port ${PORT}`);
  });
}

startServer();
