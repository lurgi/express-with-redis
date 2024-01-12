import express from "express";
import { RedisClientType } from "redis";

export type RedisClient = RedisClientType<any, any, any>;

export const createApp = (client: RedisClient) => {
  const app = express();

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
