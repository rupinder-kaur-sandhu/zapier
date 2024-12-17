import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
const client = new PrismaClient();

//below is the webhook handler, for example, a webhook URL provided by the zapier is inserted into the github.
//imagine now that someone commented on github and this webhook URL is hitted
//below code basically stores in the zaprun what needs to be done like to send email when someone commented on github.
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const userId = req.params.userId;
  const zapId = req.params.zapId;
  const body = req.body;

  await client.$transaction(async (tx) => {
    const run = await client.zapRun.create({
      data: {
        zapId: zapId,
        metadata: body,
      },
    });

    await client.zapRunOutbox.create({
      data: {
        zapRunId: run.id,
      },
    });
  });

  res.json({
    message: "Webhook received",
  });
  //store in db a new trigger
  //push it on  to a queue(kafka/redis)
});

app.listen(3000);
