import * as redis from "redis";
import { createApp } from "./app";

async function startServer() {
  const client = redis.createClient({ url: "redis://localhost:6379" });
  client.connect();

  const app = createApp(client);
  const PORT = 4000;

  app.listen(PORT, () => {
    console.log(`🚀App Listening at port ${PORT}`);
  });
}

startServer();
