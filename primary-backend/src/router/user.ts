import { Router } from "express";
import { prismaClient } from "../db";
import { authMiddleware } from "../middleware";
import { SigninSchema, SignupSchema } from "../types";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";

const router = Router();

router.post("/signup", async (req, res) => {
  const body = req.body;
  const parsedData = SignupSchema.safeParse(body);

  if (!parsedData.success) {
    res.status(411).json({
      message: "Incorrect Inputs",
    });
  }

  const userExists = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data?.username,
    },
  });

  if (userExists) {
    res.status(411).json({
      message: "User already exists",
    });
  }

  if (parsedData.data) {
    await prismaClient.user.create({
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
});

router.post("/signin", async (req, res) => {
  const body = req.body;
  const parsedData = SigninSchema.safeParse(body);

  if (!parsedData.success) {
    res.status(411).json({
      message: "Incorrect Inputs",
    });
  }

  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data?.username,
      password: parsedData.data?.password,
    },
  });

  if (!user) {
    res.status(403).json({
      message: "Sorry credentials are incorrect",
    });
  }

  //sign the jwt
  const token = jwt.sign(
    {
      id: user?.id,
    },
    JWT_PASSWORD
  );

  res.json({
    token: token,
  });
});

router.get("/", authMiddleware, async (req, res) => {
  //@ts-ignore
  const id = req.id;
  console.log("this is the req id ", id);
  const user = await prismaClient.user.findFirst({
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
});

export const userRouter = router;
