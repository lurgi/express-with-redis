import request from "supertest";
import { RedisClient, createApp } from "./app";
import { App } from "supertest/types";
import * as redis from "redis";

let app: App;
let client: RedisClient;

const REDIS_URL = "redis://default:test_env@localhost:6380";

beforeAll(async () => {
  client = redis.createClient({ url: REDIS_URL });
  await client.connect();
  app = createApp(client);
});

beforeEach(async () => {
  // delete Redis List after each testing
  await client.flushDb();
});

afterAll(async () => {
  await client.flushDb();
  // End Redis Server after testing
  await client.quit();
});

describe("message POST", () => {
  it("response with a success message", async () => {
    const response = await request(app)
      .post("/messages")
      .send({ message: "testing with redis" });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("message added to list");
  });
});

describe("message GET", () => {
  it("response all messages", async () => {
    await client.lPush("messages", ["msg1", "msg2"]);
    const response = await request(app).get("/messages");

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(["msg2", "msg1"]);
  });
});
