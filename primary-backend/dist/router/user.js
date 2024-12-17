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
exports.userRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    const parsedData = types_1.SignupSchema.safeParse(body);
    if (!parsedData.success) {
        res.status(411).json({
            message: "Incorrect Inputs",
        });
    }
    const userExists = yield db_1.prismaClient.user.findFirst({
        where: {
            email: (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.username,
        },
    });
    if (userExists) {
        res.status(411).json({
            message: "User already exists",
        });
    }
    if (parsedData.data) {
        yield db_1.prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                password: parsedData.data.password,
                name: parsedData.data.name,
            },
        });
    }
    res.json({
        message: "Please verify your account from us",
    });
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const body = req.body;
    const parsedData = types_1.SigninSchema.safeParse(body);
    if (!parsedData.success) {
        res.status(411).json({
            message: "Incorrect Inputs",
        });
    }
    const user = yield db_1.prismaClient.user.findFirst({
        where: {
            email: (_a = parsedData.data) === null || _a === void 0 ? void 0 : _a.username,
            password: (_b = parsedData.data) === null || _b === void 0 ? void 0 : _b.password,
        },
    });
    if (!user) {
        res.status(403).json({
            message: "Sorry credentials are incorrect",
        });
    }
    //sign the jwt
    const token = jsonwebtoken_1.default.sign({
        id: user === null || user === void 0 ? void 0 : user.id,
    }, config_1.JWT_PASSWORD);
    res.json({
        token: token,
    });
}));
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    console.log("this is the req id ", id);
    const user = yield db_1.prismaClient.user.findFirst({
        where: {
            id,
        },
        select: {
            name: true,
            email: true,
        },
    });
    res.json({
        user,
    });
}));
exports.userRouter = router;
