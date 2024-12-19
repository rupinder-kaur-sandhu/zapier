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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prismaClient = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prismaClient.availableTrigger.create({
            data: {
                id: "webhook",
                name: "Webhook",
                image: "https://mailparser.io/wp-content/uploads/2018/08/what-is-a-webhook-1024x536.jpeg",
            },
        });
        yield prismaClient.availableAction.create({
            data: {
                id: "Email",
                name: "Email",
                image: "https://media.istockphoto.com/id/1396661192/vector/message-line-icon-with-editable-stroke-suitable-for-web-page-mobile-app-ui-ux-and-gui-design.jpg?s=612x612&w=0&k=20&c=SQe95UgUSQNzDiMrWYgscokW74LoD8BLTEs8voM_7nQ=",
            },
        });
        yield prismaClient.availableAction.create({
            data: {
                id: "Solana",
                name: "Solana",
                image: "https://pbs.twimg.com/profile_images/1472933274209107976/6u-LQfjG_400x400.jpg",
            },
        });
    });
}
main();
