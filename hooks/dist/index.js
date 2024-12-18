"use strict";
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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = new client_1.PrismaClient();
//below is the webhook handler, for example, a webhook URL provided by the zapier is inserted into the github.
//imagine now that someone commented on github and this webhook URL is hitted
//below code basically stores in the zaprun what needs to be done like to send email when someone commented on github.
app.post("/hooks/catch/:userId/:zapId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const run = yield client.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body,
            },
        });
        console.log("zap run done");
        yield client.zapRunOutbox.create({
            data: {
                zapRunId: run.id,
            },
        });
    }));
    console.log("zap");
    res.json({
        message: "Webhook received",
    });
    //store in db a new trigger
    //push it on  to a queue(kafka/redis)
}));
app.listen(3002);
