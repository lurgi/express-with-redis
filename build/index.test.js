"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("./app");
const redis = __importStar(require("redis"));
let app;
let client;
const REDIS_URL = "redis://localhost:6379";
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    client = redis.createClient({ url: REDIS_URL });
    yield client.connect();
    app = (0, app_1.createApp)(client);
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // delete Redis List after each testing
    yield client.flushDb();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield client.flushDb();
    // End Redis Server after testing
    yield client.quit();
}));
describe("message POST", () => {
    it("response with a success message", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/messages")
            .send({ message: "testing with redis" });
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("message added to list");
    }));
});
describe("message GET", () => {
    it("response all messages", () => __awaiter(void 0, void 0, void 0, function* () {
        yield client.lPush("messages", ["msg1", "msg2"]);
        const response = yield (0, supertest_1.default)(app).get("/messages");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual(["msg2", "msg1"]);
    }));
});
