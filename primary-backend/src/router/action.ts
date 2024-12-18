import { Router } from "express";
import { prismaClient } from "../db";

const router = Router();

router.get("/available", async (req, res) => {
  const availableActions = await prismaClient.availableAction.findMany({});
  console.log(availableActions);
  res.json({
    availableActions,
  });
});

export const actionRouter = router;
