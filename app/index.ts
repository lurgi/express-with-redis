import express from "express";
import * as redis from "redis";

const createApp = async () => {
  const app = express();
  const client = redis.createClient({ url: "redis://localhost:6379" });
  await client.connect();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send("hello from express");
  });

  app.post("/messages", async (req, res) => {
    const { message } = req.body;
    await client.lPush("messages", message);
    return res.status(200).send("message added to list");
  });

  app.get("/messages", async (req, res) => {
    const messages = await client.lRange("messages", 0, -1);
    return res.status(200).send(messages);
  });

  return app;
};

createApp().then((app) => {
  const PORT = 4000;

  app.listen(PORT, () => {
    console.log(`🚀App Listening at port ${PORT}`);
  });
});
